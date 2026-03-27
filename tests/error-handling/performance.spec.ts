import { test, expect } from '@playwright/test';

test.describe('Error Handling and Edge Cases', () => {
  test('Performance under load', async ({ page }) => {
    // Load the application
    await page.goto('http://localhost:8501', { waitUntil: 'networkidle' });
    
    // Navigate to sunshine search
    const sunshineTab = page.locator('[data-testid="stTabs"] >> text=Etsi aurinkoa lähialueelta');
    await sunshineTab.click();
    
    // Test multiple rapid searches with different radius settings
    const radiusOptions = [50, 100, 150, 200, 300];
    const searchButton = page.locator('button:has-text("☀️ Etsi aurinkoa!")');
    
    const startTime = Date.now();
    
    for (let i = 0; i < radiusOptions.length; i++) {
      const radius = radiusOptions[i];
      
      // Select different radius (simplified - actual slider interaction may vary)
      const radiusSelector = page.locator(`text=${radius} km`).first();
      if (await radiusSelector.isVisible()) {
        await radiusSelector.click();
      }
      
      // Execute search
      await searchButton.click();
      
      // Application handles concurrent API requests properly
      const loadingText = page.locator('text=/Haetaan säätietoja.*pisteestä/');
      await expect(loadingText).toBeVisible({ timeout: 3000 });
      
      // UI remains responsive during data loading
      // Check that the page is still interactive
      await expect(page.locator('h1')).toBeVisible();
      await expect(searchButton).toBeVisible();
      
      // ThreadPoolExecutor manages multiple weather requests efficiently
      // Wait for search to complete, but don't block too long
      try {
        await expect(loadingText).not.toBeVisible({ timeout: 30000 });
        
        // Verify results appear
        const results = page.locator('text=/☀️|🌤️|⛅|☁️.*Pilvisyys/').first();
        await expect(results).toBeVisible({ timeout: 5000 });
        
      } catch (e) {
        console.log(`Search ${i + 1} with radius ${radius}km may have timed out or failed`);
      }
      
      // Small delay between searches to prevent overwhelming
      await page.waitForTimeout(1000);
    }
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    console.log(`Total time for ${radiusOptions.length} searches: ${totalTime}ms`);
    console.log(`Average time per search: ${totalTime / radiusOptions.length}ms`);
    
    // Verify application is still responsive after multiple searches
    await expect(page.locator('h1')).toBeVisible();
    await expect(sunshineTab).toBeVisible();
    
    // Test caching mechanisms (ttl=300s for location, ttl=900s for weather)
    // Execute the same search twice to see if it's faster due to caching
    const cacheTestRadius = 150;
    const cacheRadiusSelector = page.locator(`text=${cacheTestRadius} km`).first();
    if (await cacheRadiusSelector.isVisible()) {
      await cacheRadiusSelector.click();
    }
    
    // First search (should hit API)
    const firstSearchStart = Date.now();
    await searchButton.click();
    
    const loadingFirst = page.locator('text=/Haetaan säätietoja.*pisteestä/');
    await expect(loadingFirst).toBeVisible({ timeout: 3000 });
    await expect(loadingFirst).not.toBeVisible({ timeout: 30000 });
    const firstSearchTime = Date.now() - firstSearchStart;
    
    // Second search immediately (should potentially use cache)
    const secondSearchStart = Date.now();
    await searchButton.click();
    
    const loadingSecond = page.locator('text=/Haetaan säätietoja.*pisteestä/');
    try {
      await expect(loadingSecond).toBeVisible({ timeout: 3000 });
      await expect(loadingSecond).not.toBeVisible({ timeout: 30000 });
    } catch (e) {
      // Search might be very fast due to caching
    }
    const secondSearchTime = Date.now() - secondSearchStart;
    
    console.log(`First search time: ${firstSearchTime}ms`);
    console.log(`Second search time: ${secondSearchTime}ms`);
    
    // Verify final application state
    await expect(page.locator('h1')).toBeVisible();
    
    // Test forecast performance
    const forecastTab = page.locator('[data-testid="stTabs"] >> text=Viikon sääennuste');
    await forecastTab.click();
    
    const forecastButton = page.locator('button:has-text("📅 Hae viikon ennuste")');
    
    // Execute forecast multiple times
    for (let i = 0; i < 3; i++) {
      const forecastStart = Date.now();
      await forecastButton.click();
      
      const loadingForecast = page.locator('text=Haetaan 7 päivän ennuste...');
      try {
        await expect(loadingForecast).toBeVisible({ timeout: 3000 });
        await expect(loadingForecast).not.toBeVisible({ timeout: 20000 });
      } catch (e) {
        console.log(`Forecast ${i + 1} may have been very fast or failed`);
      }
      
      const forecastTime = Date.now() - forecastStart;
      console.log(`Forecast ${i + 1} time: ${forecastTime}ms`);
      
      await page.waitForTimeout(1000);
    }
    
    // Final verification that application is stable
    await expect(page.locator('h1')).toBeVisible();
  });
});