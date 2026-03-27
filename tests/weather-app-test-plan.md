# Missä paistaa aurinko - Comprehensive Test Plan

## Application Overview

This is a comprehensive test plan for the Finnish weather application 'Missä paistaa aurinko?' (Where is the sun shining?). The application is built with Streamlit and helps users find the sunniest location nearby and view weekly weather forecasts. It automatically detects user location via IP and allows manual coordinate input. The app features two main functionalities: sunshine search within a radius and 7-day weather forecasting using the Open-Meteo API.

## Test Scenarios

### 1. Initial Page Load and Location Detection

**Seed:** `tests/seed-basic.spec.ts`

#### 1.1. Application loads with correct title and content

**File:** `tests/initial-load/page-load.spec.ts`

**Steps:**
  1. Navigate to the application URL
    - expect: Page loads successfully without errors
    - expect: Page title shows 'Missä paistaa aurinko?'
    - expect: Sun emoji ☀️ appears in the title
    - expect: Main heading 'Missä paistaa aurinko?' is visible
  2. Check page layout and basic elements
    - expect: Caption 'Löydä lähin paikka, jossa aurinko paistaa – haetaan säätiedot ympäristöstäsi' is visible
    - expect: Two input fields for latitude and longitude are present
    - expect: Both coordinate input fields have proper labels in Finnish
    - expect: Two main tabs are visible: 'Etsi aurinkoa lähialueelta' and 'Viikon sääennuste'

#### 1.2. Automatic IP-based location detection

**File:** `tests/initial-load/location-detection.spec.ts`

**Steps:**
  1. Load the application and wait for location detection
    - expect: Latitude field is auto-populated with a valid coordinate (-90 to 90)
    - expect: Longitude field is auto-populated with a valid coordinate (-180 to 180)
    - expect: Location caption appears showing estimated city from IP address
    - expect: Caption displays format 'Arvioitu sijainti IP-osoitteesta: [City Name]'
  2. Verify default fallback location when IP detection fails
    - expect: If IP detection fails, coordinates default to Helsinki (60.1699, 24.9384)
    - expect: Application continues to function normally even without IP detection

### 2. Coordinate Input Validation

**Seed:** `tests/seed-basic.spec.ts`

#### 2.1. Valid coordinate input handling

**File:** `tests/coordinates/valid-input.spec.ts`

**Steps:**
  1. Enter valid latitude (60.1699) and longitude (24.9384)
    - expect: Values are accepted and displayed with 4 decimal precision
    - expect: No validation errors appear
    - expect: Input fields show the entered values correctly
  2. Test coordinate boundaries
    - expect: Latitude accepts values from -90 to 90
    - expect: Longitude accepts values from -180 to 180
    - expect: Coordinate inputs allow step changes of 0.01

#### 2.2. Invalid coordinate input handling

**File:** `tests/coordinates/invalid-input.spec.ts`

**Steps:**
  1. Attempt to enter invalid latitude values (>90, <-90)
    - expect: Values outside valid range are rejected
    - expect: Input field shows validation error or resets to boundary value
    - expect: Application remains functional
  2. Attempt to enter invalid longitude values (>180, <-180)
    - expect: Values outside valid range are rejected
    - expect: Input field shows validation error or resets to boundary value
    - expect: Application remains functional

### 3. Sunshine Search Functionality

**Seed:** `tests/seed-search.spec.ts`

#### 3.1. Basic sunshine search execution

**File:** `tests/sunshine-search/basic-search.spec.ts`

**Steps:**
  1. Click on 'Etsi aurinkoa lähialueelta' tab
    - expect: Tab switches to sunshine search view
    - expect: Search radius slider is visible with options 50-300km
    - expect: Default radius is set to 150km
    - expect: Primary button 'Etsi aurinkoa!' is visible and enabled
  2. Execute search with default settings
    - expect: Loading spinner appears with text 'Haetaan säätietoja [N] pisteestä...'
    - expect: Search completes successfully
    - expect: Results show best location with cloud coverage percentage
    - expect: Success/warning message appears based on cloud coverage levels

#### 3.2. Search radius configuration

**File:** `tests/sunshine-search/radius-selection.spec.ts`

**Steps:**
  1. Test different radius options (50, 75, 100, 150, 200, 300 km)
    - expect: Slider allows selection of all available radius options
    - expect: Selected radius is displayed correctly (e.g., '150 km')
    - expect: Different radius selections affect the number of search points
  2. Execute search with minimum radius (50km)
    - expect: Search executes with fewer measurement points
    - expect: Results are appropriate for smaller search area
    - expect: Map shows measurement points within 50km radius
  3. Execute search with maximum radius (300km)
    - expect: Search executes with more measurement points
    - expect: Results cover wider geographical area
    - expect: Map shows measurement points within 300km radius

#### 3.3. Search results display and interpretation

**File:** `tests/sunshine-search/results-display.spec.ts`

**Steps:**
  1. Execute search and analyze result message formats
    - expect: For cloud coverage ≤10%: Success message with ☀️ 'Kirkkainta [location]! Pilvisyys vain [X]%'
    - expect: For cloud coverage ≤30%: Success message with 🌤️ 'Aurinkoisinta [location] Pilvisyys [X]%'
    - expect: For cloud coverage ≤60%: Warning message with ⛅ 'Parasta lähialueella [location] Pilvisyys [X]%'
    - expect: For cloud coverage >60%: Error message with ☁️ 'Pilvistä kaikkialla lähialueella'
  2. Verify interactive map display
    - expect: Pydeck map renders correctly
    - expect: Measurement points appear as colored circles
    - expect: Color coding: yellow (sunny) to gray (cloudy)
    - expect: Current location has different marker size
    - expect: Tooltips show direction, distance, and cloud coverage on hover
  3. Check detailed results table
    - expect: Data table shows all measurement points
    - expect: Columns: Suunta, Etäisyys, Pilvisyys (%), Sää, Lämpötila
    - expect: Results sorted by cloud coverage (best first)
    - expect: Progress bar visualization for cloud coverage percentage
    - expect: Temperature displayed in Celsius or '–' if unavailable

