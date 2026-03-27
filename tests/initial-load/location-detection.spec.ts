import { test, expect } from '@playwright/test';

test.describe('Initial Page Load and Location Detection', () => {
  test('Automatic IP-based location detection', async ({ page }) => {
    // Load the application and wait for location detection
    await page.goto('http://localhost:8501', { waitUntil: 'networkidle' });
    
    // Wait for location detection to complete
    await page.waitForTimeout(2000); // Allow time for IP geolocation
    
    // Latitude field is auto-populated with a valid coordinate (-90 to 90)
    const latInput = page.locator('label:has-text("Leveysaste") + div input');
    await expect(latInput).toBeVisible();
    
    const latValue = await latInput.inputValue();
    const lat = parseFloat(latValue);
    expect(lat).toBeGreaterThanOrEqual(-90);
    expect(lat).toBeLessThanOrEqual(90);
    
    // Longitude field is auto-populated with a valid coordinate (-180 to 180)
    const lonInput = page.locator('label:has-text("Pituusaste") + div input');
    await expect(lonInput).toBeVisible();
    
    const lonValue = await lonInput.inputValue();
    const lon = parseFloat(lonValue);
    expect(lon).toBeGreaterThanOrEqual(-180);
    expect(lon).toBeLessThanOrEqual(180);
    
    // Location caption appears showing estimated city from IP address
    // Caption displays format 'Arvioitu sijainti IP-osoitteesta: [City Name]'
    const locationCaption = page.locator('[data-testid="stCaption"]:has-text("Arvioitu sijainti IP-osoitteesta")');
    
    // Check if IP detection worked or if we have fallback
    try {
      await expect(locationCaption).toBeVisible({ timeout: 3000 });
      // If visible, verify the format
      await expect(locationCaption).toContainText('📍 Arvioitu sijainti IP-osoitteesta:');
    } catch {
      // If IP detection fails, coordinates default to Helsinki (60.1699, 24.9384)
      expect(Math.abs(lat - 60.1699)).toBeLessThan(0.001);
      expect(Math.abs(lon - 24.9384)).toBeLessThan(0.001);
    }
    
    // Verify default fallback location when IP detection fails
    // Application continues to function normally even without IP detection
    await expect(page.locator('h1')).toBeVisible(); // Page still functional
    await expect(latInput).not.toHaveValue(''); // Coordinates are set
    await expect(lonInput).not.toHaveValue(''); // Coordinates are set
  });
});