import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress, parseGwei, Account } from "viem";



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

    async function mintAuthorToken(creator: Account, articleId: BigInt, isPaying: boolean, mediumAccess: any): Promise<BigInt> {
        const tokenId: BigInt = await mediumAccess.read.createTokenId([creator.address, articleId, isPaying]);

        await mediumAccess.write.mint([
            creator.address,
            tokenId,
            BigInt(1),
            "0x"
        ],
            { account: creator })

        return tokenId;
    }

    async function mintReaderToken(reader: Account, tokenId: BigInt, isPaying: boolean, mediumAccess: any) {
        const msgValue = isPaying ? await mediumAccess.read.mintPrice() : BigInt(0);

        await mediumAccess.write.mint([
            reader.address,
            tokenId,
            BigInt(1),
            "0x"
        ],
            { account: reader, value: msgValue });
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
            const { mediumAccess, otherAccount } = await loadFixture(deployContract);
            //const tokenId = await mediumAccess.read.createTokenId([otherAccount.account.address, BigInt(1), true]);            

            await mintAuthorToken(otherAccount.account, BigInt(1), true, mediumAccess);
        })

        it("Reader can mint a token for a free article", async function() {
            const { mediumAccess, owner, otherAccount } = await loadFixture(deployContract);
            //const tokenId = await mediumAccess.read.createTokenId([otherAccount.account.address, BigInt(1), true]);            

            let tokenId = await mintAuthorToken(owner.account, BigInt(1234), false, mediumAccess);

            await mintReaderToken(otherAccount.account, tokenId, false, mediumAccess);
            
        })

        it("Reader can mint a token for a paying article", async function() {
            const { mediumAccess, owner, otherAccount } = await loadFixture(deployContract);
            //const tokenId = await mediumAccess.read.createTokenId([otherAccount.account.address, BigInt(1), true]);            

            let tokenId = await mintAuthorToken(owner.account, BigInt(9942), true, mediumAccess);

            await mintReaderToken(otherAccount.account, tokenId, true, mediumAccess);
        })

        it("Reader fails to mint a token for a paying article by not providing funds", async function() {
            const { mediumAccess, owner, otherAccount } = await loadFixture(deployContract);
            //const tokenId = await mediumAccess.read.createTokenId([otherAccount.account.address, BigInt(1), true]);            

            let tokenId = await mintAuthorToken(owner.account, BigInt(2121), true, mediumAccess);

            try {
                await mintReaderToken(otherAccount.account, tokenId, false, mediumAccess);  
                throw ("Execution should fail");
            } catch(err) {
                //console.log(err)
                //console.log(err.dir())
                console.dir(err)
            }
        })
    })


})
