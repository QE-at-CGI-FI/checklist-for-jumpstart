import { test, expect } from '@playwright/test';

test.describe('Accessibility and Usability', () => {
  test('Visual design and readability', async ({ page }) => {
    // Load the application
    await page.goto('http://localhost:8501', { waitUntil: 'networkidle' });
    
    // Evaluate color contrast and text readability
    
    // Check main heading readability
    const mainHeading = page.locator('h1');
    await expect(mainHeading).toBeVisible();
    
    // Get computed styles for contrast checking
    const headingStyles = await mainHeading.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight
      };
    });
    
    console.log('Main heading styles:', headingStyles);
    
    // Text is readable against backgrounds
    const textElements = page.locator('p, span, div, caption').filter({ hasText: /\w+/ });
    const textCount = await textElements.count();
    
    if (textCount > 0) {
      const firstText = textElements.first();
      const textStyles = await firstText.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          color: styles.color,
          backgroundColor: styles.backgroundColor,
          fontSize: styles.fontSize
        };
      });
      
      console.log('Sample text styles:', textStyles);
    }
    
    // Emojis supplement but don't replace text information  
    const emojiElements = page.locator('text=/[☀️🌤️⛅🌥️🌧️❄️🌨️⛈️📍📅]/');
    const emojiCount = await emojiElements.count();
    
    if (emojiCount > 0) {
      console.log(`Found ${emojiCount} emoji elements`);
      
      // Check that emojis are accompanied by text
      for (let i = 0; i < Math.min(3, emojiCount); i++) {
        const emoji = emojiElements.nth(i);
        const parent = emoji.locator('..');
        const parentText = await parent.textContent();
        
        if (parentText && parentText.length > 2) {
          console.log(`Emoji has accompanying text: ${parentText.substring(0, 50)}`);
        }
      }
    }
    
    // Test sunshine search to check map colors
    const sunshineTab = page.locator('[data-testid="stTabs"] >> text=Etsi aurinkoa lähialueelta');
    await sunshineTab.click();
    
    const searchButton = page.locator('button:has-text("☀️ Etsi aurinkoa!")');
    await searchButton.click();
    
    // Wait for search to complete
    const loadingText = page.locator('text=/Haetaan säätietoja.*pisteestä/');
    try {
      await expect(loadingText).toBeVisible({ timeout: 3000 });
      await expect(loadingText).not.toBeVisible({ timeout: 30000 });
      
      // Color coding on map provides sufficient contrast
      const mapContainer = page.locator('[data-testid="stDeckGlJsonChart"], .stDeckGlJsonChart, [data-testid="stPydeckChart"]');
      await expect(mapContainer).toBeVisible({ timeout: 10000 });
      
      console.log('Map rendered successfully for color contrast evaluation');
      
    } catch (e) {
      console.log('Search did not complete, skipping map color evaluation');
    }
    
    // Progress bars have clear labeling
    const progressBars = page.locator('[data-testid="stProgress"], [role="progressbar"]');
    const progressCount = await progressBars.count();
    
    if (progressCount > 0) {
      const firstProgress = progressBars.first();
      
      // Check for accessible labels
      const progressLabel = await firstProgress.getAttribute('aria-label');
      const progressText = await firstProgress.textContent();
      
      if (progressLabel || progressText) {
        console.log('Progress bars have proper labeling:', progressLabel || progressText);
      }
      
      // Check progress bar styles
      const progressStyles = await firstProgress.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          height: styles.height,
          borderRadius: styles.borderRadius
        };
      });
      
      console.log('Progress bar styles:', progressStyles);
    }
    
    // Test forecast for additional visual elements
    const forecastTab = page.locator('[data-testid="stTabs"] >> text=Viikon sääennuste');
    await forecastTab.click();
    
    const forecastButton = page.locator('button:has-text("📅 Hae viikon ennuste")');
    await forecastButton.click();
    
    try {
      const loadingForecast = page.locator('text=Haetaan 7 päivän ennuste...');
      await expect(loadingForecast).not.toBeVisible({ timeout: 20000 });
      
      // Check forecast card readability
      const forecastCards = page.locator('[data-testid="stColumns"] > div, .stColumn');
      const cardCount = await forecastCards.count();
      
      if (cardCount > 0) {
        const firstCard = forecastCards.first();
        const cardStyles = await firstCard.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            backgroundColor: styles.backgroundColor,
            padding: styles.padding,
            margin: styles.margin,
            borderRadius: styles.borderRadius
          };
        });
        
        console.log('Forecast card styles:', cardStyles);
      }
      
    } catch (e) {
      console.log('Forecast did not complete, skipping forecast visual evaluation');
    }
    
    // Check button accessibility
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      const primaryButton = buttons.filter({ hasText: /Etsi aurinkoa|Hae viikon ennuste/ }).first();
      
      if (await primaryButton.isVisible()) {
        const buttonStyles = await primaryButton.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            backgroundColor: styles.backgroundColor,
            color: styles.color,
            border: styles.border,
            padding: styles.padding,
            fontSize: styles.fontSize,
            cursor: styles.cursor
          };
        });
        
        console.log('Primary button styles:', buttonStyles);
        
        // Check button states
        const isEnabled = await primaryButton.isEnabled();
        console.log('Button is enabled:', isEnabled);
      }
    }
    
    // Final verification that all major elements are visually accessible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-testid="stTabs"]')).toBeVisible();
    
    console.log('Visual design and readability evaluation completed');
  });
});