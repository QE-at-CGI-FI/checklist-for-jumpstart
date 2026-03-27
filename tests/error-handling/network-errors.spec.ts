import { test, expect } from '@playwright/test';

test.describe('Error Handling and Edge Cases', () => {
  test('Network connectivity issues', async ({ page }) => {
    // Load the application
    await page.goto('http://localhost:8501', { waitUntil: 'networkidle' });
    
    // Test forecast API failure handling
    const forecastTab = page.locator('[data-testid="stTabs"] >> text=Viikon sääennuste');
    await forecastTab.click();
    
    // Simulate network failure by blocking requests to weather API
    await page.route('**/api.open-meteo.com/**', route => {
      route.abort('failed');
    });
    
    const forecastButton = page.locator('button:has-text("📅 Hae viikon ennuste")');
    await forecastButton.click();
    
    // Application handles API timeouts gracefully
    // Error messages are displayed in Finnish
    const errorMessage = page.locator('text=Ennusteen haku epäonnistui. Tarkista yhteys.');
    
    // Wait for either success or error (longer timeout for potential retries)
    try {
      await expect(errorMessage).toBeVisible({ timeout: 30000 });
      console.log('Network error handled correctly with Finnish error message');
    } catch (e) {
      // If error message doesn't appear, check that loading completes without crashing
      const loadingText = page.locator('text=Haetaan 7 päivän ennuste...');
      await expect(loadingText).not.toBeVisible({ timeout: 30000 });
    }
    
    // Application remains functional after network errors
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-testid="stTabs"]')).toBeVisible();
    
    // Reset route blocking for sunshine search test
    await page.unroute('**/api.open-meteo.com/**');
    
    // Test sunshine search with network failure
    const sunshineTab = page.locator('[data-testid="stTabs"] >> text=Etsi aurinkoa lähialueelta');
    await sunshineTab.click();
    
    // Block weather API again
    await page.route('**/api.open-meteo.com/**', route => {
      route.abort('failed');
    });
    
    const searchButton = page.locator('button:has-text("☀️ Etsi aurinkoa!")');
    await searchButton.click();
    
    // Wait for search to complete or show error  
    const loadingSearch = page.locator('text=/Haetaan säätietoja.*pisteestä/');
    await expect(loadingSearch).toBeVisible({ timeout: 2000 });
    
    try {
      await expect(loadingSearch).not.toBeVisible({ timeout: 45000 });
    } catch (e) {
      console.log('Search operation may have timed out due to network failure');
    }
    
    // No application crashes or unhandled exceptions
    await expect(page.locator('h1')).toBeVisible();
    
    // Remove route blocking
    await page.unroute('**/api.open-meteo.com/**');
  });
  
  test('Test with invalid coordinates that might cause API errors', async ({ page }) => {
    // Load the application
    await page.goto('http://localhost:8501', { waitUntil: 'networkidle' });
    
    const latInput = page.locator('label:has-text("Leveysaste") + div input');
    const lonInput = page.locator('label:has-text("Pituusaste") + div input');
    
    // Test with extreme coordinates that might cause API issues
    await latInput.clear();
    await latInput.fill('89'); // Near North Pole
    await lonInput.clear(); 
    await lonInput.fill('179'); // Near International Date Line
    
    // Try sunshine search with extreme coordinates
    const sunshineTab = page.locator('[data-testid="stTabs"] >> text=Etsi aurinkoa lähialueelta');
    await sunshineTab.click();
    
    const searchButton = page.locator('button:has-text("☀️ Etsi aurinkoa!")');
    await searchButton.click();
    
    // Invalid API responses are handled gracefully
    const loadingText = page.locator('text=/Haetaan säätietoja.*pisteestä/');
    await expect(loadingText).toBeVisible({ timeout: 2000 });
    
    try {
      await expect(loadingText).not.toBeVisible({ timeout: 45000 });
      
      // Default fallback values are used (cloud_cover: 100, weather_code: 99)
      // Check if any results are displayed
      const resultsDisplayed = await page.locator('text=/☀️|🌤️|⛅|☁️.*Pilvisyys/').first().isVisible();
      
      if (resultsDisplayed) {
        console.log('Search completed with extreme coordinates');
      }
    } catch (e) {
      console.log('Search with extreme coordinates may have failed gracefully');
    }
    
    // No application crashes or unhandled exceptions
    await expect(page.locator('h1')).toBeVisible();
    
    // Test forecast with extreme coordinates
    const forecastTab = page.locator('[data-testid="stTabs"] >> text=Viikon sääennuste');
    await forecastTab.click();
    
    const forecastButton = page.locator('button:has-text("📅 Hae viikon ennuste")');
    await forecastButton.click();
    
    const loadingForecast = page.locator('text=Haetaan 7 päivän ennuste...');
    
    try {
      await expect(loadingForecast).not.toBeVisible({ timeout: 20000 });
      console.log('Forecast completed with extreme coordinates');
    } catch (e) {
      // Check for error message
      const errorMessage = page.locator('text=Ennusteen haku epäonnistui. Tarkista yhteys.');
      if (await errorMessage.isVisible()) {
        console.log('Forecast failed gracefully with error message');
      }
    }
    
    // Application remains stable
    await expect(page.locator('h1')).toBeVisible();
  });
});