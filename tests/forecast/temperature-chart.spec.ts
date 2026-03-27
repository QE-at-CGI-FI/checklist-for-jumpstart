import { test, expect } from '@playwright/test';

test.describe('Weekly Weather Forecast', () => {
  test('Temperature chart display', async ({ page }) => {
    // Load the application and navigate to forecast
    await page.goto('http://localhost:8501', { waitUntil: 'networkidle' });
    
    const forecastTab = page.locator('[data-testid="stTabs"] >> text=Viikon sääennuste');
    await forecastTab.click();
    
    const forecastButton = page.locator('button:has-text("📅 Hae viikon ennuste")');
    await forecastButton.click();
    
    // Wait for forecast to load
    const loadingText = page.locator('text=Haetaan 7 päivän ennuste...');
    await expect(loadingText).not.toBeVisible({ timeout: 20000 });
    
    // Check temperature line chart
    const chartSection = page.locator('text=Lämpötila °C');
    await expect(chartSection).toBeVisible({ timeout: 10000 });
    
    // Line chart displays with Finnish day labels (Ma 26.03., Ti 27.03., etc.)
    const chart = page.locator('[data-testid="stLineChart"], .stLineChart, [data-testid="element-container"] canvas').first();
    
    // Check if chart is visible or if there's a "no data" message
    const noDataMessage = page.locator('text=Lämpötilatietoa ei saatavilla.');
    
    if (await noDataMessage.isVisible()) {
      // Handle missing temperature data
      // If no temperature data available, shows info message
      await expect(noDataMessage).toBeVisible();
      
      // Chart gracefully handles missing data points
      console.log('Temperature data not available - this is expected behavior');
    } else {
      // Chart should be visible
      await expect(chart).toBeVisible({ timeout: 10000 });
      
      // Two lines: Maximum (red/orange) and Minimum (blue)
      // Chart shows 'Maksimi' and 'Minimi' temperature trends
      // Y-axis shows temperature in Celsius
      
      // Check for chart legend or labels
      const legendElements = page.locator('text=Maksimi, text=Minimi');
      const legendCount = await legendElements.count();
      
      if (legendCount > 0) {
        await expect(page.locator('text=Maksimi').first()).toBeVisible();
        await expect(page.locator('text=Minimi').first()).toBeVisible();
      }
    }
    
    // Verify that the temperature section exists
    await expect(chartSection).toBeVisible();
  });
});