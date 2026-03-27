"""Selaintestit: Missä paistaa aurinko? -sovellus (Playwright + pytest)."""

import re

from playwright.sync_api import Page, expect


def test_page_loads_with_title(page: Page, app_url: str):
    """Sovellus latautuu ja otsikko näkyy."""
    page.goto(app_url)
    expect(page.locator("h1")).to_contain_text("Missä paistaa aurinko")


def test_coordinate_inputs_visible(page: Page, app_url: str):
    """Leveysaste- ja pituusaste-kentät näkyvät."""
    page.goto(app_url)
    expect(page.get_by_text("Leveysaste (lat)")).to_be_visible()
    expect(page.get_by_text("Pituusaste (lon)")).to_be_visible()


def test_tabs_exist(page: Page, app_url: str):
    """Molemmat välilehdet löytyvät."""
    page.goto(app_url)
    expect(page.get_by_role("tab", name=re.compile("Etsi aurinkoa"))).to_be_visible()
    expect(page.get_by_role("tab", name=re.compile("Viikon"))).to_be_visible()


def test_search_button_exists(page: Page, app_url: str):
    """Etsi aurinkoa -painike löytyy search-välilehdeltä."""
    page.goto(app_url)
    btn = page.get_by_role("button", name=re.compile("Etsi aurinkoa"))
    expect(btn).to_be_visible()


def test_search_returns_results(page: Page, app_url: str):
    """Hakupainikkeen klikkaus tuottaa tuloksia (kartta tai taulukko ilmestyy)."""
    page.goto(app_url)
    page.get_by_role("button", name=re.compile("Etsi aurinkoa")).click()

    # Odota joko success/warning/error-laatikkoa tai taulukkoa (max 30 s)
    page.wait_for_selector(
        "[data-testid='stAlert'], [data-testid='stDataFrame']",
        timeout=30000,
    )
    # Tarkista, että jotain ilmestyi
    alerts = page.locator("[data-testid='stAlert']")
    tables = page.locator("[data-testid='stDataFrame']")
    assert alerts.count() > 0 or tables.count() > 0, "Haku ei tuottanut tuloksia"


def test_weekly_forecast_tab(page: Page, app_url: str):
    """Viikon sääennuste -välilehti avautuu ja painike löytyy."""
    page.goto(app_url)
    page.get_by_role("tab", name=re.compile("Viikon")).click()
    btn = page.get_by_role("button", name=re.compile("Hae viikon ennuste"))
    expect(btn).to_be_visible()


def test_weekly_forecast_returns_data(page: Page, app_url: str):
    """Viikon ennuste -painike tuottaa dataa."""
    page.goto(app_url)
    page.get_by_role("tab", name=re.compile("Viikon")).click()
    page.get_by_role("button", name=re.compile("Hae viikon ennuste")).click()

    # Odota taulukkoa tai lämpötilakaaviota
    page.wait_for_selector(
        "[data-testid='stDataFrame'], [data-testid='stVegaLiteChart']",
        timeout=30000,
    )
    tables = page.locator("[data-testid='stDataFrame']")
    assert tables.count() > 0, "Viikkoennuste ei tuottanut taulukkoa"


def test_hakusade_slider_exists(page: Page, app_url: str):
    """Hakusäde-liukusäädin näkyy."""
    page.goto(app_url)
    expect(page.get_by_text("Hakusäde")).to_be_visible()
