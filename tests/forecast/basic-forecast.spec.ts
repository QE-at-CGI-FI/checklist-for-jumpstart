import { test, expect } from '@playwright/test';

test.describe('Weekly Weather Forecast', () => {
  test('Forecast data retrieval and display', async ({ page }) => {
    // Load the application
    await page.goto('http://localhost:8501', { waitUntil: 'networkidle' });
    
    // Click on 'Viikon sääennuste' tab
    const forecastTab = page.locator('[data-testid="stTabs"] >> text=Viikon sääennuste');
    await forecastTab.click();
    
    // Tab switches to weekly forecast view
    await expect(forecastTab).toHaveAttribute('aria-selected', 'true');
    
    // Primary button 'Hae viikon ennuste' is visible and enabled
    const forecastButton = page.locator('button:has-text("📅 Hae viikon ennuste")');
    await expect(forecastButton).toBeVisible();
    await expect(forecastButton).toBeEnabled();
    
    // Execute forecast fetch
    await forecastButton.click();
    
    // Loading spinner appears with text 'Haetaan 7 päivän ennuste...'
    const loadingText = page.locator('text=Haetaan 7 päivän ennuste...');
    await expect(loadingText).toBeVisible({ timeout: 2000 });
    
    // Wait for forecast to load
    await expect(loadingText).not.toBeVisible({ timeout: 20000 });
    
    // Forecast loads successfully
    // 7 daily forecast cards appear in columns
    const forecastColumns = page.locator('[data-testid="stColumns"] > div, .stColumn');
    await expect(forecastColumns).toHaveCount(7, { timeout: 10000 });
    
    // Each card shows Finnish weekday abbreviation (Ma, Ti, Ke, etc.)
    const finnishWeekdays = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'];
    let weekdayFound = false;
    
    for (const weekday of finnishWeekdays) {
      const weekdayElement = page.locator(`text=/\\b${weekday}\\b/`).first();
      if (await weekdayElement.isVisible()) {
        weekdayFound = true;
        break;
      }
    }
    expect(weekdayFound).toBe(true);
    
    // Date format displays as DD.MM.
    const dateFormat = page.locator('text=/\\d{1,2}\\.\\d{1,2}\\./').first();
    await expect(dateFormat).toBeVisible({ timeout: 5000 });
  });
});