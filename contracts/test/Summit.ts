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
        const [contractOwner, articleWriter, articleReader, userLambda, userLambda2, accessController] = await hre.viem.getWalletClients();

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
            [contractOwner.account.address, "0x0000000000000000000000000000000000000000", bnmToken.address], {
        });

        // deploy Summit 
        const summit = await hre.viem.deployContract(
            "Summit", 
            [
                contractOwner.account.address, 
                accessController.account.address, 
                summitReceiver.address, 
                BigInt(100), 
                "https://samplewebsite.org/api/{id}"], 
        {
        });

        // update target in ccipReceiver 
        await summitReceiver.write.updateTarget([summit.address]);

        // allow all addresses in AccessControl 
        for (const currAddr of [contractOwner, articleWriter, articleReader, userLambda, userLambda2]) {
            await summit.write.setAccessStatus([currAddr.account.address, 1], {account: accessController.account});
        }


        const publicClient = await hre.viem.getPublicClient();

        return {
            bnmToken,
            summitReceiver,
            summit,
            contractOwner,
            articleWriter,
            articleReader,
            userLambda,
            userLambda2,
            accessController,
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

        it("Summit should reject invalid receiver", async function () {
            const { bnmToken, summit, summitReceiver, articleWriter, contractOwner, userLambda } = await loadFixture(deployContracts);

            // set role for minting 
            await bnmToken.write.grantMintRole([contractOwner.account.address]);
            // mint tokens 
            await bnmToken.write.mint([userLambda.account.address, BigInt(500)]);

            // create a new receiver 
            const invalidReceiver = await hre.viem.deployContract("SummitReceiver",
                [contractOwner.account.address, summit.address, bnmToken.address], {
            });

            // we try with the transferAndCall 
            // create tokenId for minting 
            const tokenId = await summit.read.createTokenId(
                [articleWriter.account.address, BigInt(0), false]
            );

            // try to call with invalid receiver 
            await expect(bnmToken.write.transferAndCall(
                [
                    invalidReceiver.address,
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

        it("Successful withdrawal after free article", async function () {
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

            // user mints an article 
            const supportAmount = BigInt(250);
            await bnmToken.write.transferAndCall(
                [
                    summitReceiver.address,
                    supportAmount,
                    bytesToHex(toBytes(tokenId))
                ],
                {
                    account: articleReader.account,
                }
            );

            // check writer's balance on summit
            expect(
                await summit.read.aggregated([articleWriter.account.address])
            ).to.be.eq(supportAmount);

            // and now try to withdraw and check final balance 
            await summit.write.withdraw(
                {
                    account: articleWriter.account,
                }
            );

            // check balance in ERC20 to see if withdrawal was successful 
            expect(
                await bnmToken.read.balanceOf([articleWriter.account.address])
            ).to.be.eq(supportAmount);

            // check that balance on summit was wiped 
            expect(
                await summit.read.aggregated([articleWriter.account.address])
            ).to.be.eq(BigInt(0));
        })

        it("Successful withdrawal after multiple payments on single paying article", async function () {
            const { bnmToken, summit, summitReceiver, articleWriter, articleReader, contractOwner, userLambda, userLambda2 } = await loadFixture(deployContracts);
            // set role for minting 
            await bnmToken.write.grantMintRole([contractOwner.account.address]);

            // define our readers 
            const readerAccounts = [contractOwner, articleReader, userLambda, userLambda2];

            // mint tokens 
            for (const currAccount of readerAccounts) {
                await bnmToken.write.mint([currAccount.account.address, BigInt(500)]);
            }

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

            // readers mints the article 
            const articlePrice = await summit.read.mintPrice();

            for (const currAccount of readerAccounts) {
                await bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        articlePrice,
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: currAccount.account,
                    }
                );
            }


            // check writer's balance on summit
            expect(
                await summit.read.aggregated([articleWriter.account.address])
            ).to.be.eq(articlePrice * BigInt(readerAccounts.length));


            // and now try to withdraw and check final balance 
            await summit.write.withdraw(
                {
                    account: articleWriter.account,
                }
            );

            // check balance in ERC20 to see if withdrawal was successful 
            expect(
                await bnmToken.read.balanceOf([articleWriter.account.address])
            ).to.be.eq(articlePrice * BigInt(readerAccounts.length));

            // check that balance on summit was wiped 
            expect(
                await summit.read.aggregated([articleWriter.account.address])
            ).to.be.eq(BigInt(0));
        })

        it("Successful withdrawal after multiple payments on single free article", async function () {
            const { bnmToken, summit, summitReceiver, articleWriter, articleReader, contractOwner, userLambda, userLambda2 } = await loadFixture(deployContracts);
            // set role for minting 
            await bnmToken.write.grantMintRole([contractOwner.account.address]);

            // define our readers 
            const readerAccounts = [contractOwner, articleReader, userLambda, userLambda2];

            // mint tokens 
            for (const currAccount of readerAccounts) {
                await bnmToken.write.mint([currAccount.account.address, BigInt(500)]);
            }

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

            // readers mints the article 
            const supportPrice = BigInt(123);

            for (const currAccount of readerAccounts) {
                await bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        supportPrice,
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: currAccount.account,
                    }
                );
            }


            // check writer's balance on summit
            expect(
                await summit.read.aggregated([articleWriter.account.address])
            ).to.be.eq(supportPrice * BigInt(readerAccounts.length));


            // and now try to withdraw and check final balance 
            await summit.write.withdraw(
                {
                    account: articleWriter.account,
                }
            );

            // check balance in ERC20 to see if withdrawal was successful 
            expect(
                await bnmToken.read.balanceOf([articleWriter.account.address])
            ).to.be.eq(supportPrice * BigInt(readerAccounts.length));

            // check that balance on summit was wiped 
            expect(
                await summit.read.aggregated([articleWriter.account.address])
            ).to.be.eq(BigInt(0));
        })

        it("Successful withdrawal after multiple payments on multiple free articles", async function () {
            const { bnmToken, summit, summitReceiver, articleWriter, articleReader, contractOwner, userLambda, userLambda2 } = await loadFixture(deployContracts);
            // set role for minting 
            await bnmToken.write.grantMintRole([contractOwner.account.address]);

            // define our readers 
            const readerAccounts = [contractOwner, articleReader, userLambda, userLambda2];

            // mint tokens 
            for (const currAccount of readerAccounts) {
                await bnmToken.write.mint([currAccount.account.address, BigInt(500)]);
            }

            // create tokenId for minting 
            const tokenId = await summit.read.createTokenId(
                [articleWriter.account.address, BigInt(0), false]
            );

            const supportPrice = BigInt(123);
            const articlesToMint = 4;

            for (let articleId = 0; articleId < articlesToMint; articleId++) {
                // create the article 
                const tokenId = await summit.read.createTokenId(
                    [articleWriter.account.address, BigInt(articleId), false]
                );

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

                // have the readers mint the article 
                for (const currAccount of readerAccounts) {
                    await bnmToken.write.transferAndCall(
                        [
                            summitReceiver.address,
                            supportPrice,
                            bytesToHex(toBytes(tokenId))
                        ],
                        {
                            account: currAccount.account,
                        }
                    );
                }
            }

            // check writer's balance on summit
            const expectedBalance = BigInt(articlesToMint) * supportPrice * BigInt(readerAccounts.length);
            expect(
                await summit.read.aggregated([articleWriter.account.address])
            ).to.be.eq(expectedBalance);

            // and now try to withdraw and check final balance 
            await summit.write.withdraw(
                {
                    account: articleWriter.account,
                }
            );

            // check balance in ERC20 to see if withdrawal was successful 
            expect(
                await bnmToken.read.balanceOf([articleWriter.account.address])
            ).to.be.eq(expectedBalance);

            // check that balance on summit was wiped 
            expect(
                await summit.read.aggregated([articleWriter.account.address])
            ).to.be.eq(BigInt(0));
        })

        it("Successful withdrawal after multiple payments on multiple paying articles", async function () {
            const { bnmToken, summit, summitReceiver, articleWriter, articleReader, contractOwner, userLambda, userLambda2 } = await loadFixture(deployContracts);
            // set role for minting 
            await bnmToken.write.grantMintRole([contractOwner.account.address]);

            // define our readers 
            const readerAccounts = [contractOwner, articleReader, userLambda, userLambda2];

            // mint tokens 
            for (const currAccount of readerAccounts) {
                await bnmToken.write.mint([currAccount.account.address, BigInt(500)]);
            }

            // create tokenId for minting 
            const tokenId = await summit.read.createTokenId(
                [articleWriter.account.address, BigInt(0), true]
            );

            const articlePrice = await summit.read.mintPrice();
            const articlesToMint = 4;

            for (let articleId = 0; articleId < articlesToMint; articleId++) {
                // create the article 
                const tokenId = await summit.read.createTokenId(
                    [articleWriter.account.address, BigInt(articleId), false]
                );

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

                // have the readers mint the article 
                for (const currAccount of readerAccounts) {
                    await bnmToken.write.transferAndCall(
                        [
                            summitReceiver.address,
                            articlePrice,
                            bytesToHex(toBytes(tokenId))
                        ],
                        {
                            account: currAccount.account,
                        }
                    );
                }
            }

            // check writer's balance on summit
            const expectedBalance = BigInt(articlesToMint) * articlePrice * BigInt(readerAccounts.length);
            expect(
                await summit.read.aggregated([articleWriter.account.address])
            ).to.be.eq(expectedBalance);

            // and now try to withdraw and check final balance 
            await summit.write.withdraw(
                {
                    account: articleWriter.account,
                }
            );

            // check balance in ERC20 to see if withdrawal was successful 
            expect(
                await bnmToken.read.balanceOf([articleWriter.account.address])
            ).to.be.eq(expectedBalance);

            // check that balance on summit was wiped 
            expect(
                await summit.read.aggregated([articleWriter.account.address])
            ).to.be.eq(BigInt(0));
        })
    })


    describe("Access Control", function () {
        describe("General checks", function () {
            it("Can change access status", async function () {
                const { bnmToken, summit, summitReceiver, articleWriter, articleReader, contractOwner, userLambda, userLambda2, accessController } = await loadFixture(deployContracts);

                for (let i = 0; i < 3; i++) {
                    await summit.write.setAccessStatus([articleWriter.account.address, i], { account: accessController.account });
                    expect(await summit.read.accessStatusTracker([articleWriter.account.address])).to.be.eq(i);
                }
            })

            it("Unauthorized address cannot change access status", async function () {
                const { bnmToken, summit, summitReceiver, articleWriter, articleReader, contractOwner, userLambda, userLambda2 } = await loadFixture(deployContracts);

                await expect(summit.write.setAccessStatus([articleWriter.account.address, 1], { account: userLambda.account })).to.be.rejectedWith("Unauthorized");
            })

            it("Can modify access controller", async function () {
                const { bnmToken, summit, summitReceiver, articleWriter, articleReader, contractOwner, userLambda, userLambda2, accessController } = await loadFixture(deployContracts);

                // assert that userLambda cannot call this function 
                await expect(summit.write.setAccessStatus(
                    [articleWriter.account.address, 1],
                    { account: userLambda.account })
                ).to.be.rejectedWith("Unauthorized");

                // modify the access control admin to userLambda
                await summit.write.setAccessControlAdmin(
                    [userLambda.account.address],
                    { account: accessController.account }
                );

                // assert that userLambda can call the setAccess function
                await expect(summit.write.setAccessStatus(
                    [articleWriter.account.address, 1],
                    { account: userLambda.account })
                );

                // and the accessController cannot do so anymore 
                await expect(summit.write.setAccessStatus(
                    [articleWriter.account.address, 2],
                    { account: accessController.account })
                ).to.be.rejectedWith("Unauthorized");
            })
        })

        describe("Writer tests", function () {
            it("Unknown writer cannot mint", async function () {
                const { bnmToken, summit, summitReceiver, articleWriter, articleReader, contractOwner, userLambda, userLambda2, accessController } = await loadFixture(deployContracts);

                // current status is allowed for all addresses, switch for articleWriter
                await summit.write.setAccessStatus([articleWriter.account.address, 0], { account: accessController.account });

                // get token id
                const tokenId = await summit.read.createTokenId(
                    [articleWriter.account.address, BigInt(0), false]
                );

                // and try to mint 
                await expect(bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleWriter.account
                    }
                )).to.be.rejectedWith("NotAllowedAccess");
            })

            it("Banned writer cannot mint", async function () {
                const { bnmToken, summit, summitReceiver, articleWriter, articleReader, contractOwner, userLambda, userLambda2, accessController } = await loadFixture(deployContracts);

                // current status is allowed for all addresses, switch for articleWriter
                await summit.write.setAccessStatus([articleWriter.account.address, 2], { account: accessController.account });

                // get token id
                const tokenId = await summit.read.createTokenId(
                    [articleWriter.account.address, BigInt(0), false]
                );

                // and try to mint 
                await expect(bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleWriter.account
                    }
                )).to.be.rejectedWith("NotAllowedAccess");
            })

            it("Allowed writer can mint", async function () {
                const { bnmToken, summit, summitReceiver, articleWriter, articleReader, contractOwner, userLambda, userLambda2, accessController } = await loadFixture(deployContracts);

                // current status is allowed for all addresses, switch for articleWriter
                await summit.write.setAccessStatus([articleWriter.account.address, 1], { account: accessController.account });

                // get token id
                const tokenId = await summit.read.createTokenId(
                    [articleWriter.account.address, BigInt(0), false]
                );

                // and try to mint 
                await expect(bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleWriter.account
                    }
                ));
            })

            it("Complex access changes are consistent for writer", async function () {
                const { bnmToken, summit, summitReceiver, articleWriter, articleReader, contractOwner, userLambda, userLambda2, accessController } = await loadFixture(deployContracts);

                // current status is allowed for all addresses, switch for articleWriter
                await summit.write.setAccessStatus([articleWriter.account.address, 0], { account: accessController.account });

                // get token id
                let tokenId = await summit.read.createTokenId(
                    [articleWriter.account.address, BigInt(0), false]
                );

                // and try to mint 
                await expect(bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleWriter.account
                    }
                )).to.be.rejectedWith("NotAllowedAccess");

                // then we toggle to allow writer to mint 
                await summit.write.setAccessStatus([articleWriter.account.address, 1], { account: accessController.account });
                await expect(bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleWriter.account
                    }
                ));

                // toggle again for new article , first unknown 
                tokenId = await summit.read.createTokenId(
                    [articleWriter.account.address, BigInt(1), false]
                );

                await summit.write.setAccessStatus([articleWriter.account.address, 0], { account: accessController.account });
                await expect(bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleWriter.account
                    }
                )).to.be.rejectedWith("NotAllowedAccess");

                // then banned 
                await summit.write.setAccessStatus([articleWriter.account.address, 2], { account: accessController.account });
                await expect(bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleWriter.account
                    }
                )).to.be.rejectedWith("NotAllowedAccess");

                // and finally allowed 
                await summit.write.setAccessStatus([articleWriter.account.address, 1], { account: accessController.account });
                await expect(bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleWriter.account
                    }
                ));
            })
        })


        describe("Reader tests", function () {
            it("Unknown reader cannot mint", async function () {
                const { bnmToken, summit, summitReceiver, articleWriter, articleReader, contractOwner, userLambda, userLambda2, accessController } = await loadFixture(deployContracts);

                // current status is allowed for all addresses, switch for articleReader
                await summit.write.setAccessStatus([articleReader.account.address, 0], {account: accessController.account});

                // get token id
                const tokenId = await summit.read.createTokenId(
                    [articleWriter.account.address, BigInt(0), false]
                );

                // mint for writer
                await expect(bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleWriter.account
                    }
                ));

                // and try to mint for reader 
                await expect(bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleReader.account
                    }
                )).to.be.rejectedWith("NotAllowedAccess");
            })

            it("Banned reader cannot mint", async function () {
                const { bnmToken, summit, summitReceiver, articleWriter, articleReader, contractOwner, userLambda, userLambda2, accessController } = await loadFixture(deployContracts);

                // current status is allowed for all addresses, switch for articleWriter
                await summit.write.setAccessStatus([articleReader.account.address, 2], {account: accessController.account});

                // get token id
                const tokenId = await summit.read.createTokenId(
                    [articleWriter.account.address, BigInt(0), false]
                );

                // mint for author
                await expect(bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleWriter.account
                    }
                ));

                // and try to mint for reader
                await expect(bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleReader.account
                    }
                )).to.be.rejectedWith("NotAllowedAccess");
            })

            it("Allowed reader can mint", async function () {
                const { bnmToken, summit, summitReceiver, articleWriter, articleReader, contractOwner, userLambda, userLambda2, accessController } = await loadFixture(deployContracts);

                // current status is allowed for all addresses, switch for articleWriter
                await summit.write.setAccessStatus([articleWriter.account.address, 1], {account: accessController.account});

                // get token id
                const tokenId = await summit.read.createTokenId(
                    [articleWriter.account.address, BigInt(0), false]
                );

                // mint for author
                await expect(bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleWriter.account
                    }
                ));

                // and try to mint 
                await expect(bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleReader.account
                    }
                ));
            })

            it("Complex access changes are consistent for reader", async function () {
                const { bnmToken, summit, summitReceiver, articleWriter, articleReader, contractOwner, userLambda, userLambda2, accessController } = await loadFixture(deployContracts);

                // current status is allowed for all addresses, switch for articleWriter
                await summit.write.setAccessStatus([articleReader.account.address, 0], {account: accessController.account});

                // get token id
                let tokenId = await summit.read.createTokenId(
                    [articleWriter.account.address, BigInt(0), false]
                );

                // mint for author
                await expect(bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleWriter.account
                    }
                ))

                // and try to mint for reader 
                await expect(bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleReader.account
                    }
                )).to.be.rejectedWith("NotAllowedAccess");

                // then we toggle to allow reader to mint 
                await summit.write.setAccessStatus([articleReader.account.address, 1], {account: accessController.account});
                await expect(bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleReader.account
                    }
                ));

                // create new article 
                tokenId = await summit.read.createTokenId(
                    [articleWriter.account.address, BigInt(1), false]
                );
                await expect(bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleWriter.account
                    }
                ));

                // toggle access again for reader for new article, first unknown 
                await summit.write.setAccessStatus([articleReader.account.address, 0], {account: accessController.account});
                await expect(bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleReader.account
                    }
                )).to.be.rejectedWith("NotAllowedAccess");

                // then banned 
                await summit.write.setAccessStatus([articleReader.account.address, 2], {account: accessController.account});
                await expect(bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleReader.account
                    }
                )).to.be.rejectedWith("NotAllowedAccess");

                // and finally allowed 
                await summit.write.setAccessStatus([articleReader.account.address, 1], {account: accessController.account});
                await expect(bnmToken.write.transferAndCall(
                    [
                        summitReceiver.address,
                        BigInt(0),
                        bytesToHex(toBytes(tokenId))
                    ],
                    {
                        account: articleReader.account
                    }
                ));
            })
        })
    })
})