

// export const CONTRACT_ADDRESS = "0xfF4716b2a09D9CD05Bae2FE265A2C6b7B1e31a3F"


/*
// BEFORE REDEPLOY FOR FIX URI 
export const SUMMIT_ADDRESS = "0x30cdaa09e7a763ca2521fe6a9710776bd7a746e6"
export const RECEIVER_ADDRESS = "0xd3d7cd1107fe49720eb6acfd0c7c33d8a26f467f"
*/

export const SUMMIT_ADDRESS = "0x392b22e6974be850f5d6a633b92587bde6b0b49f"; //"0xb02dd60b0d337ddd6f99c98eae0292a51f514292"
export const RECEIVER_ADDRESS = "0x3e8008176294ae78bc7a4f6a59d16731d7a22bab"; //"0x6c55574d10045b5da20e87709d7a24f24c943aec"


export const FUNCTION_CONSUMER = "0x739f201d39d262bacf4c8f9093a832e6a6461bef"; //"0xbcd130666450729986437b8db38733d11345e7f2";


/// Taken from: https://docs.chain.link/ccip/supported-networks/v1_2_0/testnet
export const CCIP_TESTNET_CONTRACTS_INFO = {
    "sepolia": {
        "router": "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59",
        "chain_selector": BigInt("16015286601757825753"),
        "tokens": {
            "CCIP-BnM": "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05",
            "CCIP-LnM": "0x466D489b6d36E7E3b824ef491C225F5830E81cC1"
        }
    },
    "optimism_goerli": {
        "router": "0xcc5a0B910D9E9504A7561934bed294c51285a78D",
        "chain_selector": BigInt("2664363617261496610"),
        "tokens": {
            "CCIP-BnM": "0xaBfE9D11A2f1D61990D1d253EC98B5Da00304F16",
            "CCIP-LnM": "0x835833d556299CdEC623e7980e7369145b037591"
        }
    },
    "mumbai": {
        "router": "0x1035CabC275068e0F4b745A29CEDf38E13aF41b1",
        "chain_selector": BigInt("12532609583862916517"),
        "tokens": {
            "CCIP-BnM": "0xf1E3A5842EeEF51F2967b3F05D45DD4f4205FF40",
            "CCIP-LnM": "0xc1c76a8c5bFDE1Be034bbcD930c668726E7C1987"
        }
    },
    "fuji": {
        "router": "0xF694E193200268f9a4868e4Aa017A0118C9a8177",
        "chain_selector": BigInt("14767482510784806043"),
        "tokens": {
            "CCIP-BnM": "0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4",
            "CCIP-LnM": "0x70F5c5C40b873EA597776DA2C21929A8282A3b35"
        }
    },
    "bnb": {
        "router": "0xE1053aE1857476f36A3C62580FF9b016E8EE8F6f",
        "chain_selector": BigInt("13264668187771770619"),
        "tokens": {
            "CCIP-BnM": "0xbFA2ACd33ED6EEc0ed3Cc06bF1ac38d22b36B9e9",
            "CCIP-LnM": "0x79a4Fc27f69323660f5Bfc12dEe21c3cC14f5901"
        }
    },
    "base_goerli": {
        "router": "0x80AF2F44ed0469018922c9F483dc5A909862fdc2",
        "chain_selector": BigInt("5790810961207155433"),
        "tokens": {
            "CCIP-BnM": "0xbf9036529123DE264bFA0FC7362fE25B650D4B16",
            "CCIP-LnM": "0x73ed16c1a61b098fd6924CCE5cC6a9A30348D944"
        }
    },
    "arbitrum_sepolia": {
        "router": "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165",
        "chain_selector": BigInt("3478487238524512106"),
        "tokens": {
            "CCIP-BnM": "0xA8C0c11bf64AF62CDCA6f93D3769B88BdD7cb93D",
            "CCIP-LnM": "0x139E99f0ab4084E14e6bb7DacA289a91a2d92927"
        }
    },
}
