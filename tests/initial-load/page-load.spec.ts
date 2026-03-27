import { test, expect } from '@playwright/test';

test.describe('Initial Page Load and Location Detection', () => {
  test('Application loads with correct title and content', async ({ page }) => {
    // Navigate to the application URL
    await page.goto('http://localhost:8501', { waitUntil: 'networkidle' });
    
    // Page loads successfully without errors
    await expect(page).toHaveTitle(/Missä paistaa aurinko?/);
    
    // Page title shows 'Missä paistaa aurinko?'
    await expect(page.locator('title')).toContainText('Missä paistaa aurinko?');
    
    // Sun emoji ☀️ appears in the title
    await expect(page.locator('h1')).toContainText('☀️');
    
    // Main heading 'Missä paistaa aurinko?' is visible
    await expect(page.locator('h1')).toContainText('Missä paistaa aurinko?');
    
    // Check page layout and basic elements
    // Caption 'Löydä lähin paikka, jossa aurinko paistaa – haetaan säätiedot ympäristöstäsi' is visible
    await expect(page.locator('[data-testid="stCaption"]')).toContainText('Löydä lähin paikka, jossa aurinko paistaa – haetaan säätiedot ympäristöstäsi');
    
    // Two input fields for latitude and longitude are present
    const latInput = page.locator('label:has-text("Leveysaste") + div input');
    const lonInput = page.locator('label:has-text("Pituusaste") + div input');
    await expect(latInput).toBeVisible();
    await expect(lonInput).toBeVisible();
    
    // Both coordinate input fields have proper labels in Finnish
    await expect(page.locator('label:has-text("Leveysaste")')).toBeVisible();
    await expect(page.locator('label:has-text("Pituusaste")')).toBeVisible();
    
    // Two main tabs are visible: 'Etsi aurinkoa lähialueelta' and 'Viikon sääennuste'
    await expect(page.locator('[data-testid="stTabs"] >> text=Etsi aurinkoa lähialueelta')).toBeVisible();
    await expect(page.locator('[data-testid="stTabs"] >> text=Viikon sääennuste')).toBeVisible();
  });
});