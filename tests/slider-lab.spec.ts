import { expect, test } from "@playwright/test";

test("keeps fine precision without making the label noisy", async ({ page }) => {
  await page.goto("/lab/sliders");

  const specimen = page.locator('[data-slider-direction="A"]');
  const slider = specimen.getByRole("slider").first();
  const value = specimen.locator(".slider-option__value").first();

  await expect(slider).toHaveAttribute("aria-labelledby", /.+/);
  await expect(slider).toHaveAttribute("aria-valuenow", "80");
  await slider.focus();
  await page.keyboard.press("ArrowRight");
  await expect(slider).toHaveAttribute("aria-valuenow", "80.1");
  await expect(value).toHaveText("80%");

  await page.keyboard.press("Shift+ArrowRight");
  await expect(slider).toHaveAttribute("aria-valuenow", "81.1");
  await expect(value).toHaveText("81%");
});

test("settles rail clicks but tracks direct dragging immediately", async ({
  page,
}) => {
  await page.goto("/lab/sliders");

  const slider = page
    .locator('[data-slider-direction="A"] .slider-option')
    .first();
  const control = slider.locator(".slider-option__control");
  const controlBox = await control.boundingBox();
  if (!controlBox) throw new Error("Slider control is not visible");

  await control.click({
    position: { x: controlBox.width * 0.75, y: controlBox.height / 2 },
  });
  await expect(slider).toHaveAttribute("data-position-animation", "settle");

  const thumb = slider.locator(".slider-option__thumb");
  const thumbBox = await thumb.boundingBox();
  if (!thumbBox) throw new Error("Slider thumb is not visible");

  await page.mouse.move(
    thumbBox.x + thumbBox.width / 2,
    thumbBox.y + thumbBox.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    thumbBox.x + thumbBox.width / 2 + 24,
    thumbBox.y + thumbBox.height / 2,
    { steps: 4 },
  );
  await page.mouse.up();

  await expect(slider).not.toHaveAttribute("data-position-animation", "settle");
});
