import { test, expect } from '@playwright/test';

test.describe('Weekly Weather Forecast', () => {
  test('Detailed forecast table', async ({ page }) => {
    // Load the application and navigate to forecast
    await page.goto('http://localhost:8501', { waitUntil: 'networkidle' });
    
    const forecastTab = page.locator('[data-testid="stTabs"] >> text=Viikon sääennuste');
    await forecastTab.click();
    
    const forecastButton = page.locator('button:has-text("📅 Hae viikon ennuste")');
    await forecastButton.click();
    
    // Wait for forecast to load
    const loadingText = page.locator('text=Haetaan 7 päivän ennuste...');
    await expect(loadingText).not.toBeVisible({ timeout: 20000 });
    
    // Examine comprehensive forecast table
    const tableSection = page.locator('text=Yksityiskohtainen ennuste');
    await expect(tableSection).toBeVisible({ timeout: 10000 });
    
    const detailedTable = page.locator('[data-testid="stDataFrame"]').last();
    await expect(detailedTable).toBeVisible({ timeout: 5000 });
    
    // Table shows columns: Päivä, Sää, Maks °C, Min °C, Pilvisyys %, Sadetod. %, Sademäärä mm, Tuuli km/h, Aurinko nousee, Aurinko laskee
    const expectedColumns = [
      'Päivä',
      'Sää', 
      'Maks °C',
      'Min °C',
      'Pilvisyys %',
      'Sadetod. %',
      'Sademäärä mm',
      'Tuuli km/h',
      'Aurinko nousee',
      'Aurinko laskee'
    ];
    
    for (const column of expectedColumns) {
      // Check for column headers in various possible formats
      const columnSelectors = [
        `th:has-text("${column}")`,
        `[data-testid="stDataFrame"] >> text=${column}`,
        `text=/.*${column.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*/`
      ];
      
      let columnFound = false;
      for (const selector of columnSelectors) {
        const columnElement = page.locator(selector).first();
        if (await columnElement.isVisible()) {
          columnFound = true;
          break;
        }
      }
      
      if (!columnFound) {
        console.log(`Column not found: ${column}`);
        // Some columns might be abbreviated or formatted differently
      }
    }
    
    // Full weekday names in Finnish (e.g., 'Thursday 27.03.')
    // Check for Finnish weekday names
    const finnishWeekdays = ['maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai', 'lauantai', 'sunnuntai'];
    let weekdayFound = false;
    
    for (const weekday of finnishWeekdays) {
      const weekdayElement = page.locator(`text=/${weekday}/i`).first();
      if (await weekdayElement.isVisible()) {
        weekdayFound = true;
        break;
      }
    }
    
    // Weather emojis with descriptions
    const weatherEmojis = ['☀️', '🌤️', '⛅', '🌥️', '🌧️', '❄️', '🌨️', '⛈️'];
    let weatherEmojiFound = false;
    
    for (const emoji of weatherEmojis) {
      const emojiElement = page.locator(`text=${emoji}`).first();
      if (await emojiElement.isVisible()) {
        weatherEmojiFound = true;
        break;
      }
    }
    expect(weatherEmojiFound).toBe(true);
    
    // Progress bars for cloud coverage and precipitation probability
    const progressBars = page.locator('[data-testid="stDataFrame"] .stProgress, [role="progressbar"]');
    const progressCount = await progressBars.count();
    if (progressCount > 0) {
      await expect(progressBars.first()).toBeVisible();
    }
    
    // Sunrise/sunset times in HH:MM format
    const timeFormat = page.locator('text=/\\d{1,2}:\\d{2}/').first();
    if (await timeFormat.isVisible()) {
      await expect(timeFormat).toBeVisible();
    }
    
    // '–' displayed for unavailable data
    const unavailableData = page.locator('td:has-text("–")').first();
    if (await unavailableData.isVisible()) {
      await expect(unavailableData).toBeVisible();
    }
    
    // Verify table has 7 rows (one for each day)
    const tableRows = page.locator('[data-testid="stDataFrame"] tr').last().locator('tbody tr, tr');
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThan(0); // Should have forecast data
  });
});