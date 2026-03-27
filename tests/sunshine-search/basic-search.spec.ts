import { test, expect } from '@playwright/test';

test.describe('Sunshine Search Functionality', () => {
  test('Basic sunshine search execution', async ({ page }) => {
    // Load the application
    await page.goto('http://localhost:8501', { waitUntil: 'networkidle' });
    
    // Click on 'Etsi aurinkoa lähialueelta' tab
    const sunshineTab = page.locator('[data-testid="stTabs"] >> text=Etsi aurinkoa lähialueelta');
    await sunshineTab.click();
    
    // Tab switches to sunshine search view
    await expect(sunshineTab).toHaveAttribute('aria-selected', 'true');
    
    // Search radius slider is visible with options 50-300km
    const radiusSlider = page.locator('label:has-text("Hakusäde") + div');
    await expect(radiusSlider).toBeVisible();
    
    // Check if slider has correct options (this might need adjustment based on actual implementation)
    const sliderElements = page.locator('[data-testid="stSlider"]');
    await expect(sliderElements).toBeVisible();
    
    // Default radius is set to 150km
    const radiusText = page.locator('text=/150.*km/');
    await expect(radiusText).toBeVisible();
    
    // Primary button 'Etsi aurinkoa!' is visible and enabled
    const searchButton = page.locator('button:has-text("☀️ Etsi aurinkoa!")');
    await expect(searchButton).toBeVisible();
    await expect(searchButton).toBeEnabled();
    
    // Execute search with default settings
    await searchButton.click();
    
    // Loading spinner appears with text 'Haetaan säätietoja [N] pisteestä...'
    const loadingText = page.locator('text=/Haetaan säätietoja.*pisteestä/');
    await expect(loadingText).toBeVisible({ timeout: 2000 });
    
    // Wait for search to complete (might take a few seconds for real API calls)
    await expect(loadingText).not.toBeVisible({ timeout: 30000 });
    
    // Search completes successfully
    // Results show best location with cloud coverage percentage
    const resultsSection = page.locator('text=/☀️|🌤️|⛅|☁️/').first();
    await expect(resultsSection).toBeVisible({ timeout: 5000 });
    
    // Success/warning message appears based on cloud coverage levels
    const messagePatterns = [
      /Kirkkainta.*Pilvisyys.*%/,
      /Aurinkoisinta.*Pilvisyys.*%/,
      /Parasta lähialueella.*Pilvisyys.*%/,
      /Pilvistä kaikkialla.*Pilvisyys.*%/
    ];
    
    let messageFound = false;
    for (const pattern of messagePatterns) {
      const message = page.locator(`text=${pattern}`);
      if (await message.isVisible()) {
        messageFound = true;
        break;
      }
    }
    expect(messageFound).toBe(true);
  });
});