import { test, expect } from '@playwright/test';

test.describe('Coordinate Input Validation', () => {
  test('Invalid coordinate input handling', async ({ page }) => {
    // Load the application
    await page.goto('http://localhost:8501', { waitUntil: 'networkidle' });
    
    const latInput = page.locator('label:has-text("Leveysaste") + div input');
    const lonInput = page.locator('label:has-text("Pituusaste") + div input');
    
    // Store original valid values
    const originalLat = await latInput.inputValue();
    const originalLon = await lonInput.inputValue();
    
    // Attempt to enter invalid latitude values (>90, <-90)
    // Test latitude > 90
    await latInput.clear();
    await latInput.fill('95');
    await latInput.press('Tab');
    
    // Values outside valid range are rejected or reset to boundary value
    const latValue1 = await latInput.inputValue();
    const lat1 = parseFloat(latValue1);
    expect(lat1).toBeLessThanOrEqual(90); // Should be constrained to max 90
    
    // Test latitude < -90
    await latInput.clear();
    await latInput.fill('-95');
    await latInput.press('Tab');
    
    const latValue2 = await latInput.inputValue();
    const lat2 = parseFloat(latValue2);
    expect(lat2).toBeGreaterThanOrEqual(-90); // Should be constrained to min -90
    
    // Application remains functional
    await expect(page.locator('h1')).toBeVisible();
    
    // Attempt to enter invalid longitude values (>180, <-180)
    // Test longitude > 180
    await lonInput.clear();
    await lonInput.fill('185');
    await lonInput.press('Tab');
    
    const lonValue1 = await lonInput.inputValue();
    const lon1 = parseFloat(lonValue1);
    expect(lon1).toBeLessThanOrEqual(180); // Should be constrained to max 180
    
    // Test longitude < -180
    await lonInput.clear();
    await lonInput.fill('-185');
    await lonInput.press('Tab');
    
    const lonValue2 = await lonInput.inputValue();
    const lon2 = parseFloat(lonValue2);
    expect(lon2).toBeGreaterThanOrEqual(-180); // Should be constrained to min -180
    
    // Application remains functional after all invalid inputs
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-testid="stTabs"]')).toBeVisible();
    
    // Test non-numeric input
    await latInput.clear();
    await latInput.fill('abc');
    await latInput.press('Tab');
    
    // Should either reject non-numeric input or revert to valid value
    const finalLatValue = await latInput.inputValue();
    if (finalLatValue !== '') {
      const finalLat = parseFloat(finalLatValue);
      expect(finalLat).toBeGreaterThanOrEqual(-90);
      expect(finalLat).toBeLessThanOrEqual(90);
    }
  });
});