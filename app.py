import math
import pandas as pd
import pydeck as pdk
import streamlit as st
import httpx
from concurrent.futures import ThreadPoolExecutor, as_completed

st.set_page_config(
    page_title="Missä paistaa aurinko?",
    page_icon="☀️",
    layout="wide",
)

st.title("☀️ Missä paistaa aurinko?")
st.caption("Löydä lähin paikka, jossa aurinko paistaa – haetaan säätiedot ympäristöstäsi")

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

@st.cache_data(ttl=300)
def get_location_from_ip() -> tuple[float, float, str]:
    """Arvaa sijainti IP-osoitteen perusteella."""
    try:
        r = httpx.get("https://ipapi.co/json/", timeout=5)
        r.raise_for_status()
        data = r.json()
        return round(float(data["latitude"]), 4), round(float(data["longitude"]), 4), data.get("city", "")
    except Exception:
        return 60.1699, 24.9384, "Helsinki"


@st.cache_data(ttl=900)
def get_weather(lat: float, lon: float) -> dict:
    """Hae pilvisyys ja lämpötila Open-Meteo-rajapinnasta (ilmainen, ei API-avainta)."""
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": "cloud_cover,weather_code,temperature_2m",
        "timezone": "auto",
    }
    try:
        r = httpx.get(url, params=params, timeout=10)
        r.raise_for_status()
        current = r.json().get("current", {})
        return {
            "cloud_cover": current.get("cloud_cover", 100),
            "weather_code": current.get("weather_code", 99),
            "temperature": current.get("temperature_2m"),
        }
    except Exception:
        return {"cloud_cover": 100, "weather_code": 99, "temperature": None}


@st.cache_data(ttl=1800)
def get_weekly_forecast(lat: float, lon: float) -> list[dict]:
    """Hae 7 päivän ennuste Open-Meteo-rajapinnasta."""
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "daily": ",".join([
            "weather_code",
            "temperature_2m_max",
            "temperature_2m_min",
            "precipitation_sum",
            "precipitation_probability_max",
            "cloud_cover_mean",
            "wind_speed_10m_max",
            "sunrise",
            "sunset",
        ]),
        "timezone": "auto",
        "forecast_days": 7,
    }
    try:
        r = httpx.get(url, params=params, timeout=10)
        r.raise_for_status()
        daily = r.json().get("daily", {})
        days = []
        for i, date in enumerate(daily.get("time", [])):
            def _val(key: str) -> float | int | str | None:
                arr = daily.get(key)
                if arr is None or i >= len(arr):
                    return None
                return arr[i]
            days.append({
                "date": date,
                "weather_code": _val("weather_code") or 0,
                "temp_max": _val("temperature_2m_max"),
                "temp_min": _val("temperature_2m_min"),
                "precip_mm": _val("precipitation_sum"),
                "precip_prob": _val("precipitation_probability_max"),
                "cloud_cover": _val("cloud_cover_mean"),
                "wind_max": _val("wind_speed_10m_max"),
                "sunrise": _val("sunrise") or "",
                "sunset": _val("sunset") or "",
            })
        return days
    except Exception:
        return []


def wmo_to_emoji(code: int) -> str:
    """WMO säätila-koodi ihmisluettavaksi tekstiksi."""
    if code == 0:
        return "☀️ Selkeää"
    if code in (1, 2, 3):
        return ["🌤️ Pääosin selkeää", "⛅ Vaihtelevaa", "🌥️ Pilvistä"][code - 1]
    if code in (45, 48):
        return "🌫️ Sumua"
    if code in (51, 53, 55):
        return "🌦️ Tihkusadetta"
    if code in (61, 63, 65):
        return "🌧️ Sadetta"
    if code in (71, 73, 75):
        return "❄️ Lumisadetta"
    if code == 77:
        return "🌨️ Lumirakeita"
    if code in (80, 81, 82):
        return "🌦️ Sadekuuroja"
    if code in (85, 86):
        return "🌨️ Lumikuuroja"
    if code == 95:
        return "⛈️ Ukkosta"
    if code in (96, 99):
        return "⛈️ Raesateita"
    return f"🌡️ ({code})"


def generate_points(lat: float, lon: float, max_km: int) -> list[dict]:
    """Luo mittauspisteet neljään kehään kahdeksaan suuntaan."""
    num_rings = 4
    num_dirs = 8
    points = [{"lat": lat, "lon": lon, "distance_km": 0, "direction": "Oma sijainti 📍"}]
    for ring in range(1, num_rings + 1):
        d = (max_km / num_rings) * ring
        for i in range(num_dirs):
            angle_deg = (360 / num_dirs) * i
            angle_rad = math.radians(angle_deg)
            dlat = (d / 111.0) * math.cos(angle_rad)
            cos_lat = math.cos(math.radians(lat))
            dlon = (d / (111.0 * max(cos_lat, 0.01))) * math.sin(angle_rad)
            points.append({
                "lat": round(lat + dlat, 3),
                "lon": round(lon + dlon, 3),
                "distance_km": round(d),
                "direction": _angle_to_direction(angle_deg),
            })
    return points


