import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/');
	
	await expect(page.getByText("Publish your stories to the world.")).toBeVisible();
});
