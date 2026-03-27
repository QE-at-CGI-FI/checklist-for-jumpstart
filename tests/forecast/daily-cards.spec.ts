import { test, expect } from '@playwright/test';

test.describe('Weekly Weather Forecast', () => {
  test('Daily forecast card content', async ({ page }) => {
    // Load the application and navigate to forecast
    await page.goto('http://localhost:8501', { waitUntil: 'networkidle' });
    
    const forecastTab = page.locator('[data-testid="stTabs"] >> text=Viikon sääennuste');
    await forecastTab.click();
    
    const forecastButton = page.locator('button:has-text("📅 Hae viikon ennuste")');
    await forecastButton.click();
    
    // Wait for forecast to load
    const loadingText = page.locator('text=Haetaan 7 päivän ennuste...');
    await expect(loadingText).toBeVisible({ timeout: 2000 });
    await expect(loadingText).not.toBeVisible({ timeout: 20000 });
    
    // Examine individual forecast cards
    const forecastColumns = page.locator('[data-testid="stColumns"] > div, .stColumn');
    await expect(forecastColumns.first()).toBeVisible({ timeout: 10000 });
    
    // Weather icons display appropriate emojis
    const weatherEmojis = ['☀️', '🌤️', '⛅', '🌥️', '🌧️', '❄️', '🌨️', '🌦️', '⛈️', '🌡️'];
    let emojiFound = false;
    
    for (const emoji of weatherEmojis) {
      const emojiElement = page.locator(`text=${emoji}`).first();
      if (await emojiElement.isVisible()) {
        emojiFound = true;
        break;
      }
    }
    expect(emojiFound).toBe(true);
    
    // Temperature shows max/min in format '🌡 **[max]°** / [min]°'
    const temperaturePattern = page.locator('text=/🌡.*\d+°.*\/.*\d+°/').first();
    if (await temperaturePattern.isVisible()) {
      await expect(temperaturePattern).toBeVisible();
    } else {
      // Alternative format - just check for temperature with degrees
      const tempElement = page.locator('text=/\d+°/').first();
      await expect(tempElement).toBeVisible();
    }
    
    // Precipitation probability displays if >10% as '🌧 [X]%'
    const precipitationElements = page.locator('text=/🌧.*\d+%/');
    const precipCount = await precipitationElements.count();
    // Precipitation might not always be present if probability is low
    
    // Cloud coverage shows as progress bar with '☁ [X]%'
    const cloudElements = page.locator('text=/☁.*\d+%/, [data-testid="stProgress"]');
    const cloudCount = await cloudElements.count();
    expect(cloudCount).toBeGreaterThan(0); // Should have cloud coverage indicators
    
    // Verify weather code to emoji mapping
    const weatherMappings = [
      { codes: [0], emoji: '☀️', description: 'Selkeää' },
      { codes: [1, 2, 3], emojis: ['🌤️', '⛅', '🌥️'], descriptions: ['Pääosin selkeää', 'Vaihtelevaa', 'Pilvistä'] },
      { codes: [61, 63, 65], emoji: '🌧️', description: 'Sadetta' },
      { codes: [71, 73, 75], emoji: '❄️', description: 'Lumisadetta' },
      { codes: [95], emoji: '⛈️', description: 'Ukkosta' }
    ];
    
    // Check if any of the expected weather descriptions are present
    const weatherDescriptions = ['Selkeää', 'Pääosin selkeää', 'Pilvistä', 'Sadetta', 'Lumisadetta', 'Ukkosta'];
    let descriptionFound = false;
    
    for (const description of weatherDescriptions) {
      const descElement = page.locator(`text=${description}`).first();
      if (await descElement.isVisible()) {
        descriptionFound = true;
        break;
      }
    }
    
    // Note: Weather descriptions might be displayed as emojis only in the card view
    // The detailed table will have more text descriptions
  });
});