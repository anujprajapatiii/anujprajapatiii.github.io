import { expect, test, type Locator, type Page } from "@playwright/test";

const fixture = {
  path: "/style-guide#slider",
  root: "[data-slider-supported-specimen]",
} as const;

const consoleProblems = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page }) => {
  const problems: string[] = [];
  consoleProblems.set(page, problems);

  page.on("console", (message) => {
    if (message.type() === "error") {
      problems.push(`console.error: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => {
    problems.push(`pageerror: ${error.message}`);
  });
});

test.afterEach(async ({ page }) => {
  expect.soft(consoleProblems.get(page) ?? [], "browser console errors").toEqual(
    [],
  );
});

async function openSpecimen(page: Page) {
  await page.goto(fixture.path);
  const specimen = page.locator(fixture.root);
  await specimen.scrollIntoViewIfNeeded();
  await expect(specimen).toBeVisible();
  await expect(specimen.getByRole("slider")).toHaveCount(3);
  return specimen;
}

function namedSlider(specimen: Locator, name: string) {
  return specimen.getByRole("slider", { name, exact: true });
}

async function geometry(root: Locator) {
  return root.evaluate((element) => {
    const surface = element.querySelector<HTMLElement>(
      "[data-slot='slider-surface']",
    );
    const track = element.querySelector<HTMLElement>(".ui-slider__track");
    const indicator = element.querySelector<HTMLElement>(
      ".ui-slider__indicator",
    );
    const thumb = element.querySelector<HTMLElement>(".ui-slider__thumb");
    if (!surface || !track || !indicator || !thumb) {
      throw new Error("Slider anatomy is incomplete");
    }

    const surfaceRect = surface.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();
    const indicatorRect = indicator.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    const surfaceStyle = window.getComputedStyle(surface);
    const thumbStyle = window.getComputedStyle(thumb);

    return {
      surface: {
        height: surfaceRect.height,
        border: surfaceStyle.borderWidth,
        radius: surfaceStyle.borderRadius,
      },
      thumb: {
        width: thumbRect.width,
        height: thumbRect.height,
        border: thumbStyle.borderWidth,
        radius: thumbStyle.borderRadius,
      },
      spill: {
        top: surfaceRect.top - thumbRect.top,
        bottom: thumbRect.bottom - surfaceRect.bottom,
      },
      colors: {
        indicator: window.getComputedStyle(indicator).backgroundColor,
        track: window.getComputedStyle(track).backgroundColor,
        thumb: thumbStyle.backgroundColor,
      },
      track: {
        left: trackRect.left,
        right: trackRect.right,
      },
      indicator: {
        left: indicatorRect.left,
        right: indicatorRect.right,
        width: indicatorRect.width,
      },
    };
  });
}

async function expectNoPageOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
}

test.describe("Supported Slider", () => {
  test("exposes labelled controlled, uncontrolled, and disabled values", async ({
    page,
  }) => {
    const specimen = await openSpecimen(page);
    const preview = namedSlider(specimen, "Preview scale");
    const motion = namedSlider(specimen, "Motion strength");
    const published = namedSlider(specimen, "Published preview");

    await expect(preview).toHaveAttribute("aria-valuenow", "80");
    await expect(motion).toHaveAttribute("aria-valuenow", "32.5");
    await expect(published).toBeDisabled();
    await expect(published).toHaveAttribute("aria-valuenow", "100");

    await preview.focus();
    await page.keyboard.press("ArrowRight");
    await expect(preview).toHaveAttribute("aria-valuenow", "80.1");
    await expect(
      specimen.locator(".ui-slider__value").filter({ hasText: "80%" }),
    ).toHaveCount(1);

    await page.keyboard.press("Shift+ArrowRight");
    await expect(preview).toHaveAttribute("aria-valuenow", "81.1");
    await expect(
      specimen.locator(".ui-slider__value").filter({ hasText: "81%" }),
    ).toHaveCount(1);
  });

  test("keeps the selected geometry and maps the complete range", async ({
    page,
  }) => {
    const specimen = await openSpecimen(page);
    const preview = namedSlider(specimen, "Preview scale");
    const root = preview.locator("xpath=ancestor::*[@data-slot='slider']");
    const initial = await geometry(root);

    expect(initial.surface).toEqual({
      height: 44,
      border: "1px",
      radius: "0px",
    });
    expect(initial.thumb).toEqual({
      width: 8,
      height: 48,
      border: "0px",
      radius: "0px",
    });
    expect(initial.spill.top).toBeCloseTo(2, 1);
    expect(initial.spill.bottom).toBeCloseTo(2, 1);
    expect(initial.colors.indicator).not.toBe(initial.colors.track);
    expect(initial.colors.thumb).not.toBe(initial.colors.indicator);

    await preview.focus();
    await page.keyboard.press("Home");
    const minimum = await geometry(root);
    expect(minimum.indicator.left).toBeCloseTo(minimum.track.left, 1);
    expect(minimum.indicator.width).toBeCloseTo(0, 1);

    await page.keyboard.press("End");
    const maximum = await geometry(root);
    expect(maximum.indicator.left).toBeCloseTo(maximum.track.left, 1);
    expect(maximum.indicator.right).toBeCloseTo(maximum.track.right, 1);
  });

  test("settles track presses, drags directly, and preserves the theme shortcut", async ({
    page,
  }) => {
    const specimen = await openSpecimen(page);
    const preview = namedSlider(specimen, "Preview scale");
    const root = preview.locator("xpath=ancestor::*[@data-slot='slider']");
    const control = root.locator(".ui-slider__control");
    const controlBox = await control.boundingBox();
    if (!controlBox) throw new Error("Slider control is not visible");

    await control.click({
      position: { x: controlBox.width * 0.75, y: controlBox.height / 2 },
    });
    await expect(root).toHaveAttribute("data-position-animation", "settle");

    const thumb = root.locator(".ui-slider__thumb");
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
    await expect(root).not.toHaveAttribute("data-position-animation", "settle");

    const startedDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    );
    await preview.focus();
    await page.keyboard.press("l");
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.classList.contains("dark")),
      )
      .toBe(!startedDark);
    await expect(preview).toBeFocused();
  });

  test("stays distinct across themes, reduced motion, and narrow layouts", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 320, height: 900 });
    const specimen = await openSpecimen(page);
    const roots = specimen.locator("[data-slot='slider']");

    for (const dark of [false, true]) {
      await page.evaluate((nextDark) => {
        document.documentElement.classList.toggle("dark", nextDark);
      }, dark);

      for (let index = 0; index < 2; index += 1) {
        const result = await geometry(roots.nth(index));
        expect(result.colors.indicator).not.toBe(result.colors.track);
        await expect(roots.nth(index)).toBeVisible();
      }
      await expect(roots.nth(2)).toBeVisible();
    }

    const durations = await roots.first().evaluate((element) => {
      const indicator = element.querySelector<HTMLElement>(
        ".ui-slider__indicator",
      );
      const thumb = element.querySelector<HTMLElement>(".ui-slider__thumb");
      return {
        indicator: indicator
          ? window.getComputedStyle(indicator).transitionDuration
          : null,
        thumb: thumb ? window.getComputedStyle(thumb).transitionDuration : null,
      };
    });
    expect(durations).toEqual({ indicator: "0s", thumb: "0s" });
    await expectNoPageOverflow(page);
  });
});
