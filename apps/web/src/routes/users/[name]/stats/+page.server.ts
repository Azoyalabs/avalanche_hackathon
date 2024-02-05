import { CovalentClient, Chains} from "@covalenthq/client-sdk"

import type { PageServerLoad } from './$types';
import { COVALENT_API_KEY } from "$env/static/private";

export const load = (async ({params}) => {
    const client = new CovalentClient(COVALENT_API_KEY);
    //const resp = await client.BalanceService.getTokenBalancesForWalletAddress(Chains.AVALANCHE_TESTNET, params.name);
    // resp.data.items.map((i) => console.dir(i))
    //console.dir(resp);

    //client.NftService.checkOwnershipInNft(Chains.AVALANCHE_TESTNET)

    return {};
}) satisfies PageServerLoad;
