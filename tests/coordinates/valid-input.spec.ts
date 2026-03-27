import { test, expect } from '@playwright/test';

test.describe('Coordinate Input Validation', () => {
  test('Valid coordinate input handling', async ({ page }) => {
    // Load the application
    await page.goto('http://localhost:8501', { waitUntil: 'networkidle' });
    
    const latInput = page.locator('label:has-text("Leveysaste") + div input');
    const lonInput = page.locator('label:has-text("Pituusaste") + div input');
    
    // Enter valid latitude (60.1699) and longitude (24.9384)
    await latInput.clear();
    await latInput.fill('60.1699');
    await lonInput.clear();
    await lonInput.fill('24.9384');
    
    // Press Tab to trigger validation
    await lonInput.press('Tab');
    
    // Values are accepted and displayed with 4 decimal precision
    await expect(latInput).toHaveValue('60.1699');
    await expect(lonInput).toHaveValue('24.9384');
    
    // No validation errors appear
    const errorElements = page.locator('[data-testid="stAlert"], .stError, .error');
    await expect(errorElements).toHaveCount(0);
    
    // Input fields show the entered values correctly
    const displayedLat = await latInput.inputValue();
    const displayedLon = await lonInput.inputValue();
    expect(parseFloat(displayedLat)).toBe(60.1699);
    expect(parseFloat(displayedLon)).toBe(24.9384);
    
    // Test coordinate boundaries
    // Latitude accepts values from -90 to 90
    await latInput.clear();
    await latInput.fill('-90');
    await latInput.press('Tab');
    await expect(latInput).toHaveValue('-90');
    
    await latInput.clear();
    await latInput.fill('90');
    await latInput.press('Tab');
    await expect(latInput).toHaveValue('90');
    
    // Longitude accepts values from -180 to 180
    await lonInput.clear();
    await lonInput.fill('-180');
    await lonInput.press('Tab');
    await expect(lonInput).toHaveValue('-180');
    
    await lonInput.clear();
    await lonInput.fill('180');
    await lonInput.press('Tab');
    await expect(lonInput).toHaveValue('180');
    
    // Coordinate inputs allow step changes of 0.01
    await latInput.clear();
    await latInput.fill('60.12');
    await latInput.press('ArrowUp'); // Should increment by 0.01
    const incrementedValue = await latInput.inputValue();
    expect(parseFloat(incrementedValue)).toBeCloseTo(60.13, 2);
  });
});