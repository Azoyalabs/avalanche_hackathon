import { Address } from "viem";
import { createTokenId, parseTokenId } from "../src/tokenIdUtils";

describe("Token Id Tests", () => {
  it("Successfuly creates an ID from params", () => {
    const userAddress: Address = "0x0e2adf2A3082Bc5Fb8847224Ca4d797BC9874B4a";
    const articleId = BigInt(0);
    const isPaying = false;

    const tokenId = createTokenId(userAddress, articleId, isPaying);
  });

  it("Successfully parses an ID into its components", () => {
    const tokenId = BigInt(
      "6408127683748287498525528440796427317281100039138196694152555658537814982656"
    );
    const parsedComponents = parseTokenId(tokenId);
  });

  it("Create ids and parse back to their components", () => {
    const addresses: Address[] = [
      "0x0e2adf2A3082Bc5Fb8847224Ca4d797BC9874B4a",
      "0xefA8BA70954C03066E41cd424480d6B76075584C",
    ];
    addresses.forEach((currAddr) => {
      for (let i = 0; i < 160; i++) {
        let articleId = BigInt(i);

        [false, true].forEach((isPaying) => {
          const tokenId = createTokenId(currAddr, articleId, isPaying);
          const parsedComponents = parseTokenId(tokenId);

          expect(currAddr.toLowerCase()).toBe(parsedComponents.creator);
          expect(articleId).toBe(parsedComponents.articleId);
          expect(isPaying).toBe(parsedComponents.isPaying);
        });
      }
    });
  });
});
