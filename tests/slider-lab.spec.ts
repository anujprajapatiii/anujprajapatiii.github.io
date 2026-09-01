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

test("keeps the theme shortcut available after using a slider", async ({
  page,
}) => {
  await page.goto("/lab/sliders");

  const slider = page
    .locator('[data-slider-direction="A"]')
    .getByRole("slider")
    .first();
  const startedDark = await page.evaluate(() =>
    document.documentElement.classList.contains("dark"),
  );

  await slider.focus();
  await page.keyboard.press("ArrowRight");
  await expect(slider).toBeFocused();
  await page.keyboard.press("l");

  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.classList.contains("dark")),
    )
    .toBe(!startedDark);
  await expect(slider).toBeFocused();
});

test("keeps Option A flush with a 3+3 dot edge grip", async ({ page }) => {
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

    const grip = element.querySelector<HTMLElement>(".slider-option__grip");
    const dots = Array.from(
      element.querySelectorAll<HTMLElement>(".slider-option__grip-dot"),
    );
    if (!grip) throw new Error("Option A grip is missing");

    const surfaceRect = surface.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();
    const indicatorRect = indicator.getBoundingClientRect();
    const gripRect = grip.getBoundingClientRect();
    const dotRects = dots.map((dot) => dot.getBoundingClientRect());
    const rowRects = [dotRects[0], dotRects[2], dotRects[4]];
    const verticalGaps = [
      rowRects[0].top - gripRect.top,
      rowRects[1].top - rowRects[0].bottom,
      rowRects[2].top - rowRects[1].bottom,
      gripRect.bottom - rowRects[2].bottom,
    ];
    const columnGap = dotRects[1].left - dotRects[0].right;
    const rowGap = dotRects[2].top - dotRects[0].bottom;

    return {
      bottomGap: trackRect.bottom - indicatorRect.bottom,
      columnGap,
      dotCount: dots.length,
      gripOpacity: getComputedStyle(grip).opacity,
      indicatorColor: getComputedStyle(indicator).backgroundColor,
      fillEdgeGap:
        indicatorRect.right - Math.max(...dotRects.map((dot) => dot.right)),
      rowGap,
      thumbBackground: getComputedStyle(thumb).backgroundColor,
      topGap: indicatorRect.top - trackRect.top,
      trackColor: getComputedStyle(track).backgroundColor,
      trackInset: trackRect.left - surfaceRect.left,
      verticalGapSpread:
        Math.max(...verticalGaps) - Math.min(...verticalGaps),
    };
  });

  expect(geometry.dotCount).toBe(6);
  expect(geometry.gripOpacity).toBe("0");
  expect(geometry.fillEdgeGap).toBeCloseTo(8, 1);
  expect(geometry.columnGap).toBeCloseTo(geometry.rowGap, 1);
  expect(geometry.columnGap).toBeCloseTo(8, 1);
  expect(geometry.verticalGapSpread).toBeLessThanOrEqual(0.1);
  expect(geometry.thumbBackground).toBe("rgba(0, 0, 0, 0)");
  expect(geometry.topGap).toBe(0);
  expect(geometry.bottomGap).toBe(0);
  expect(geometry.trackInset).toBe(1);
  expect(lightness(geometry.indicatorColor)).toBeLessThan(
    lightness(geometry.trackColor),
  );

  await slider.locator(".slider-option__surface").hover();
  await expect
    .poll(() =>
      slider
        .locator(".slider-option__grip")
        .evaluate((element) => getComputedStyle(element).opacity),
    )
    .toBe("1");
});

test("maps Option A from 0% to 100% without endpoint gaps", async ({ page }) => {
  await page.goto("/lab/sliders");

  const specimen = page
    .locator('[data-slider-direction="A"] .slider-option')
    .first();
  const slider = specimen.getByRole("slider");

  await expect(slider).toHaveAttribute("aria-labelledby", /.+/);
  await expect(slider).toHaveAttribute("min", "0");
  await expect(slider).toHaveAttribute("max", "100");
  await slider.focus();

  await page.keyboard.press("Home");
  await expect(slider).toHaveAttribute("aria-valuenow", "0");
  const atMinimum = await specimen.evaluate((element) => {
    const track = element.querySelector<HTMLElement>(".slider-option__track");
    const indicator = element.querySelector<HTMLElement>(
      ".slider-option__indicator",
    );
    if (!track || !indicator) throw new Error("Option A track is incomplete");

    const trackRect = track.getBoundingClientRect();
    const indicatorRect = indicator.getBoundingClientRect();
    return {
      indicatorLeft: indicatorRect.left,
      indicatorWidth: indicatorRect.width,
      trackLeft: trackRect.left,
    };
  });

  expect(atMinimum.indicatorLeft).toBeCloseTo(atMinimum.trackLeft, 1);
  expect(atMinimum.indicatorWidth).toBeCloseTo(0, 1);

  await page.keyboard.press("End");
  await expect(slider).toHaveAttribute("aria-valuenow", "100");
  const atMaximum = await specimen.evaluate((element) => {
    const track = element.querySelector<HTMLElement>(".slider-option__track");
    const indicator = element.querySelector<HTMLElement>(
      ".slider-option__indicator",
    );
    if (!track || !indicator) throw new Error("Option A track is incomplete");

    const trackRect = track.getBoundingClientRect();
    const indicatorRect = indicator.getBoundingClientRect();
    return {
      indicatorLeft: indicatorRect.left,
      indicatorRight: indicatorRect.right,
      trackLeft: trackRect.left,
      trackRight: trackRect.right,
    };
  });

  expect(atMaximum.indicatorLeft).toBeCloseTo(atMaximum.trackLeft, 1);
  expect(atMaximum.indicatorRight).toBeCloseTo(atMaximum.trackRight, 1);
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
