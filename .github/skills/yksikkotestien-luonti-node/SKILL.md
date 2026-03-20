---
name: yksikkotestien-luonti-node
description: "Luo ja laajenna Node.js-yksikkötestejä systemaattisesti tässä projektissa. Use when: writing unit tests, adding coverage for edge cases, test matrix for service functions, node:test, assert/strict, mock data validation. Triggerit: yksikkötestit, unit tests, test coverage, weather service tests, test matrix."
argument-hint: "Anna tiedosto/symboli, haluttu kattavuus (happy path, virhepolut, edge caset) ja käytetäänkö mockia vai oikeaa riippuvuutta."
---

# Yksikkötestien Luonti (Node.js)

## Tavoite

Tuottaa luotettavat, luettavat ja ylläpidettävät yksikkötestit Node.js-koodille käyttämällä projektin nykyistä testityyliä (`node:test` + `node:assert/strict`).

## Milloin käyttää

- Kun lisäät uuden funktion tai palvelumetodin.
- Kun korjaat bugin ja haluat regressiotestin.
- Kun haluat kasvattaa kattavuutta erityisesti virhepoluissa.
- Kun mock-datan ja odotusten synkkaa pitää varmistaa.

## Projektikohtaiset oletukset

- Testirunner: `node --test`
- Assertion-kirjasto: `node:assert/strict`
- Sääpalvelun testitiedosto: `services/weather.test.js`
- E2E testataan erikseen, ei korvaa yksikkötestejä.

## Päätöspuu

1. Onko testattava yksikkö puhdas funktio vai integraatiota tekevä metodi?

- Puhdas funktio: testaa suoraan syöte -> tulos.
- Integraatiometodi: eristä ulkoinen riippuvuus (mock/stub) ja testaa oma logiikka.

2. Onko muutos uusi ominaisuus vai bugikorjaus?

- Uusi ominaisuus: vähintään 1 onnistunut polku + 1 epäonnistuva polku.
- Bugikorjaus: kirjoita ensin epäonnistuva regressiotesti, sitten varmista korjauksen jälkeinen läpimeno.

3. Voiko syöte olla virheellinen tai puutteellinen?

- Kyllä: lisää validointitestit (tyhjä, null, väärä muoto).
- Ei: dokumentoi oletus testin nimessä.

## Menettely

1. Tunnista testattava rajapinta.

- Kirjaa mitä funktio palauttaa onnistumisessa.
- Kirjaa mitä virheitä se heittää ja millä virhekoodeilla.

2. Rakenna minimimatriisi.

- Happy path: odotettu onnistuminen.
- Validation error: puuttuva/virheellinen syöte.
- Not found tai domain-virhe.
- Upstream/config-virhe, jos relevantti.

3. Kirjoita testit projektin tyyliin.

- Käytä `test("...", async () => { ... })` rakennetta.
- Käytä `assert.deepStrictEqual`, `assert.equal`, `assert.rejects` tarpeen mukaan.
- Pidä yksi selkeä odotusryhmä per testi.

4. Nimeä testit käyttäytymisen mukaan.

- Muoto: "returns ... when ..." tai "throws ... when ...".
- Vältä toteutukseen sidottuja nimiä.

5. Aja testit ja tee tarvittavat korjaukset.

- Aja ensin kohdennettu tiedosto.
- Aja lopuksi koko testisetti (`npm test`).

## Laadun kriteerit

- Testi epäonnistuu oikeasta syystä, jos tuotantokoodi rikkoutuu.
- Odotusarvot ovat tarkkoja mutta eivät tarpeettoman hauraita.
- Testidata on paikallista ja helposti luettavaa.
- Virhepolut kattavat vähintään validointi- ja domain-virheen.
- Testit ovat deterministisiä (ei satunnaisuutta, aikaa tai verkkoa ilman kontrollia).

## Valmis-määritelmä (Definition of Done)

- Vähintään yksi uusi testi lisätty muutettua käyttäytymistä kohti.
- Virhepolku testattu, jos koodissa on virheenkäsittelyä.
- Testit läpi paikallisesti ilman flaky-käytöstä.
- Testin nimi kertoo miksi testi on olemassa.

## Vastausmalli agentille

Kun tätä skilliä käytetään, tuota aina:

1. Ehdotettu testimatriisi (tapaukset ja perustelu).
2. Konkreettiset testimuutokset tiedostokohtaisesti.
3. Komennot, joilla testit ajetaan.
4. Lyhyt arvio jäljelle jäävistä kattavuusaukoista.

## Valmis testipohja (FI)

```javascript
const test = require("node:test");
const assert = require("node:assert/strict");

const { createWeatherService } = require("./weather");

test("returns mock weather when place exists", async () => {
  const service = createWeatherService({ useMock: true });

  const result = await service.getWeatherByPlace("Helsinki");

  assert.equal(result.place, "Helsinki");
  assert.equal(result.source, "mock");
});

test("throws NOT_FOUND when place does not exist", async () => {
  const service = createWeatherService({ useMock: true });

  await assert.rejects(
    () => service.getWeatherByPlace("Atlantis"),
    (error) => error.code === "NOT_FOUND",
  );
});

test("throws VALIDATION_ERROR when place is empty", async () => {
  const service = createWeatherService({ useMock: true });

  await assert.rejects(
    () => service.getWeatherByPlace("   "),
    (error) => error.code === "VALIDATION_ERROR",
  );
});
```

## Ready Test Template (EN)

Use this template when creating new unit tests in Node.js projects with `node:test` and `assert/strict`:

1. Add one happy-path test for expected output.
2. Add one domain-error test (for example `NOT_FOUND`).
3. Add one validation-error test for empty or invalid input.
4. Prefer `assert.rejects` for async error paths.
5. Keep test names behavior-focused: `returns ... when ...`, `throws ... when ...`.