def _angle_to_direction(angle: float) -> str:
    dirs = [
        "pohjoinen ⬆️", "koillinen ↗️", "itä ➡️", "kaakko ↘️",
        "etelä ⬇️", "lounas ↙️", "länsi ⬅️", "luode ↖️",
    ]
    return dirs[round(angle / 45) % 8]


def cloud_to_label(cc: int) -> str:
    if cc <= 10:
        return "☀️ Kirkkaasti selkeää"
    if cc <= 30:
        return "🌤️ Pääosin selkeää"
    if cc <= 60:
        return "⛅ Puolipilvistä"
    if cc <= 80:
        return "🌥️ Melko pilvistä"
    return "☁️ Pilvistä"


def cloud_to_color(cc: int) -> list[int]:
    """Keltainen = aurinkoinen, harmaa = pilvinen."""
    t = cc / 100.0
    r = int(255 - t * 153)   # 255 → 102
    g = int(200 - t * 200)   # 200 → 0
    b = int(t * 128)          # 0   → 128
    return [r, g, b, 210]


# ---------------------------------------------------------------------------
# UI – sijainti (yhteinen molemmille välilehdille)
# ---------------------------------------------------------------------------

ip_lat, ip_lon, ip_city = get_location_from_ip()

col1, col2 = st.columns(2)
with col1:
    lat = st.number_input(
        "Leveysaste (lat)", value=ip_lat, format="%.4f",
        min_value=-90.0, max_value=90.0, step=0.01,
    )
with col2:
    lon = st.number_input(
        "Pituusaste (lon)", value=ip_lon, format="%.4f",
        min_value=-180.0, max_value=180.0, step=0.01,
    )

if ip_city:
    st.caption(f"📍 Arvioitu sijainti IP-osoitteesta: **{ip_city}**")

st.divider()

tab_search, tab_week = st.tabs(["☀️ Etsi aurinkoa lähialueelta", "📅 Viikon sääennuste"])

# ---------------------------------------------------------------------------
# Välilehti 1: Etsi aurinkoa
# ---------------------------------------------------------------------------
with tab_search:
    max_km = st.select_slider(
        "Hakusäde",
        options=[50, 75, 100, 150, 200, 300],
        value=150,
        format_func=lambda x: f"{x} km",
    )

    if st.button("☀️ Etsi aurinkoa!", type="primary", use_container_width=True):
        points = generate_points(lat, lon, max_km)

        with st.spinner(f"Haetaan säätietoja {len(points)} pisteestä..."):
            results: list[dict] = []
            with ThreadPoolExecutor(max_workers=12) as ex:
                futures = {ex.submit(get_weather, p["lat"], p["lon"]): p for p in points}
                for future in as_completed(futures):
                    p = futures[future]
                    results.append({**p, **future.result()})

        results.sort(key=lambda x: (x["cloud_cover"], x["distance_km"]))
        best = results[0]

        # Tulosviestin muotoilu
        cc = best["cloud_cover"]
        loc = "kotona" if best["distance_km"] == 0 else f"{best['distance_km']} km **{best['direction']}**"
        if cc <= 10:
            st.success(f"## ☀️ Kirkkainta {loc}!  \nPilvisyys vain **{cc}%**")
        elif cc <= 30:
            st.success(f"## 🌤️ Aurinkoisinta {loc}  \nPilvisyys **{cc}%**")
        elif cc <= 60:
            st.warning(f"## ⛅ Parasta lähialueella {loc}  \nPilvisyys **{cc}%** – osittain pilvistä kaikkialla")
        else:
            st.error(f"## ☁️ Pilvistä kaikkialla lähialueella  \nPienin pilvisyys **{cc}%** ({best['distance_km']} km {best['direction']})")

        # Kartta
        map_df = pd.DataFrame([
            {
                "lat": r["lat"],
                "lon": r["lon"],
                "color": cloud_to_color(r["cloud_cover"]),
                "tooltip": f"{r['direction']} · {r['distance_km']} km · pilvisyys {r['cloud_cover']}%",
                "radius": 14000 if r["distance_km"] > 0 else 8000,
            }
            for r in results
        ])

        layer = pdk.Layer(
            "ScatterplotLayer",
            map_df,
            get_position=["lon", "lat"],
            get_fill_color="color",
            get_radius="radius",
            pickable=True,
            auto_highlight=True,
        )
        view = pdk.ViewState(latitude=lat, longitude=lon, zoom=5)
        st.pydeck_chart(
            pdk.Deck(
                layers=[layer],
                initial_view_state=view,
                tooltip={"text": "{tooltip}"},
            )
        )

        # Taulukko
        st.subheader("Kaikki mittauspisteet")
        table_df = pd.DataFrame([
            {
                "Suunta": r["direction"],
                "Etäisyys": f"{r['distance_km']} km",
                "Pilvisyys (%)": r["cloud_cover"],
                "Sää": cloud_to_label(r["cloud_cover"]),
                "Lämpötila": f"{r['temperature']} °C" if r["temperature"] is not None else "–",
            }
            for r in results
        ])
        st.dataframe(
            table_df,
            use_container_width=True,
            hide_index=True,
            column_config={
                "Pilvisyys (%)": st.column_config.ProgressColumn(
                    min_value=0, max_value=100, format="%d%%"
                )
            },
        )

