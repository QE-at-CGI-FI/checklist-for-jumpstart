const { test, expect } = require("@playwright/test");

test("hae Helsingin sää", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Paikka").fill("Helsinki");
  await page.getByRole("button", { name: "Hae sää" }).click();

  await expect(page.locator("#status")).toHaveText("Sää haettu onnistuneesti.");
  await expect(page.locator("#result")).toBeVisible();
  await expect(page.locator("#result-place")).toHaveText("Helsinki");
  await expect(page.locator("#result-temp")).toHaveText("2.4");
  await expect(page.locator("#result-desc")).toHaveText("pilvistä");
  await expect(page.locator("#result-source")).toHaveText("Mock-data");
});
