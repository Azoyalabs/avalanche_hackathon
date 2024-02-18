import { type EVMProvider, ParticleConnect } from '@particle-network/connect';
import { getContext, setContext } from 'svelte';
import { derived, writable } from 'svelte/store';
import { createWalletClient, custom, getContract } from 'viem';
import { avalancheFuji } from 'viem/chains';
import { abi } from './contracts/ERC20/abi';
import { BnM_TOKEN_ADDRESS } from './constants';

export const PARTICLE_CONNECTION = writable<ParticleConnect | null>(null);

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
	const address = writable<`0x${string}` | null>(null);
	const BNM_BALANCE = writable<bigint>(BigInt(0));

	walletClient.subscribe(async (wc) => {
		if (wc) {
			const add = await wc.getAddresses();
			address.set(add[0]);

			const BnMContract = getContract({
				abi: abi,
				address: BnM_TOKEN_ADDRESS,
				client: wc
			});

			const bal = await BnMContract.read.balanceOf([add[0]]);
			BNM_BALANCE.set(BigInt(bal));
		} else {
			address.set(null);
			BNM_BALANCE.set(BigInt(0));
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
		isConnected: derived(address, ($add) => $add !== null),
		balance: BNM_BALANCE
	};
}
