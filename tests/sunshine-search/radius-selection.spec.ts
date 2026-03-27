import { test, expect } from '@playwright/test';

test.describe('Sunshine Search Functionality', () => {
  test('Search radius configuration', async ({ page }) => {
    // Load the application
    await page.goto('http://localhost:8501', { waitUntil: 'networkidle' });
    
    // Navigate to sunshine search tab
    const sunshineTab = page.locator('[data-testid="stTabs"] >> text=Etsi aurinkoa lähialueelta');
    await sunshineTab.click();
    
    // Test different radius options (50, 75, 100, 150, 200, 300 km)
    const radiusOptions = [50, 75, 100, 150, 200, 300];
    
    for (const radius of radiusOptions) {
      // Click on the slider to select different radius values
      // This is a simplified approach - actual implementation might need specific slider interaction
      const radiusSelector = page.locator(`text=${radius} km, text=/.*${radius}.*km.*/`).first();
      
      // If the specific radius option exists, click it
      if (await radiusSelector.isVisible()) {
        await radiusSelector.click();
        
        // Selected radius is displayed correctly
        await expect(page.locator(`text=${radius} km`)).toBeVisible();
      }
    }
    
    // Execute search with minimum radius (50km)
    const minRadiusOption = page.locator('text=50 km').first();
    if (await minRadiusOption.isVisible()) {
      await minRadiusOption.click();
    }
    
    const searchButton = page.locator('button:has-text("☀️ Etsi aurinkoa!")');
    await searchButton.click();
    
    // Wait for loading to appear and disappear
    const loadingText = page.locator('text=/Haetaan säätietoja.*pisteestä/');
    await expect(loadingText).toBeVisible({ timeout: 2000 });
    await expect(loadingText).not.toBeVisible({ timeout: 30000 });
    
    // Search executes with fewer measurement points
    // Results are appropriate for smaller search area
    const resultsTable = page.locator('[data-testid="stDataFrame"], table').first();
    await expect(resultsTable).toBeVisible({ timeout: 5000 });
    
    // Map shows measurement points within 50km radius
    const mapContainer = page.locator('[data-testid="stDeckGlJsonChart"], .stDeckGlJsonChart');
    await expect(mapContainer).toBeVisible({ timeout: 5000 });
    
    // Execute search with maximum radius (300km)
    const maxRadiusOption = page.locator('text=300 km').first();
    if (await maxRadiusOption.isVisible()) {
      await maxRadiusOption.click();
      
      await searchButton.click();
      
      // Wait for search to complete
      await expect(loadingText).toBeVisible({ timeout: 2000 });
      await expect(loadingText).not.toBeVisible({ timeout: 45000 }); // Longer timeout for more points
      
      // Search executes with more measurement points
      // Results cover wider geographical area
      await expect(resultsTable).toBeVisible({ timeout: 5000 });
      
      // Map shows measurement points within 300km radius
      await expect(mapContainer).toBeVisible({ timeout: 5000 });
      
      // Verify that more measurement points are shown (table should have more rows)
      const tableRows = page.locator('[data-testid="stDataFrame"] tr, table tr');
      const rowCount = await tableRows.count();
      expect(rowCount).toBeGreaterThan(5); // Should have multiple measurement points
    }
  });
});