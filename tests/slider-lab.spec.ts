import { expect, test } from "@playwright/test";

function lightness(color: string) {
  const channels = color.match(/[\d.]+/g)?.slice(0, 3).map(Number);
  if (!channels || channels.length !== 3) {
    throw new Error(`Could not read colour: ${color}`);
  }

  return channels.reduce((total, channel) => total + channel, 0);
}

test("keeps the label and percentage inside every slider surface", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/lab/sliders");

  const sliders = page.locator(".slider-option");
  await expect(sliders).toHaveCount(6);

  for (let index = 0; index < (await sliders.count()); index += 1) {
    const slider = sliders.nth(index);
    const surface = slider.locator(".slider-option__surface");
    const surfaceBox = await surface.boundingBox();
    const labelBox = await surface
      .locator(".slider-option__label")
      .boundingBox();
    const valueBox = await surface
      .locator(".slider-option__value")
      .boundingBox();

    if (!surfaceBox || !labelBox || !valueBox) {
      throw new Error("Slider readout is not visible");
    }

    for (const box of [labelBox, valueBox]) {
      expect(box.x).toBeGreaterThanOrEqual(surfaceBox.x);
      expect(box.y).toBeGreaterThanOrEqual(surfaceBox.y);
      expect(box.x + box.width).toBeLessThanOrEqual(
        surfaceBox.x + surfaceBox.width,
      );
      expect(box.y + box.height).toBeLessThanOrEqual(
        surfaceBox.y + surfaceBox.height,
      );
    }
  }
});

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

test("keeps Option A flush with a six-dot edge grip", async ({ page }) => {
  await page.goto("/lab/sliders");

  const slider = page
    .locator('[data-slider-direction="A"] .slider-option')
    .first();
  const geometry = await slider.evaluate((element) => {
    const surface = element.querySelector<HTMLElement>(
      ".slider-option__surface",
    );
    const track = element.querySelector<HTMLElement>(".slider-option__track");
    const indicator = element.querySelector<HTMLElement>(
      ".slider-option__indicator",
    );
    const thumb = element.querySelector<HTMLElement>(".slider-option__thumb");
    if (!surface || !track || !indicator || !thumb) {
      throw new Error("Option A anatomy is incomplete");
    }

    const dots = element.querySelectorAll(".slider-option__grip-dot");
    const surfaceRect = surface.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();
    const indicatorRect = indicator.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();

    return {
      bottomGap: trackRect.bottom - indicatorRect.bottom,
      dotCount: dots.length,
      edgeOffset: Math.abs(
        thumbRect.left + thumbRect.width / 2 - indicatorRect.right,
      ),
      indicatorColor: getComputedStyle(indicator).backgroundColor,
      thumbBackground: getComputedStyle(thumb).backgroundColor,
      topGap: indicatorRect.top - trackRect.top,
      trackColor: getComputedStyle(track).backgroundColor,
      trackInset: trackRect.left - surfaceRect.left,
    };
  });

  expect(geometry.dotCount).toBe(6);
  expect(geometry.edgeOffset).toBeLessThanOrEqual(0.1);
  expect(geometry.thumbBackground).toBe("rgba(0, 0, 0, 0)");
  expect(geometry.topGap).toBe(0);
  expect(geometry.bottomGap).toBe(0);
  expect(geometry.trackInset).toBe(1);
  expect(lightness(geometry.indicatorColor)).toBeLessThan(
    lightness(geometry.trackColor),
  );
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
