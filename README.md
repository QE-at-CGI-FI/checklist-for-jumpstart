# Weather App End-to-End Tests

Kattavat E2E-testit suomenkieliselle sääsovellukselle "Missä paistaa aurinko?".

## Testin asennus ja käynnistys

### 1. Asenna riippuvuudet

```bash
npm install
npx playwright install
```

### 2. Käynnistä sovellus

Toisessa terminaalissa:
```bash
streamlit run app.py
```

Tai anna Playwrightin käynnistää sovellus automaattisesti (katso `playwright.config.ts`).

### 3. Suorita testit

```bash
# Kaikki testit
npm test

# Näytä selain testauksen aikana
npm run test:headed

# Interaktiivinen UI-tila  
npm run test:ui

# Debug-tila
npm run test:debug

# Näytä raportti
npm run test:report
```

## Testien rakenne

### 📁 tests/initial-load/
- `page-load.spec.ts` - Sovelluksen latautuminen
- `location-detection.spec.ts` - Automaattinen sijaintitunnistus

### 📁 tests/coordinates/  
- `valid-input.spec.ts` - Validit koordinaatit
- `invalid-input.spec.ts` - Invalidit koordinaatit ja virheidenkäsittely

### 📁 tests/sunshine-search/
- `basic-search.spec.ts` - Perus auringonhaku
- `radius-selection.spec.ts` - Hakusäteen valinta
- `results-display.spec.ts` - Tulosten näyttö ja tulkinta

### 📁 tests/forecast/
- `basic-forecast.spec.ts` - Ennusteen haku
- `daily-cards.spec.ts` - Päiväkorttien sisältö  
- `temperature-chart.spec.ts` - Lämpötilakaavio
- `detailed-table.spec.ts` - Yksityiskohtainen taulukko

### 📁 tests/error-handling/
- `network-errors.spec.ts` - Verkko-ongelmat
- `performance.spec.ts` - Suorituskyky kuormituksessa

### 📁 tests/accessibility/
- `keyboard-navigation.spec.ts` - Näppäimistönavigointi
- `visual-design.spec.ts` - Visuaalinen suunnittelu

## Testien ominaisuudet

### 🇫🇮 Suomenkielinen tuki
- Testaa suomenkielistä käyttöliittymää
- Tukee suomalaisia päivännimiä ja aikamerkintöjä
- Testaa emoji-käyttöä sääikonina

### 🌐 API-integraatio  
- Testaa Open-Meteo-rajapinnan käyttöä
- Simuloi verkko-ongelmia
- Testaa välimuistitoimintoja

### 🗺️ Interaktiiviset elementit
- Pydeck-karttojen testaus
- Slider-säätimien käyttö
- Välilehtien navigointi

### ⚡ Suorituskykytestit
- Rinnakkaisten API-kutsujen hallinta
- ThreadPoolExecutor-toiminnallisuus
- Välimuistin tehokkuus

## Konfigurointi

### Selaimet
Testit ajetaan oletuksena:
- Chromium (Desktop)
- Firefox (Desktop)  
- WebKit/Safari (Desktop)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

### Aikakatkaisut
- Perus toiminnot: 5-10s
- API-kutsut: 20-30s  
- Verkko-ongelmat: 45s

### Raportointi
- HTML-raportti (playwright-report/)
- Kuvakaappaukset virhetilanteissa
- Videot epäonnistuneista testeistä
- Trace-jäljet uudelleenyrityksistä

## Vianmääritys

### Yleisimmät ongelmat

1. **Sovellus ei ole käynnissä**
   ```bash
   streamlit run app.py
   ```

2. **Selaimet puuttuvat**  
   ```bash
   npx playwright install
   ```

3. **Testit aikakatkaistuvat**
   - Tarkista verkkoyhteytesi
   - Varmista että Open-Meteo API on saavutettavissa

4. **Elementtejä ei löydy**
   - Varmista että Streamlit-versio on yhteensopiva
   - Tarkista `data-testid` attribuutit

### Debug-vinkkejä

```bash
# Aja yksittäinen testi
npx playwright test tests/initial-load/page-load.spec.ts

# Näytä selain hitaasti  
npx playwright test --headed --slowMo=1000

# Tallenna trace kaikista testeistä
npx playwright test --trace=on
```

## Testien laajentaminen

Lisää uusia testejä kopioimalla olemassa olevan testin rakenne:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Uusi testiryhmä', () => {
  test('Uusi testi', async ({ page }) => {
    await page.goto('/');
    
    // Testaa toiminnallisuutta
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

## Ylläpito

- Päivitä `@playwright/test` säännöllisesti
- Tarkista selainyhteensopivuus
- Päivitä selektorit jos UI muuttuu  
- Testaa API-muutoksia vastaavat testit