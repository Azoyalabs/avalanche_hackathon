/// <reference types="vitest" />
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit({hot: !process.env.VITEST})],
	test: {
		globals: true,
		environment: "jsdom",
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	ssr: {
		noExternal: [
			'@particle-network/chains',
			'@particle-network/connect',
			'@particle-network/analytics',
			'@particle-network/auth',
			'@particle-network/crypto',
			"@particle-network/provider"
		]
	}
});
