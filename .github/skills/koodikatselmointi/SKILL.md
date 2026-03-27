---
name: koodikatselmointi
description: "Comprehensive code review for Finnish weather app. Use when: conducting thorough code review; analyzing Python/Streamlit code quality; evaluating Playwright test coverage; checking error handling; validating Finnish UI/UX; investigating performance optimization; security audit focus. Bilingual support: Finnish UI validation + English code standards."
version: "1.0"
---

# Koodikatselmointi - Säähakusovellus

## Katselmointiprosessi

### 1. Yleiskuva ja Arkkitehtuuri

**Tarkista ensin:**

- [ ] Projektin rakenne on looginen ja järjestelmällinen
- [ ] Riippuvuudet ovat ajan tasalla ja turvallisia (requirements.txt, package.json)
- [ ] README.md on kattava ja ajantasainen
- [ ] Konfiguraatiotiedostot ovat oikein määriteltyjä
- [ ] Git-historia on siisti ja commit-viestit kuvaavia

**Arkkitehtuurin tarkistus:**

```
Odotettava rakenne:
- app.py (pääsovellus)
- tests/ (Playwright-testit)
- playwright.config.ts
- requirements.txt
- package.json
```

### 2. Python/Streamlit Backend (app.py)

**Koodin laatu:**

- [ ] Funktiot ovat pieniä ja hyvin nimetty (max 20 riviä)
- [ ] Docstringit ovat suomeksi ja kuvaavia
- [ ] Type hints käytössä kaikissa funktioissa
- [ ] Error handling on kattavaa (try/except-lohkot)
- [ ] Ei hardkoodattuja arvoja (käytä konstanta tai config)

**Streamlit-käytännöt:**

- [ ] `@st.cache_data` käytössä hitaille operaatioille
- [ ] TTL-arvot ovat järkeviä (esim. säädata 15min)
- [ ] Session state hallinta on selkeää
- [ ] Page config on määritelty oikein
- [ ] Layout wide-tilassa jos tarvitaan

**API-käsittely:**

- [ ] HTTP-pyynnöt käyttävät timeout-arvoja
- [ ] Virhetilanteet käsitellään elegantisti
- [ ] Rate limiting huomioitu
- [ ] Ei API-avaimia koodissa (käytä secrets.toml)

**Suorituskyky:**

- [ ] Concurrent.futures käytössä rinnakkaisille pyynnöille
- [ ] Pandas-operaatiot optimoitu
- [ ] Tarpeetonta uudelleenlaskentaa vältetty

### 3. Frontend ja UX

**Suomenkielisyys:**

- [ ] Kaikki käyttäjälle näkyvä teksti on suomeksi
- [ ] Virheilmoitukset suomeksi ja ymmärrettäviä
- [ ] Numerot/desimaalit suomalaisessa muodossa
- [ ] Päivämäärät suomalaisessa muodossa

**Käytettävyys:**

- [ ] Latausajat kohtuullisia (< 3s)
- [ ] Selkeät ohjeet käyttäjälle
- [ ] Virheilmoitukset ohjaavat korjaukseen
- [ ] Responsiivinen design (mobiili + desktop)

### 4. Playwright-testit

**Testien organisointi:**

```
Odotettava rakenne tests/:
- initial-load/ (sivun lataus)
- coordinates/ (koordinaatti-input)
- forecast/ (sääennusteet)
- error-handling/ (virhetilanteet)
- accessibility/ (saavutettavuus)
```

**Testien laatu:**

- [ ] Testit ovat riippumattomia toisistaan
- [ ] Selkeät ja kuvaavat testianimet
- [ ] Page Object Pattern käytössä jos tarpeellista
- [ ] Waiteja käytetty oikein (networkidle, element visible)
- [ ] Ei hardkoodattuja sleep-arvoja
- [ ] Data-testid attribuutit käytössä

**Testien kattavuus:**

