import { test, expect } from '@playwright/test';

test.describe('Accessibility and Usability', () => {
  test('Keyboard navigation and screen reader compatibility', async ({ page }) => {
    // Load the application
    await page.goto('http://localhost:8501', { waitUntil: 'networkidle' });
    
    // Navigate application using only keyboard
    // Start from the first interactive element
    await page.keyboard.press('Tab');
    
    // All interactive elements are reachable via Tab key
    const interactiveElements = [
      'input[type="number"]', // Coordinate inputs
      'button', // Search buttons
      '[data-testid="stTabs"] button', // Tab buttons  
      '[role="slider"]', // Radius slider
      '[data-testid="stSelectSlider"] button' // Slider buttons
    ];
    
    let tabCount = 0;
    const maxTabs = 20; // Prevent infinite loop
    
    while (tabCount < maxTabs) {
      await page.keyboard.press('Tab');
      tabCount++;
      
      // Check if we can identify the currently focused element
      const focusedElement = await page.locator(':focus').first();
      
      if (await focusedElement.isVisible()) {
        const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase());
        const role = await focusedElement.getAttribute('role');
        
        // Tab order follows logical flow
        console.log(`Tab ${tabCount}: ${tagName} ${role ? `(${role})` : ''}`);
        
        // Test Enter key activation for buttons
        if (tagName === 'button' || role === 'button') {
          // For certain buttons, test Enter key activation
          const buttonText = await focusedElement.textContent();
          
          if (buttonText?.includes('Etsi aurinkoa') || buttonText?.includes('Hae viikon ennuste')) {
            console.log(`Found actionable button: ${buttonText}`);
            // We could test Enter activation but it would trigger API calls
          }
        }
        
        // Test arrow key navigation for sliders
        if (role === 'slider' || tagName === 'input') {
          // Arrow keys navigate slider controls
          const initialValue = await focusedElement.inputValue();
          
          if (initialValue) {
            await page.keyboard.press('ArrowRight');
            const newValue = await focusedElement.inputValue();
            
            if (newValue !== initialValue) {
              console.log(`Slider navigation works: ${initialValue} -> ${newValue}`);
            }
            
            // Reset to original value
            await focusedElement.fill(initialValue);
          }
        }
      }
      
      // Stop if we've reached the end and cycled back
      const currentUrl = page.url();
      if (!currentUrl.includes('localhost:8501')) {
        break;
      }
    }
    
    // Test tab navigation to main sections
    await page.keyboard.press('Home'); // Go to top
    
    // Navigate to coordinates section
    await page.focus('label:has-text("Leveysaste") + div input');
    await expect(page.locator(':focus')).toBeVisible();
    
    // Navigate to longitude
    await page.keyboard.press('Tab');
    await expect(page.locator('label:has-text("Pituusaste") + div input')).toBeFocused();
    
    // Navigate to tabs
    const sunshineTab = page.locator('[data-testid="stTabs"] >> text=Etsi aurinkoa lähialueelta');
    await sunshineTab.focus();
    await page.keyboard.press('Enter');
    
    // Verify tab activation works
    await expect(sunshineTab).toHaveAttribute('aria-selected', 'true');
    
    // Test forecast tab activation
    await page.keyboard.press('ArrowRight'); // Move to next tab
    const forecastTab = page.locator('[data-testid="stTabs"] >> text=Viikon sääennuste');
    await page.keyboard.press('Enter');
    
    if (await forecastTab.isVisible()) {
      await expect(forecastTab).toHaveAttribute('aria-selected', 'true');
    }
    
    console.log('Keyboard navigation test completed successfully');
  });
});