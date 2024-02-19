import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { toast } from 'svelte-sonner';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

export function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export type PreviewAttribute = {
	trait_type: 'Preview';
	value: string;
};
export type AuthorAttribute = {
	trait_type: 'Author';
	value: string;
};
export type PublishedAttribute = {
	trait_type: 'Published';
	value: number;
	display_type: 'date';
};

export type HeaderAttribute = {
	trait_type: 'Header';
	value: string;
};
export type Attribute = AuthorAttribute | PublishedAttribute | PreviewAttribute | HeaderAttribute;
export type TraitTypes = Attribute['trait_type'];

export function getRelevantAttribute<T extends { trait_type: TraitTypes; value: string | number }>(
	key: TraitTypes,
	attributes: Attribute[]
): T {
	const attribute = attributes.find((a) => a.trait_type === key)!;
	return attribute as unknown as T;
}

const erc20Formatter = Intl.NumberFormat(undefined, {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
});

export function formatERC20(amount: bigint, decimals: number, symbol: string) {
	return `${erc20Formatter.format(Number(amount) * Math.pow(10, -decimals))} ${symbol}`;
}

export function transactionToaster(promise: Promise<string>) {
	return toast.promise<Awaited<typeof promise>>(promise, {
		loading: 'Sending Transaction...',
		success: (hash) => {
			return 'Transaction successful! \n' + hash;
		},
		error: (err) => {
			console.error(err);
			return `Error: ${err}`;
		}
	});
}
