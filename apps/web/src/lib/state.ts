import { type EVMProvider, ParticleConnect } from '@particle-network/connect';
import { getContext, setContext } from 'svelte';
import { derived, writable } from 'svelte/store';
import { createWalletClient, custom, type WalletClient } from 'viem';
import { avalancheFuji } from 'viem/chains';

export const USER_ADDRESS = writable<string | null>(null);
export const BnM_BALANCE = writable<bigint>(BigInt(0));

export const PARTICLE_CONNECTION = writable<ParticleConnect | null>(null);
export const PROVIDER = writable<EVMProvider | null>(null);
export const WALLET_CLIENT = writable<WalletClient | null>(null);

const USER_CTX = 'USER_CTX';

export function setUserStoreState(provider: EVMProvider | null) {
	const user = createUserStore(provider);
	setContext(USER_CTX, user);
	return user;
}

export function getUserStoreState() {
	return getContext<ReturnType<typeof createUserStore>>(USER_CTX);
}

export function createUserStore(initialProvider: EVMProvider | null) {
	const provider = writable(initialProvider);
	const walletClient = derived(provider, ($provider) => {
		if ($provider) {
			return createWalletClient({
				chain: avalancheFuji,
				transport: custom($provider)
			});
		} else {
			return null;
		}
	});
	const address = writable<string | null>(null);
	walletClient.subscribe(async (wc) => {
		if (wc) {
			const add = await wc.getAddresses();
			address.set(add[0]);
		} else {
			address.set(null);
		}
	});

	function disconnect() {
		provider.update((p) => {
			if (p) {
				p?.disconnect?.();
				provider.set(null);
			}
			return null;
		});
	}

	function connect(newProvider: EVMProvider) {
		provider.set(newProvider);
	}

	return {
		connect,
		disconnect,
		client: walletClient,
		address,
		provider,
		isConnected: derived(address, ($add) => $add !== null)
	};
}
