import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";


import { expect } from "chai";
import hre from "hardhat";



describe("Summit", function () {
    async function deployContracts() {
        const [owner, otherAccount] = await hre.viem.getWalletClients();

        // deploy token 
        const bnm = await hre.viem.deployContract("BnMToken", [], {
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
        const ccipReceiver = await hre.viem.deployContract("SummitReceiver", [owner.account.address, owner.account.address, bnm.address], {
        });

        // deploy Summit 
        const summit = await hre.viem.deployContract("Summit", [owner.account.address, ccipReceiver.address, BigInt(100)], {
        });

        // update target in ccipReceiver 
        ccipReceiver.write.updateTarget([summit.address]);


        const publicClient = await hre.viem.getPublicClient();

        return {
            bnm,
            ccipReceiver,
            summit,
            owner,
            otherAccount,
            publicClient
        }
    }


    describe("Deployment", function () {
        it("Should deploy the contract with no issues", async function () {
            const { summit, owner } = await loadFixture(deployContracts);
            expect((await summit.read.owner()).toLowerCase()).to.equal(owner.account.address);
        })
    })

})