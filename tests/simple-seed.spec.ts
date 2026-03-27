// Simple seed setup for weather app testing
// This will be used once Playwright is properly installed

const { test, expect } = require('@playwright/test');

test.describe('Weather App Setup', () => {
  test('seed - navigate to application', async ({ page }) => {
    // Navigate to the Streamlit application
    await page.goto('http://localhost:8501', { waitUntil: 'networkidle' });
    
    // Wait for page to load completely
    await page.waitForSelector('h1', { timeout: 10000 });
    
    // Verify basic page structure is loaded
    await expect(page.locator('h1')).toContainText('Missä paistaa aurinko');
  });
});