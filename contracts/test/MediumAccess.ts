import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress, parseGwei } from "viem";



describe("MediumAccess", function () {
    async function deployContract() {
        const [owner, otherAccount] = await hre.viem.getWalletClients();

        const mediumAccess = await hre.viem.deployContract("MediumAccess", [owner.account.address, BigInt(100)], {
        });

        const publicClient = await hre.viem.getPublicClient();

        return {
            mediumAccess,
            owner,
            otherAccount,
            publicClient
        }
    }


    describe("Deployment", function() {
        it("Should deploy the contract with no issues", async function() {
            const { mediumAccess, owner  } = await loadFixture(deployContract);

            expect ((await mediumAccess.read.owner()).toLowerCase()).to.equal(owner.account.address);            
        })
    })

    describe("Utils", function() {
        it("Should match for id creation", async function() {
            const { mediumAccess, owner, otherAccount  } = await loadFixture(deployContract);

            const articleId = BigInt(10);
            const isPaying = true;

            const tokenId = await mediumAccess.read.createTokenId([otherAccount.account.address, articleId, isPaying]);
            const [articleCreator, fetchedArticleId, fetchedIsPaying] = await mediumAccess.read.parseTokenId([tokenId]);

            expect (articleCreator.toLowerCase()).to.equal(otherAccount.account.address.toLowerCase());
            expect(fetchedArticleId).to.equal(articleId);
            expect(isPaying).to.equal(fetchedIsPaying);
        })

    })

    /*
    describe("Mints", function() {
        it("Author can mint a token representing a new article", async function() {
            const { mediumAccess, otherAccount } = await loadFixture(deployContract);
            
            const tokenId = await mediumAccess.read.createTokenId([otherAccount.account.address, BigInt(1), true]);

            await mediumAccess.write.mint([
                otherAccount.account.address,
                tokenId, 
                BigInt(1),
                "0x"
            ])

        })
    })
    */

})
