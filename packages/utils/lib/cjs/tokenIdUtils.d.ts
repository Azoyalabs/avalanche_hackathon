import { Address } from "viem";
export declare function createTokenId(creator: Address, articleId: bigint, isPaying: boolean): bigint;
export declare function parseTokenId(tokenId: bigint): {
    creator: Address;
    articleId: bigint;
    isPaying: boolean;
};