# ---------------------------------------------------------------------------
# Välilehti 2: Viikon sääennuste
# ---------------------------------------------------------------------------
with tab_week:
    if st.button("📅 Hae viikon ennuste", type="primary", use_container_width=True):
        with st.spinner("Haetaan 7 päivän ennuste..."):
            forecast = get_weekly_forecast(lat, lon)

        if not forecast:
            st.error("Ennusteen haku epäonnistui. Tarkista yhteys.")
        else:
            # --- Päiväkortit ---
            cols = st.columns(len(forecast))
            for col, day in zip(cols, forecast):
                date_obj = pd.Timestamp(day["date"])
                weekday = date_obj.strftime("%a")
                finnish_days = {
                    "Mon": "Ma", "Tue": "Ti", "Wed": "Ke",
                    "Thu": "To", "Fri": "Pe", "Sat": "La", "Sun": "Su",
                }
                päivä = finnish_days.get(weekday, weekday)
                with col:
                    st.markdown(f"**{päivä}**  \n{date_obj.strftime('%d.%m.')}")
                    st.markdown(wmo_to_emoji(day["weather_code"]))
                    t_max = day["temp_max"]
                    t_min = day["temp_min"]
                    if t_max is not None and t_min is not None:
                        st.markdown(f"🌡 **{t_max:.0f}°** / {t_min:.0f}°")
                    elif t_max is not None:
                        st.markdown(f"🌡 **{t_max:.0f}°**")
                    pp = day["precip_prob"]
                    if pp is not None and pp > 10:
                        st.markdown(f"🌧 {pp:.0f}%")
                    cc = day["cloud_cover"]
                    if cc is not None:
                        st.progress(
                            max(0.0, min(float(cc) / 100, 1.0)),
                            text=f"☁ {cc:.0f}%",
                        )

            st.divider()

            # --- Lämpötilakaavio ---
            _FI_DAYS = {
                "Mon": "Ma", "Tue": "Ti", "Wed": "Ke",
                "Thu": "To", "Fri": "Pe", "Sat": "La", "Sun": "Su",
            }

            def _fi_date(date_str: str) -> str:
                ts = pd.Timestamp(date_str)
                day_abbr = ts.strftime("%a")
                return f"{_FI_DAYS.get(day_abbr, day_abbr)} {ts.strftime('%d.%m.')}"

            st.subheader("Lämpötila °C")
            valid_days = [d for d in forecast if d["temp_max"] is not None and d["temp_min"] is not None]
            if valid_days:
                chart_df = pd.DataFrame({
                    "Päivä": [_fi_date(d["date"]) for d in valid_days],
                    "Maksimi": [d["temp_max"] for d in valid_days],
                    "Minimi": [d["temp_min"] for d in valid_days],
                    }).set_index("Päivä")
                st.line_chart(chart_df, color=["#FF6B35", "#4A90D9"])
            else:
                st.info("Lämpötilatietoa ei saatavilla.")

            # --- Tarkka taulukko ---
            st.subheader("Yksityiskohtainen ennuste")

            def fmt_time(dt_str: str) -> str:
                try:
                    return pd.Timestamp(dt_str).strftime("%H:%M")
                except Exception:
                    return "–"

            table_df2 = pd.DataFrame([
                {
                    "Päivä": pd.Timestamp(d["date"]).strftime("%A %d.%m.").capitalize(),
                    "Sää": wmo_to_emoji(d["weather_code"]),
                    "Maks °C": d["temp_max"] if d["temp_max"] is not None else "–",
                    "Min °C": d["temp_min"] if d["temp_min"] is not None else "–",
                    "Pilvisyys %": d["cloud_cover"],
                    "Sadetod. %": d["precip_prob"],
                    "Sademäärä mm": d["precip_mm"] if d["precip_mm"] is not None else "–",
                    "Tuuli km/h": d["wind_max"] if d["wind_max"] is not None else "–",
                    "Aurinko nousee": fmt_time(d["sunrise"]),
                    "Aurinko laskee": fmt_time(d["sunset"]),
                }
                for d in forecast
            ])
            st.dataframe(
                table_df2,
                use_container_width=True,
                hide_index=True,
                column_config={
                    "Pilvisyys %": st.column_config.ProgressColumn(
                        min_value=0, max_value=100, format="%d%%"
                    ),
                    "Sadetod. %": st.column_config.ProgressColumn(
                        min_value=0, max_value=100, format="%d%%"
                    ),
                },
            )
