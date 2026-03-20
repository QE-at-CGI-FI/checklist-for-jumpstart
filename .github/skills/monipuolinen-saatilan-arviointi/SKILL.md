---
name: monipuolinen-saatilan-arviointi
description: "Arvioi säätiedot monipuolisesti ja tee perusteltu kokonaisarvio erityisesti liikenteen ja matkustuksen päätöksiin. Käytä kun haluat analysoida lämpötilaa, tuulta, sadetta, näkyvyyttä, varoituksia ja epävarmuutta sekä tuottaa toimintasuositukset kaksikielisesti (FI+EN). Triggerit: weather assessment, weather risk, forecast analysis, travel weather, traffic weather, sääanalyysi, säätilan arviointi."
argument-hint: "Anna sijainti, aikajänne, matkustustapa (auto, pyörä, kävely, joukkoliikenne), reitin pituus ja aikakriittisyys."
---

# Monipuolinen Säätilan Arviointi

## Milloin käyttää

- Kun haluat yhden selkeän kokonaisarvion useasta säämuuttujasta.
- Kun tarvitset päätöstukea (esim. ulkoilun turvallisuus, tapahtuman toteutus, matkustus).
- Kun haluat erottaa olosuhde-riskin ja ennusteen epävarmuuden toisistaan.
- Kun painopiste on liikenteessä tai matkustamisessa (lähtöaika, reitti, varautuminen).

## Syötteet

Pyydä tai tunnista aina vähintään seuraavat:

1. Sijainti (kaupunki tai koordinaatit)
2. Aikaikkuna (nyt, seuraavat 6-12 h, seuraava vuorokausi)
3. Käyttäjäryhmä tai käyttötarkoitus (yleinen, ulkoilu, liikenne, tapahtuma)
4. Käytettävissä olevat säähavainnot/ennusteet
5. Matkustustapa ja aikakriittisyys (myöhästymisen vaikutus)

## Menettely

1. Normalisoi data.

- Muunna yksiköt tarvittaessa (C, m/s, mm/h, km).
- Ryhmittele tiedot aikaikkunoittain.

2. Tee perusarvio muuttujittain.

- Lämpötila: min/max, äkilliset muutokset, tuntuma (jos saatavilla).
- Tuuli: keskituuli, puuskat, suuntavaikutus (esim. vastatuuli).
- Sade: tyyppi, intensiteetti, kesto, todennäköisyys.
- Näkyvyys ja pilvisyys: turvallisuus- ja mukavuusvaikutus.
- Varoitukset: ukkonen, myrsky, liukkaus, helle/pakkanen.

3. Lisää matkustusvaikutus.

- Tunnista vaikutus kulkutapaan (jarrutusmatka, liukkaus, pyöräilyn sivutuuli, kävelyn altistus).
- Arvioi aikatauluriskit (hidastuminen, ruuhkaantuminen, viiveherkkyys).
- Muodosta reitti- tai lähtöaikavaihtoehto, jos riski kasvaa.

4. Laske kokonaisriskitaso (1-5).

- 1 = hyvin suotuisa
- 2 = pääosin suotuisa
- 3 = vaihteleva, varautuminen tarpeen
- 4 = haastava, vain valmistautuneille
- 5 = korkea riski, harkitse siirtoa/peruutusta

5. Erottele epävarmuus.

- Merkitse mikä arvio perustuu varmaan havaintoon vs. ennusteeseen.
- Jos ristiriitaisia signaaleja: nosta epävarmuusluokkaa yhdellä tasolla.

6. Tuota toimintasuositus kaksikielisesti (FI + EN).

- Anna lyhyt yhteenveto (2-4 lausetta).
- Anna konkreettiset toimet (varusteet, aikataulu, vaihtoehdot).
- Lisää "päivitä arvio"-hetki (milloin ennuste kannattaa tarkistaa uudelleen).

## Päätöspisteet

- Jos varoitus on aktiivinen: priorisoi turvallisuus, nosta riskitasoa vähintään tasolle 4.
- Jos sade + puuskat + huono näkyvyys esiintyvät samanaikaisesti: nosta riskitasoa vähintään yhdellä tasolla.
- Jos lämpötila on äärialueella (helle/pakkanen): lisää erillinen terveyshuomio.
- Jos käyttäjäryhmä on herkkä (lapset, iäkkäät, kokemattomat): tiukenna suositusta.
- Jos kyseessä on aikakriittinen matka: priorisoi ennakoiva lähtö ja varareitti.

## Laadunvarmistus ennen lopputulosta

- Sisältääkö arvio kaikki 5 näkökulmaa: lämpötila, tuuli, sade, näkyvyys, varoitukset?
- Sisältääkö arvio matkustusvaikutuksen kulkutapaan?
- Onko riskitaso perusteltu selkeästi?
- Onko epävarmuus kerrottu erikseen?
- Onko suositus toiminnallinen (mitä tehdä nyt)?
- Onko seuraava tarkistusajankohta mukana?

## Vakiomuotoinen vastauspohja

Käytä tätä rakennetta:

1. FI: Kokonaisarvio: riskitaso 1-5 + yksi perustelulause.
2. FI: Keskeiset tekijät: 3-5 kohtaa tärkeimmistä havainnoista.
3. FI: Epävarmuus: mikä voi muuttua ja miten paljon.
4. FI: Toimintasuositus: välittömät toimet + varasuunnitelma.
5. FI: Seuraava tarkistus: tarkka aika tai aikaväli.
6. EN: Overall assessment mirroring items 1-5 in concise English.
