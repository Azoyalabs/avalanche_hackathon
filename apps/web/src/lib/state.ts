import { AvalancheTestnet } from '@particle-network/chains';
import { type EVMProvider, ParticleConnect } from '@particle-network/connect';
import { getContext, setContext } from 'svelte';
import { derived, writable, type Writable } from 'svelte/store';
import { createPublicClient, createWalletClient, http, custom, type WalletClient } from 'viem';
import { avalancheFuji } from 'viem/chains';

export const USER_ADDRESS = writable<string | null>(null);
export const BnM_BALANCE = writable<bigint>(BigInt(0));

export const PARTICLE_CONNECTION = writable<ParticleConnect | null>(null);
export const PROVIDER = writable<EVMProvider | null>(null);
export const WALLET_CLIENT = writable<WalletClient | null>(null);
/*
PROVIDER.subscribe(async (provider) => {
	if (provider) {
		console.log('provider set');
		const client = createWalletClient({
			chain: avalancheFuji,
			transport: custom(provider)
		});

		WALLET_CLIENT.set(client);

		const [address] = await client.getAddresses();
		// console.dir(address);

		USER_ADDRESS.set(address);
	} else {
		// TODO: clean up
		WALLET_CLIENT.set(null);
		USER_ADDRESS.set(null);
	}
});
*/
class User {
	address: string;
	walletClient: WalletClient;
	provider: EVMProvider;

	constructor(options: { address: string; walletClient: WalletClient; provider: EVMProvider }) {
		this.address = options.address;
		this.walletClient = options.walletClient;
		this.provider = options.provider;
	}

	static async fromProvider(provider: EVMProvider): Promise<User> {
		const client = createWalletClient({
			chain: avalancheFuji,
			transport: custom(provider)
		});

		const [address] = await client.getAddresses();

		return new User({
			address,
			walletClient: client,
			provider
		});
	}

	async disconnect() {
		this.provider.disconnect?.() || null;
	}
}
const USER_CTX = 'USER_CTX';
const userState = writable<User | null>(null);

export async function setUserState(provider: EVMProvider | null): Promise<User | null> {
	if (provider) {
		const user = await User.fromProvider(provider);
		setContext(USER_CTX, userState);
		return user;
	} else {
		setContext(USER_CTX, userState);
		return null;
	}
}

export function getUserState() {
	return getContext<Writable<User | null>>(USER_CTX);
}

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
		isConnected: derived(address, ($add) => $add !== null)
	};
}
