import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";


import { expect } from "chai";
import { assert } from "console";
import hre from "hardhat";

import { toBytes, bytesToHex } from 'viem'

import { parseTokenId, createTokenId } from "summit-utils";



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


    describe("Utils", function () {
        it("Id should be matching in Solidity", async function () {
            const { bnmToken, summit, summitReceiver, articleWriter, contractOwner, userLambda } = await loadFixture(deployContracts);

            [articleWriter.account.address, contractOwner.account.address, userLambda.account.address].forEach((addr) => {
                [BigInt(0), BigInt(10), BigInt(4684)].forEach((articleId) => {
                    [false, true].forEach(async (isPaying) => {
                        let tokenId = await summit.read.createTokenId([addr, articleId, isPaying]);
                        let [parsedAddress, parsedArticleId, parsedIsPaying] = await summit.read.parseTokenId([tokenId]);
                        expect(addr).to.eq(parsedAddress.toLowerCase());
                        expect(articleId).to.eq(parsedArticleId)
                        expect(isPaying).to.eq(parsedIsPaying);
                    })
                })
            })
        })

        it("Id should be matching between solidity and TS implementations", async function () {
            const { bnmToken, summit, summitReceiver, articleWriter, contractOwner, userLambda } = await loadFixture(deployContracts);

            [articleWriter.account.address, contractOwner.account.address, userLambda.account.address].forEach((addr) => {
                [BigInt(0), BigInt(10), BigInt(4684)].forEach((articleId) => {
                    [false, true].forEach(async (isPaying) => {
                        let tokenId = await summit.read.createTokenId([addr, articleId, isPaying]);

                        let tsTokenId = createTokenId(addr, articleId, isPaying);
                        expect(tokenId).to.eq(tsTokenId);

                        /*
                        let [parsedAddress, parsedArticleId, parsedIsPaying] = await summit.read.parseTokenId([tokenId]);
                        expect(addr).to.eq(parsedAddress.toLowerCase());
                        expect(articleId).to.eq(parsedArticleId)
                        expect(isPaying).to.eq(parsedIsPaying);
                        */


                    })
                })
            })

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
        describe("Minting Id Validation", function () {
            it("Initial article mint must have articleId == 0", async function () {
                const { summit, bnmToken, summitReceiver, contractOwner, articleWriter } = await loadFixture(deployContracts);

                // try with free article 
                let tokenId = await summit.read.createTokenId(
                    [articleWriter.account.address, BigInt(2), false]
                );

                // create the article 
                await expect(bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleWriter.account
                    }
                )).to.be.rejectedWith("ArticleIdNonSequential");

                // try with paying article 
                tokenId = await summit.read.createTokenId(
                    [articleWriter.account.address, BigInt(2), true]
                );

                // create the article 
                await expect(bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleWriter.account
                    }
                )).to.be.rejectedWith("ArticleIdNonSequential");
            })

            it("Creation of free article must have sequential article IDs", async function () {
                const { summit, bnmToken, summitReceiver, contractOwner, articleWriter } = await loadFixture(deployContracts);

                for (let i = 0; i < 6; i++) {
                    let tokenId = await summit.read.createTokenId(
                        [articleWriter.account.address, BigInt(i), false]
                    );

                    let invalidTokenId = await summit.read.createTokenId(
                        [articleWriter.account.address, BigInt(i + 1), false]
                    );

                    // try create article for i + 1
                    await expect(bnmToken.write.transferAndCall(
                        [
                            summitReceiver.address,
                            BigInt(0),
                            bytesToHex(toBytes(invalidTokenId))
                        ],
                        {
                            account: articleWriter.account
                        }
                    )).to.be.rejectedWith("ArticleIdNonSequential");

                    // create the article for i 
                    await bnmToken.write.transferAndCall(
                        [
                            summitReceiver.address,
                            BigInt(0),
                            bytesToHex(toBytes(tokenId))
                        ],
                        {
                            account: articleWriter.account
                        }
                    );
                }
            })

            it("Creation of paying article must have sequential article IDs", async function () {
                const { summit, bnmToken, summitReceiver, contractOwner, articleWriter } = await loadFixture(deployContracts);

                for (let i = 0; i < 6; i++) {
                    let tokenId = await summit.read.createTokenId(
                        [articleWriter.account.address, BigInt(i), true]
                    );

                    let invalidTokenId = await summit.read.createTokenId(
                        [articleWriter.account.address, BigInt(i + 1), true]
                    );

                    // try create article for i + 1
                    await expect(bnmToken.write.transferAndCall(
                        [
                            summitReceiver.address,
                            BigInt(0),
                            bytesToHex(toBytes(invalidTokenId))
                        ],
                        {
                            account: articleWriter.account
                        }
                    )).to.be.rejectedWith("ArticleIdNonSequential");

                    // create the article for i 
                    await bnmToken.write.transferAndCall(
                        [
                            summitReceiver.address,
                            BigInt(0),
                            bytesToHex(toBytes(tokenId))
                        ],
                        {
                            account: articleWriter.account
                        }
                    );
                }
            })


            it("Free Article creation with sequential Ids are successful", async function () {
                const { summit, bnmToken, summitReceiver, contractOwner, articleWriter } = await loadFixture(deployContracts);

                for (let i = 0; i < 16; i++) {
                    const tokenId = await summit.read.createTokenId(
                        [articleWriter.account.address, BigInt(i), false]
                    );

                    // create the article 
                    await bnmToken.write.transferAndCall(
                        [
                            summitReceiver.address,
                            BigInt(0),
                            bytesToHex(toBytes(tokenId))
                        ],
                        {
                            account: articleWriter.account
                        }
                    );
                }
            })



            it("Paying Article creation with sequential Ids are successful", async function () {
                const { summit, bnmToken, summitReceiver, contractOwner, articleWriter } = await loadFixture(deployContracts);

                for (let i = 0; i < 16; i++) {
                    const tokenId = await summit.read.createTokenId(
                        [articleWriter.account.address, BigInt(i), true]
                    );

                    // create the article 
                    await bnmToken.write.transferAndCall(
                        [
                            summitReceiver.address,
                            BigInt(0),
                            bytesToHex(toBytes(tokenId))
                        ],
                        {
                            account: articleWriter.account
                        }
                    );
                }
            })

            it("Randomly Free or Paying Article creation with sequential Ids are successful", async function () {
                const { summit, bnmToken, summitReceiver, contractOwner, articleWriter } = await loadFixture(deployContracts);

                for (let i = 0; i < 16; i++) {
                    const tokenId = await summit.read.createTokenId(
                        [articleWriter.account.address, BigInt(i), Math.random() > 0.5]
                    );

                    // create the article 
                    await bnmToken.write.transferAndCall(
                        [
                            summitReceiver.address,
                            BigInt(0),
                            bytesToHex(toBytes(tokenId))
                        ],
                        {
                            account: articleWriter.account
                        }
                    );
                }
            })
        })

        describe("TransferAndCall - ERC677-based workflow", function () {
            it("Writer can create a new free article", async function () {
                const { bnmToken, summit, summitReceiver, articleWriter, articleReader, contractOwner } = await loadFixture(deployContracts);

                // create tokenId for minting 
                const tokenId = await summit.read.createTokenId(
                    [articleWriter.account.address, BigInt(0), false]
                );

                // create the article 
                await bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleWriter.account
                    }
                );
            })

            it("Writer can create a new paying article", async function () {
                const { bnmToken, summit, summitReceiver, articleWriter, articleReader, contractOwner } = await loadFixture(deployContracts);

                // create tokenId for minting 
                const tokenId = await summit.read.createTokenId(
                    [articleWriter.account.address, BigInt(0), true]
                );

                // create the article 
                await bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleWriter.account
                    }
                );
            })


            it("Reader can successfully mint existing free article", async function () {
                const { bnmToken, summit, summitReceiver, articleWriter, articleReader, contractOwner } = await loadFixture(deployContracts);

                // set role for minting 
                await bnmToken.write.grantMintRole([contractOwner.account.address]);
                // mint tokens 
                await bnmToken.write.mint([articleReader.account.address, BigInt(500)]);

                // create tokenId for minting 
                const tokenId = await summit.read.createTokenId(
                    [articleWriter.account.address, BigInt(0), false]
                );

                // create the article 
                await bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleWriter.account
                    }
                );

                // mint the token for the reader 
                await bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(100),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleReader.account
                    }
                ); //.to.be.rejectedWith("Unauthorized");
            })

            it("Reader can successfully mint existing paying article", async function () {
                const { bnmToken, summit, summitReceiver, articleWriter, articleReader, contractOwner } = await loadFixture(deployContracts);

                // set role for minting 
                await bnmToken.write.grantMintRole([contractOwner.account.address]);
                // mint tokens 
                await bnmToken.write.mint([articleReader.account.address, BigInt(500)]);

                const articlePrice = await summit.read.mintPrice();

                // direct payment endpoint will call target token, so here we try with the transferAndCall 
                // create tokenId for minting 
                const tokenId = await summit.read.createTokenId(
                    [articleWriter.account.address, BigInt(0), true]
                );

                // create the article 
                await bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleWriter.account
                    }
                );

                await bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        articlePrice,
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleReader.account
                    }
                );
            })


            it("Reader fails to mint non-existing free article with id 0 from unknown author", async function () {
                const { bnmToken, summit, summitReceiver, articleWriter, articleReader, contractOwner } = await loadFixture(deployContracts);

                // set role for minting 
                await bnmToken.write.grantMintRole([contractOwner.account.address]);
                // mint tokens 
                await bnmToken.write.mint([articleReader.account.address, BigInt(500)]);

                //const articlePrice = await summit.read.mintPrice();

                // direct payment endpoint will call target token, so here we try with the transferAndCall 
                // create tokenId for minting 
                const tokenId = await summit.read.createTokenId(
                    [articleWriter.account.address, BigInt(0), false]
                );

                await expect(bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleReader.account
                    }
                )).to.be.rejectedWith("NoArticlesByAuthor");
            })

            it("Reader fails to mint non-existing paying article with id 0 from unknown author", async function () {
                const { bnmToken, summit, summitReceiver, articleWriter, articleReader, contractOwner } = await loadFixture(deployContracts);

                // set role for minting 
                await bnmToken.write.grantMintRole([contractOwner.account.address]);
                // mint tokens 
                await bnmToken.write.mint([articleReader.account.address, BigInt(500)]);

                const articlePrice = await summit.read.mintPrice();

                // create tokenId for minting 
                const tokenId = await summit.read.createTokenId(
                    [articleWriter.account.address, BigInt(0), true]
                );

                await expect(bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        articlePrice,
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleReader.account
                    }
                )).to.be.rejectedWith("NoArticlesByAuthor");
            })

            it("Reader fails to mint non-existing free article with id non-0 from known author", async function () {
                const { bnmToken, summit, summitReceiver, articleWriter, articleReader, contractOwner } = await loadFixture(deployContracts);

                // set role for minting 
                await bnmToken.write.grantMintRole([contractOwner.account.address]);
                // mint tokens 
                await bnmToken.write.mint([articleReader.account.address, BigInt(500)]);

                //const articlePrice = await summit.read.mintPrice();

                // direct payment endpoint will call target token, so here we try with the transferAndCall 
                // create tokenId for minting 
                const tokenId = await summit.read.createTokenId(
                    [articleWriter.account.address, BigInt(0), false]
                );

                // create the article 
                await bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleWriter.account
                    }
                );


                const invalidTokenId = await summit.read.createTokenId(
                    [articleWriter.account.address, BigInt(4), false]
                );
                await expect(bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(invalidTokenId))
                    ],
                    {
                        account: articleReader.account
                    }
                )).to.be.rejectedWith("ArticleIdNotExist");
            })

            it("Reader fails to mint non-existing paying article with id non-0 from known author", async function () {
                const { bnmToken, summit, summitReceiver, articleWriter, articleReader, contractOwner } = await loadFixture(deployContracts);

                // set role for minting 
                await bnmToken.write.grantMintRole([contractOwner.account.address]);
                // mint tokens 
                await bnmToken.write.mint([articleReader.account.address, BigInt(500)]);

                const articlePrice = await summit.read.mintPrice();

                // direct payment endpoint will call target token, so here we try with the transferAndCall 
                // create tokenId for minting 
                const tokenId = await summit.read.createTokenId(
                    [articleWriter.account.address, BigInt(0), false]
                );

                // create the article 
                await bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleWriter.account
                    }
                );


                const invalidTokenId = await summit.read.createTokenId(
                    [articleWriter.account.address, BigInt(4), true]
                );
                await expect(bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        articlePrice,
                        bytesToHex(toBytes(invalidTokenId))
                    ],
                    {
                        account: articleReader.account
                    }
                )).to.be.rejectedWith("ArticleIdNotExist");
            })

            it("Reader fails to mint existing paying article with non-paying token id", async function () {
                const { bnmToken, summit, summitReceiver, articleWriter, articleReader, contractOwner } = await loadFixture(deployContracts);

                // set role for minting 
                await bnmToken.write.grantMintRole([contractOwner.account.address]);
                // mint tokens 
                await bnmToken.write.mint([articleReader.account.address, BigInt(500)]);

                //const articlePrice = await summit.read.mintPrice();

                // direct payment endpoint will call target token, so here we try with the transferAndCall 
                // create tokenId for minting 
                const tokenId = await summit.read.createTokenId(
                    [articleWriter.account.address, BigInt(0), true]
                );

                // create the article 
                await bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleWriter.account
                    }
                );


                const invalidTokenId = await summit.read.createTokenId(
                    [articleWriter.account.address, BigInt(0), false]
                );
                await expect(bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(invalidTokenId))
                    ],
                    {
                        account: articleReader.account
                    }
                )).to.be.rejectedWith("TokenIdNotExist");
            })


            it("Reader fails to mint existing free article with paying token id", async function () {
                const { bnmToken, summit, summitReceiver, articleWriter, articleReader, contractOwner } = await loadFixture(deployContracts);

                // set role for minting 
                await bnmToken.write.grantMintRole([contractOwner.account.address]);
                // mint tokens 
                await bnmToken.write.mint([articleReader.account.address, BigInt(500)]);

                //const articlePrice = await summit.read.mintPrice();

                // direct payment endpoint will call target token, so here we try with the transferAndCall 
                // create tokenId for minting 
                const tokenId = await summit.read.createTokenId(
                    [articleWriter.account.address, BigInt(0), false]
                );

                // create the article 
                await bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleWriter.account
                    }
                );


                const invalidTokenId = await summit.read.createTokenId(
                    [articleWriter.account.address, BigInt(0), true]
                );
                await expect(bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(invalidTokenId))
                    ],
                    {
                        account: articleReader.account
                    }
                )).to.be.rejectedWith("TokenIdNotExist");
            })
        })

        describe("Withdrawal", function () {
            it("Successful withdrawal after paying article", async function () {
                const { bnmToken, summit, summitReceiver, articleWriter, articleReader, contractOwner } = await loadFixture(deployContracts);
                // set role for minting 
                await bnmToken.write.grantMintRole([contractOwner.account.address]);
                // mint tokens 
                await bnmToken.write.mint([articleReader.account.address, BigInt(500)]);

                // create tokenId for minting 
                const tokenId = await summit.read.createTokenId(
                    [articleWriter.account.address, BigInt(0), true]
                );

                // create the article 
                await bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleWriter.account
                    }
                );

                // user mints an article 
                const articlePrice = await summit.read.mintPrice();
                await bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        articlePrice,
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleReader.account,
                    }
                );

                // check writer's balance on summit
                expect(
                    await summit.read.aggregated([articleWriter.account.address])
                ).to.be.eq(articlePrice);

                // and now try to withdraw and check final balance 
                await summit.write.withdraw(
                    {
                        account: articleWriter.account,
                    }
                );

                // check balance in ERC20 to see if withdrawal was successful 
                expect(
                    await bnmToken.read.balanceOf([articleWriter.account.address])
                ).to.be.eq(articlePrice);

                // check that balance on summit was wiped 
                expect(
                    await summit.read.aggregated([articleWriter.account.address])
                ).to.be.eq(BigInt(0));


            })
        })
    })
})