- [ ] Happy path skenaariot katettu
- [ ] Edge cases testattu (tyhjä input, virheelliset koordinaatit)
- [ ] Virhetilanteeet katettu (verkkovirhe, API timeout)
- [ ] Saavutettavuustestit mukana
- [ ] Cross-browser testaus

**Assertion-käytännöt:**

- [ ] Tolocate().toBeVisible() latauksen jälkeen
- [ ] toHaveText() tarkkojen tekstien tarkistukseen
- [ ] toContainText() osittaisten tekstien tarkistukseen
- [ ] page.waitForURL() navigaation jälkeen

### 5. Tietoturva

**Web-sovellus:**

- [ ] Ei XSS-haavoittuvuuksia (user input sanitoitu)
- [ ] CSRF-suojaus jos forms käytössä
- [ ] Secure headers asetettu
- [ ] HTTPS käytössä tuotannossa

**Data handling:**

- [ ] Henkilötiedot käsitellään GDPR-yhteensesti
- [ ] Lokitiedot eivät sisällä arkaluontoista dataa
- [ ] IP-osoitteiden käsittely dokumentoitu

### 6. Dokumentaatio ja Ylläpito

**README.md:**

- [ ] Asennusohjeet selkeät ja ajantasaiset
- [ ] Käyttöohjeet suomeksi
- [ ] Testien suoritusohjeet
- [ ] Troubleshooting-osio

**Koodin dokumentointi:**

- [ ] Monimutkaiset algoritmit kommentoitu
- [ ] API-integraatiot dokumentoitu
- [ ] Konfiguraation selitykset

## Työkalut ja Komennot

### Automaattinen laadun tarkistus 🤖

```bash
# Python koodin laatu (Automated code quality)
black app.py --check
flake8 app.py
mypy app.py
pylint app.py

# Security audit (Turvallisuuden tarkistus)
pip audit  # Python dependencies
npm audit  # Node dependencies
safety check  # Alternative for Python

# Testien suoritus (Test execution)
npx playwright test
npx playwright test --headed
npx playwright test --ui
npx playwright test --reporter=html

# Performance analysis
streamlit run app.py --profiler

# Kaksikielinen linting (Bilingual support)
# Check for Finnish text consistency
grep -r "TODO\|FIXME\|BUG" . --include="*.py" --include="*.ts"
# Validate Finnish characters in UI
grep -r "[äöåÄÖÅ]" app.py
```

### Yleisimmät ongelmat ja ratkaisut

**Python/Streamlit:**

- Muista `@st.cache_data` hitaille operaatioille
- Käytä `st.secrets` salaisille arvoille
- Varmista että exception handling ei kaada sovellusta

**Playwright-testit:**

- Käytä `{ waitUntil: 'networkidle' }` sijaintiin perustuvissa testeissä
- Varmista että testit siivotaan aina (cleanup)
- Käytä relative locatoreja kun mahdollista

**Suomenkielisyys:**

- Tarkista että numeroformaatit ovat oikein (10,5 eikä 10.5)
- Päivämääräformaatit dd.mm.yyyy
- Virheviestit ovat käyttäjäystävällisiä

**Kaksikielinen tuki (Bilingual Development):**

- Code comments can be in English for international maintainability
- Variable and function names in English (standard practice)
- Error logging can be in English (for debugging)
- User-facing content MUST be in Finnish
- Mixed language prevention: UI validation during review

## Katselmointitulos

**Hyväksyntäkriteerit:**

- [ ] Kaikki testit menevä läpi
- [ ] Ei security-haavoittuvuuksia
- [ ] UI on täysin suomeksi
- [ ] Dokumentaatio ajantasalla
- [ ] Performance hyväksyttävällä tasolla (< 3s lataus)

**Jatkotoimenpiteet:**

- Listaa kriittiset korjaukset
- Ehdota parannuksia
- Määritä prioriteetit