### 4. Weekly Weather Forecast

**Seed:** `tests/seed-forecast.spec.ts`

#### 4.1. Forecast data retrieval and display

**File:** `tests/forecast/basic-forecast.spec.ts`

**Steps:**
  1. Click on 'Viikon sääennuste' tab
    - expect: Tab switches to weekly forecast view
    - expect: Primary button 'Hae viikon ennuste' is visible and enabled
  2. Execute forecast fetch
    - expect: Loading spinner appears with text 'Haetaan 7 päivän ennuste...'
    - expect: Forecast loads successfully
    - expect: 7 daily forecast cards appear in columns
    - expect: Each card shows Finnish weekday abbreviation (Ma, Ti, Ke, etc.)
    - expect: Date format displays as DD.MM.

#### 4.2. Daily forecast card content

**File:** `tests/forecast/daily-cards.spec.ts`

**Steps:**
  1. Examine individual forecast cards
    - expect: Weather icons display appropriate emojis (☀️, 🌤️, ⛅, 🌧️, etc.)
    - expect: Temperature shows max/min in format '🌡 **[max]°** / [min]°'
    - expect: Precipitation probability displays if >10% as '🌧 [X]%'
    - expect: Cloud coverage shows as progress bar with '☁ [X]%'
  2. Verify weather code to emoji mapping
    - expect: Clear sky (code 0): ☀️ Selkeää
    - expect: Partly cloudy (codes 1-3): 🌤️/⛅/🌥️
    - expect: Rain (codes 61-65): 🌧️ Sadetta
    - expect: Snow (codes 71-75): ❄️ Lumisadetta
    - expect: Thunderstorm (code 95): ⛈️ Ukkosta

#### 4.3. Temperature chart display

**File:** `tests/forecast/temperature-chart.spec.ts`

**Steps:**
  1. Check temperature line chart
    - expect: Line chart displays with Finnish day labels (Ma 26.03., Ti 27.03., etc.)
    - expect: Two lines: Maximum (red/orange) and Minimum (blue)
    - expect: Chart shows 'Maksimi' and 'Minimi' temperature trends
    - expect: Y-axis shows temperature in Celsius
  2. Handle missing temperature data
    - expect: If no temperature data available, shows info message 'Lämpötilatietoa ei saatavilla.'
    - expect: Chart gracefully handles missing data points

#### 4.4. Detailed forecast table

**File:** `tests/forecast/detailed-table.spec.ts`

**Steps:**
  1. Examine comprehensive forecast table
    - expect: Table shows columns: Päivä, Sää, Maks °C, Min °C, Pilvisyys %, Sadetod. %, Sademäärä mm, Tuuli km/h, Aurinko nousee, Aurinko laskee
    - expect: Full weekday names in Finnish (e.g., 'Thursday 27.03.')
    - expect: Weather emojis with descriptions
    - expect: Progress bars for cloud coverage and precipitation probability
    - expect: Sunrise/sunset times in HH:MM format
    - expect: '–' displayed for unavailable data

### 5. Error Handling and Edge Cases

**Seed:** `tests/seed-errors.spec.ts`

#### 5.1. Network connectivity issues

**File:** `tests/error-handling/network-errors.spec.ts`

**Steps:**
  1. Simulate network failure during weather API calls
    - expect: Application handles API timeouts gracefully
    - expect: Error messages are displayed in Finnish
    - expect: Forecast failure shows 'Ennusteen haku epäonnistui. Tarkista yhteys.'
    - expect: Application remains functional after network errors
  2. Test with invalid coordinates that might cause API errors
    - expect: Invalid API responses are handled gracefully
    - expect: Default fallback values are used (cloud_cover: 100, weather_code: 99)
    - expect: No application crashes or unhandled exceptions

#### 5.2. Performance under load

**File:** `tests/error-handling/performance.spec.ts`

**Steps:**
  1. Execute multiple rapid searches with different radius settings
    - expect: Application handles concurrent API requests properly
    - expect: ThreadPoolExecutor manages multiple weather requests efficiently
    - expect: UI remains responsive during data loading
    - expect: Caching mechanisms work correctly (ttl=300s for location, ttl=900s for weather)

### 6. Accessibility and Usability

**Seed:** `tests/seed-accessibility.spec.ts`

#### 6.1. Keyboard navigation and screen reader compatibility

**File:** `tests/accessibility/keyboard-navigation.spec.ts`

**Steps:**
  1. Navigate application using only keyboard
    - expect: All interactive elements are reachable via Tab key
    - expect: Tab order follows logical flow
    - expect: Enter key activates buttons
    - expect: Arrow keys navigate slider controls

#### 6.2. Visual design and readability

**File:** `tests/accessibility/visual-design.spec.ts`

**Steps:**
  1. Evaluate color contrast and text readability
    - expect: Color coding on map provides sufficient contrast
    - expect: Text is readable against backgrounds
    - expect: Emojis supplement but don't replace text information
    - expect: Progress bars have clear labeling
