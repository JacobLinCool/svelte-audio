import { expect, test } from "@playwright/test";

test("index page has title", async ({ page }) => {
	await page.goto("/");
	expect(await page.title()).toBe("Svelte Audio");
});
