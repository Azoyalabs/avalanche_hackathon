import { AvalancheTestnet } from '@particle-network/chains';
import { type EVMProvider, ParticleConnect } from '@particle-network/connect';
import { writable } from 'svelte/store';
import { createPublicClient, createWalletClient, http, custom } from 'viem'
import { avalancheFuji } from 'viem/chains';

export const USER_ADDRESS = writable<string | null>(null);
export const BnM_BALANCE = writable<bigint>(BigInt(0));

export const PARTICLE_CONNECTION = writable<ParticleConnect | null>(null);
export const PROVIDER = writable<EVMProvider | null>(null);
// export const WALLET_CLIENT = writable<
PARTICLE_CONNECTION.subscribe(async (connection) => {
	if (connection) {
		const provider = await connection.connect() as EVMProvider;
		PROVIDER.set(provider );

		createWalletClient({
			chain: avalancheFuji,
			transport: custom(provider)
		})
	}
});
