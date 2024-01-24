
import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";


import { expect } from "chai";
import hre from "hardhat";
// import { getAddress, parseGwei, Account } from "viem";


//import "@nomicfoundation/hardhat-chai-matchers";


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


    describe("Deployment", function () {
        it("Should deploy the contract with no issues", async function () {
            const { mediumAccess, owner } = await loadFixture(deployContract);
            expect((await mediumAccess.read.owner()).toLowerCase()).to.equal(owner.account.address);
        })
    })

    describe("Utils", function () {
        it("Should match for id creation", async function () {
            const { mediumAccess, owner, otherAccount } = await loadFixture(deployContract);

            const articleId = BigInt(10);
            const isPaying = true;

            const tokenId = await mediumAccess.read.createTokenId([otherAccount.account.address, articleId, isPaying]);
            const [articleCreator, fetchedArticleId, fetchedIsPaying] = await mediumAccess.read.parseTokenId([tokenId]);

            expect(articleCreator.toLowerCase()).to.equal(otherAccount.account.address.toLowerCase());
            expect(fetchedArticleId).to.equal(articleId);
            expect(isPaying).to.equal(fetchedIsPaying);
        })

    })


    describe("Mints", function () {
        it("Author can mint a token representing a new article", async function () {
            const { mediumAccess, owner, otherAccount } = await loadFixture(deployContract);
            const tokenId = await mediumAccess.read.createTokenId([owner.account.address, BigInt(0), true]);

            await mediumAccess.write.mint([
                owner.account.address,
                tokenId,
                BigInt(1),
                "0x"]
                ,
                { account: owner.account })

        })

        it("Reader can mint a token for a free article", async function () {
            const { mediumAccess, owner, otherAccount } = await loadFixture(deployContract);

            const tokenId = await mediumAccess.read.createTokenId([owner.account.address, BigInt(0), false]);

            await mediumAccess.write.mint([
                owner.account.address,
                tokenId,
                BigInt(1),
                "0x"]
                ,
                { account: owner.account })


            await mediumAccess.write.mint([
                otherAccount.account.address,
                tokenId,
                BigInt(1),
                "0x"]
                ,
                { account: otherAccount.account, value: BigInt(0) });

        })

        it("Reader can mint a token for a paying article", async function () {
            const { mediumAccess, owner, otherAccount } = await loadFixture(deployContract);

            const tokenId = await mediumAccess.read.createTokenId([owner.account.address, BigInt(0), true]);

            await mediumAccess.write.mint([
                owner.account.address,
                tokenId,
                BigInt(1),
                "0x"]
                ,
                { account: owner.account })

            const mintPrice = await mediumAccess.read.mintPrice();

            await mediumAccess.write.mint([
                otherAccount.account.address,
                tokenId,
                BigInt(1),
                "0x"]
                ,
                { account: otherAccount.account, value: mintPrice });

        })

        it("Reader fails to mint a token for a paying article by not providing funds", async function () {
            const { mediumAccess, owner, otherAccount } = await loadFixture(deployContract);

            const tokenId = await mediumAccess.read.createTokenId([owner.account.address, BigInt(0), true]);

            await mediumAccess.write.mint([
                owner.account.address,
                tokenId,
                BigInt(1),
                "0x"]
                ,
                { account: owner.account }) //.to.be.revertedWith("InvalidFunds")



            await expect(
                mediumAccess.write.mint([
                    otherAccount.account.address,
                    tokenId,
                    BigInt(1),
                    "0x"]
                    ,
                    { account: otherAccount.account, value: BigInt(0) })
            ).to.be.rejectedWith("InvalidFunds") //With("InvalidFunds")

        })


        it("Author cannot mint non-sequential token", async function () {
            const { mediumAccess, owner, otherAccount } = await loadFixture(deployContract);

            const tokenId = await mediumAccess.read.createTokenId([owner.account.address, BigInt(0), true]);

            await mediumAccess.write.mint([
                owner.account.address,
                tokenId,
                BigInt(1),
                "0x"]
                ,
                { account: owner.account })

            const tokenId2 = await mediumAccess.read.createTokenId([owner.account.address, BigInt(2), true]);


            await expect(mediumAccess.write.mint([
                owner.account.address,
                tokenId2,
                BigInt(1),
                "0x"]
                ,
                { account: owner.account })).to.be.rejectedWith("ArticleIdNonSequential")
        })


        it("Author cannot re-mint an already existing token", async function () {
            const { mediumAccess, owner, otherAccount } = await loadFixture(deployContract);

            const tokenId = await mediumAccess.read.createTokenId([owner.account.address, BigInt(0), true]);

            await mediumAccess.write.mint([
                owner.account.address,
                tokenId,
                BigInt(1),
                "0x"]
                ,
                { account: owner.account })

            await expect(mediumAccess.write.mint([
                owner.account.address,
                tokenId,
                BigInt(1),
                "0x"]
                ,
                { account: owner.account })).to.be.rejectedWith("ArticleIdNonSequential")
        })
    })
})
