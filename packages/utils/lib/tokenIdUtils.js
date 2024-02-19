export function createTokenId(creator, articleId, isPaying) {
    let tokenId = (BigInt(creator) << BigInt(96)) + (articleId << BigInt(1));
    if (isPaying) {
        tokenId += BigInt(1);
    }
    return tokenId;
}
export function parseTokenId(tokenId) {
    let creator = BigInt(tokenId >> BigInt(96)).toString(16);
    const articleId = BigInt(tokenId >> BigInt(1)) & BigInt("0xFFFFFFFFFFFFFFFF");
    const isPaying = (tokenId & BigInt(1)) === BigInt(1);
    // need to pad creator address if leading 0s in address
    creator = creator.padStart(40, "0");
    return {
        "creator": `0x${creator}`,
        "articleId": articleId,
        "isPaying": isPaying
    };
}
