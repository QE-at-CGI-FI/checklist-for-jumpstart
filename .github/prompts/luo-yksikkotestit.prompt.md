---
name: "Luo yksikkötestit"
description: "Luo tai laajenna Node.js-yksikkötestit valitulle koodille. Käytä kun haluat testimatriisin, virhepolut, regressiotestin ja suorat tiedostomuutokset."
argument-hint: "Anna kohde (tiedosto/symboli), haluttu kattavuus ja mahdolliset virhepolut"
agent: "agent"
---

Luo yksikkötestit annettuun kohteeseen käyttäen tämän projektin käytäntöjä ja tyyliä.

Hyödynnä tarvittaessa skilliä [yksikkotestien-luonti-node](../skills/yksikkotestien-luonti-node/SKILL.md).

Pakollinen eteneminen:

1. Tunnista ensin nykyinen käyttäytyminen ja testaukseen vaikuttavat virhepolut.
2. Tee lyhyt testimatriisi (happy path, validation, domain/error, mahdollinen upstream/config).
3. Lisää tai päivitä testit suoraan oikeaan testitiedostoon.
4. Aja vähintään kohdennettu testiajo ja raportoi tulos.
5. Kerro, mitä kattavuusaukkoja jäi.

Vaatimukset:

- Noudata projektin Node-testityyliä (`node:test`, `node:assert/strict`).
- Käytä nimiä muodossa `returns ... when ...` tai `throws ... when ...`.
- Käytä `assert.rejects` async-virhepoluissa.
- Tee minimimäärä muutoksia, älä refaktoroi tarpeettomasti.

Vastausmuoto:

1. Testimatriisi
2. Tehdyt tiedostomuutokset
3. Ajetut testit ja tulokset
4. Jäljelle jääneet riskit
