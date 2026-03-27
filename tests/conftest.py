"""Conftest: käynnistää Streamlit-sovelluksen testejä varten."""

import subprocess
import time

import httpx
import pytest


@pytest.fixture(scope="session")
def app_url():
    """Käynnistä Streamlit taustaprosessina ja odota sen valmiutta."""
    port = 8502
    url = f"http://localhost:{port}"

    proc = subprocess.Popen(
        [
            "streamlit", "run", "app.py",
            "--server.port", str(port),
            "--server.headless", "true",
            "--browser.gatherUsageStats", "false",
        ],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )

    # Odota max 30 s, kunnes palvelin vastaa
    for _ in range(60):
        try:
            r = httpx.get(f"{url}/_stcore/health", timeout=2)
            if r.status_code == 200:
                break
        except Exception:
            pass
        time.sleep(0.5)
    else:
        proc.terminate()
        raise RuntimeError("Streamlit ei käynnistynyt 30 sekunnissa")

    yield url

    proc.terminate()
    proc.wait(timeout=5)
