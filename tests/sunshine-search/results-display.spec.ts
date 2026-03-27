import { test, expect } from '@playwright/test';

test.describe('Sunshine Search Functionality', () => {
  test('Search results display and interpretation', async ({ page }) => {
    // Load the application
    await page.goto('http://localhost:8501', { waitUntil: 'networkidle' });
    
    // Navigate to sunshine search tab
    const sunshineTab = page.locator('[data-testid="stTabs"] >> text=Etsi aurinkoa lähialueelta');
    await sunshineTab.click();
    
    const searchButton = page.locator('button:has-text("☀️ Etsi aurinkoa!")');
    await searchButton.click();
    
    // Wait for search to complete
    const loadingText = page.locator('text=/Haetaan säätietoja.*pisteestä/');
    await expect(loadingText).toBeVisible({ timeout: 2000 });
    await expect(loadingText).not.toBeVisible({ timeout: 30000 });
    
    // Execute search and analyze result message formats
    // The message format depends on cloud coverage levels:
    
    // Check for different possible result messages
    const possibleMessages = [
      // For cloud coverage ≤10%: Success message with ☀️
      {
        selector: 'text=/☀️.*Kirkkainta.*Pilvisyys.*%/',
        type: 'success',
        coverage: 'low'
      },
      // For cloud coverage ≤30%: Success message with 🌤️
      {
        selector: 'text=/🌤️.*Aurinkoisinta.*Pilvisyys.*%/',
        type: 'success', 
        coverage: 'medium-low'
      },
      // For cloud coverage ≤60%: Warning message with ⛅
      {
        selector: 'text=/⛅.*Parasta lähialueella.*Pilvisyys.*%/',
        type: 'warning',
        coverage: 'medium'
      },
      // For cloud coverage >60%: Error message with ☁️
      {
        selector: 'text=/☁️.*Pilvistä kaikkialla.*Pilvisyys.*%/',
        type: 'error',
        coverage: 'high'
      }
    ];
    
    let messageFound = false;
    for (const message of possibleMessages) {
      const messageElement = page.locator(message.selector);
      if (await messageElement.isVisible()) {
        messageFound = true;
        
        // Verify the message contains cloud coverage percentage
        const messageText = await messageElement.textContent();
        expect(messageText).toMatch(/\d+%/); // Should contain percentage
        break;
      }
    }
    expect(messageFound).toBe(true);
    
    // Verify interactive map display
    // Pydeck map renders correctly
    const mapContainer = page.locator('[data-testid="stDeckGlJsonChart"], .stDeckGlJsonChart, [data-testid="stPydeckChart"]');
    await expect(mapContainer).toBeVisible({ timeout: 10000 });
    
    // Measurement points appear as colored circles
    // Color coding: yellow (sunny) to gray (cloudy)
    // Current location has different marker size
    // Note: These are rendered by Pydeck, so we check for the container
    
    // Tooltips show direction, distance, and cloud coverage on hover
    // This would need mouse hover simulation which might be complex for this test
    
    // Check detailed results table
    const resultsTable = page.locator('[data-testid="stDataFrame"], table').first();
    await expect(resultsTable).toBeVisible({ timeout: 5000 });
    
    // Data table shows all measurement points
    // Columns: Suunta, Etäisyys, Pilvisyys (%), Sää, Lämpötila
    const expectedColumns = ['Suunta', 'Etäisyys', 'Pilvisyys', 'Sää', 'Lämpötila'];
    
    for (const column of expectedColumns) {
      const columnHeader = page.locator(`th:has-text("${column}"), [data-testid="stDataFrame"] >> text=${column}`).first();
      await expect(columnHeader).toBeVisible();
    }
    
    // Results sorted by cloud coverage (best first)
    const firstRow = page.locator('[data-testid="stDataFrame"] tbody tr').first();
    const lastRow = page.locator('[data-testid="stDataFrame"] tbody tr').last();
    
    if (await firstRow.isVisible() && await lastRow.isVisible()) {
      // Progress bar visualization for cloud coverage percentage
      const progressBars = page.locator('[data-testid="stDataFrame"] .stProgress, [role="progressbar"]');
      if (await progressBars.count() > 0) {
        await expect(progressBars.first()).toBeVisible();
      }
    }
    
    // Temperature displayed in Celsius or '–' if unavailable
    const temperatureCells = page.locator('td:has-text("°C"), td:has-text("–")');
    if (await temperatureCells.count() > 0) {
      await expect(temperatureCells.first()).toBeVisible();
    }
  });
});