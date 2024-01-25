import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";


import { expect } from "chai";
import { assert } from "console";
import hre from "hardhat";

import { toBytes, bytesToHex } from 'viem'


describe("Summit", function () {
    async function deployContracts() {
        const [contractOwner, articleWriter, articleReader, userLambda] = await hre.viem.getWalletClients();

        // deploy token for payments
        const bnmToken = await hre.viem.deployContract("BnMToken", [], {
        });

        // deploy router 
        // actually, don't deploy router, just use a 0x address for now 
        /*
        const router = await hre.viem.deployContract("CcipRouter", [], {
        });
        */

        // deploy receiver 
        // router cannot be 0x, so need to set a random address for now 
        // target also cannot be 0x
        const summitReceiver = await hre.viem.deployContract("SummitReceiver",
            [contractOwner.account.address, contractOwner.account.address, bnmToken.address], {
        });

        // deploy Summit 
        const summit = await hre.viem.deployContract("Summit", [contractOwner.account.address, summitReceiver.address, BigInt(100)], {
        });

        // update target in ccipReceiver 
        await summitReceiver.write.updateTarget([summit.address]);


        const publicClient = await hre.viem.getPublicClient();

        return {
            bnmToken,
            summitReceiver,
            summit,
            contractOwner,
            articleWriter,
            articleReader,
            userLambda,
            publicClient
        }
    }


    describe("Deployment", function () {
        it("Should deploy the contract with no issues", async function () {
            const { summit, contractOwner } = await loadFixture(deployContracts);
            expect((await summit.read.owner()).toLowerCase()).to.equal(contractOwner.account.address);
        })

        it("SummitReceiver target should be Summit smart contract", async function () {
            const { summit, summitReceiver } = await loadFixture(deployContracts);

            expect(
                (await summitReceiver.read.target()).toLowerCase()
            ).to.equal(summit.address);
        })
    })


    describe("Utils", function() {
        it("Id should be matching", async function() {


        })


    })

    describe("Receiver", function () {
        it("Receiver should reject payment from non-target token", async function () {
            const { bnmToken, summit, summitReceiver, articleWriter, contractOwner, userLambda } = await loadFixture(deployContracts);

            // create a new token 
            const invalidToken = await hre.viem.deployContract("BnMToken");

            // add a check that the 2 tokens don't share the same address
            assert(bnmToken.address != invalidToken.address);

            // set role for minting 
            await invalidToken.write.grantMintRole([contractOwner.account.address]);
            // mint tokens 
            await invalidToken.write.mint([userLambda.account.address, BigInt(500)]);

            // direct payment endpoint will call target token, so here we try with the transferAndCall 
            // create tokenId for minting 
            const tokenId = await summit.read.createTokenId(
                [articleWriter.account.address, BigInt(0), false]
            );
            await expect(invalidToken.write.transferAndCall(
                [
                    summitReceiver.address,
                    BigInt(100),
                    bytesToHex(toBytes(tokenId))

                ],
                {
                    account: userLambda.account
                }
            )).to.be.rejectedWith("Unauthorized");

        })

    })

    describe("Minting", function () {
        describe("Direct Payment - Approval-based workflow", function() {
            it("Writer can create a new free article", async function () {
                const { summit, bnmToken, summitReceiver, contractOwner, articleWriter } = await loadFixture(deployContracts);
    
                // create token ID for a non paying article
                const tokenId = await summit.read.createTokenId(
                    [articleWriter.account.address, BigInt(0), false]
                );
    
                // call receiver to mint the token
                await summitReceiver.write.directPayment(
                    [tokenId, BigInt(0), "0x"],
                    { account: articleWriter.account }
                );
            })
        })

        /*
        describe("TransferAndCall - ERC677-based workflow", function() {
            it("Writer can create a new free article", async function () {
                throw "Not implemented - Need to check for general message passing in this case"

            })
        })
        */



    })
})