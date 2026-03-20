# Sääsovellus (Node.js + OpenWeather)

Yksinkertainen sääsovellus, johon käyttäjä antaa paikan ja sovellus palauttaa nykyisen sään.

## Ominaisuudet

- Paikan haku lomakkeella
- Nykyinen lämpötila Celsius-asteina
- Säätila/kuvaus
- Virheilmoitus, jos paikkaa ei löydy

## Teknologia

- Node.js
- Express
- OpenWeather API
- Frontend: HTML, CSS, JavaScript

## Käyttöönotto

1. Asenna riippuvuudet:

```bash
npm install
```

2. Luo ympäristömuuttujatiedosto:

```bash
cp .env.example .env
```

3. Lisää OpenWeather API-avain tiedostoon `.env`:

```env
OPENWEATHER_API_KEY=oma_api_avain
PORT=3000
```

4. Käynnistä sovellus:

```bash
npm start
```

5. Avaa selaimessa:

```text
http://localhost:3000
```

## Kehitystila

```bash
npm run dev
```

## API

### GET `/api/weather?place=<paikka>`

Onnistunut vastaus:

```json
{
  "place": "Helsinki",
  "temperatureC": 3.2,
  "description": "pilvistä"
}
```

Virhevastaus (esimerkki):

```json
{
  "message": "Paikkaa ei löytynyt."
}
```

## Huomio tietoturvasta

OpenWeather API-avain pidetään backendissä ympäristömuuttujana. Frontend ei koskaan lähetä avainta selaimeen.
