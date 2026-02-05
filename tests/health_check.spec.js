import { test, expect } from '@playwright/test';

test('Page loads successfully', async ({ page }) => {
    try {
        // Use 127.0.0.1 explicitly to avoid localhost resolution ambiguity
        console.log('Navigating to http://127.0.0.1:5173/ ...');
        const response = await page.goto('http://127.0.0.1:5173/', { timeout: 5000 });
        console.log('Response status:', response.status());
        expect(response.status()).toBe(200);

        const title = await page.title();
        console.log(`Page title: ${title}`);
        expect(title).not.toBe('');
    } catch (error) {
        console.error('Error loading page:', error);
        throw error;
    }
});
