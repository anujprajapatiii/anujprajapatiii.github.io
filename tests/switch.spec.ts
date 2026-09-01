import { expect, test, type Locator, type Page } from "@playwright/test";

const fixture = {
  path: "/style-guide#switch",
  root: "[data-switch-supported-specimen]",
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
  await expect(specimen.getByRole("switch")).toHaveCount(3);
  await expect(
    specimen.getByRole("switch", { name: "Share focus across devices" }),
  ).toHaveAttribute("aria-checked", "true");
  return specimen;
}

function namedSwitch(specimen: Locator, name: string) {
  return specimen.getByRole("switch", { name, exact: true });
}

async function geometry(control: Locator) {
  return control.evaluate((element) => {
    const thumb = element.querySelector<HTMLElement>("[data-slot='switch-thumb']");
    if (!thumb) throw new Error("Switch thumb is missing");

    const rootRect = element.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    const rootStyle = window.getComputedStyle(element);
    const thumbStyle = window.getComputedStyle(thumb);

    return {
      root: { width: rootRect.width, height: rootRect.height },
      thumb: { width: thumbRect.width, height: thumbRect.height },
      inset: {
        top: thumbRect.top - rootRect.top,
        right: rootRect.right - thumbRect.right,
        bottom: rootRect.bottom - thumbRect.bottom,
        left: thumbRect.left - rootRect.left,
      },
      rootRadius: rootStyle.borderRadius,
      rootBorder: rootStyle.borderWidth,
      thumbRadius: thumbStyle.borderRadius,
      thumbBorder: thumbStyle.borderWidth,
      rootBackground: rootStyle.backgroundColor,
      thumbBackground: thumbStyle.backgroundColor,
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

test.describe("Supported Switch", () => {
  test("exposes labelled checked, unchecked, and disabled states", async ({
    page,
  }) => {
    const specimen = await openSpecimen(page);
    const on = namedSwitch(specimen, "Share focus across devices");
    const off = namedSwitch(specimen, "Reduce preview motion");
    const disabled = namedSwitch(specimen, "Sync archived decisions");

    await expect(on).toHaveAttribute("aria-checked", "true");
    await expect(off).toHaveAttribute("aria-checked", "false");
    await expect(disabled).toBeDisabled();
    await expect(disabled).toHaveAttribute("aria-checked", "false");

    await off.click();
    await expect(off).toHaveAttribute("aria-checked", "true");
    await expect(specimen.getByText("On", { exact: true })).toHaveCount(2);

    await disabled.click({ force: true });
    await expect(disabled).toHaveAttribute("aria-checked", "false");
  });

  test("supports native keyboard activation", async ({ page }) => {
    const specimen = await openSpecimen(page);
    const control = namedSwitch(specimen, "Reduce preview motion");

    await control.focus();
    await expect(control).toBeFocused();
    await page.keyboard.press("Space");
    await expect(control).toHaveAttribute("aria-checked", "true");
    await page.keyboard.press("Space");
    await expect(control).toHaveAttribute("aria-checked", "false");
  });

  test("keeps the selected square geometry and equal resting insets", async ({
    page,
  }) => {
    const specimen = await openSpecimen(page);
    const checked = namedSwitch(specimen, "Share focus across devices");
    const unchecked = namedSwitch(specimen, "Reduce preview motion");
    const checkedGeometry = await geometry(checked);
    const uncheckedGeometry = await geometry(unchecked);

    for (const result of [checkedGeometry, uncheckedGeometry]) {
      expect(result.root).toEqual({ width: 42, height: 20 });
      expect(result.thumb).toEqual({ width: 22, height: 16 });
      expect(result.inset.top).toBeCloseTo(2, 1);
      expect(result.inset.bottom).toBeCloseTo(2, 1);
      expect(result.rootRadius).toBe("0px");
      expect(result.rootBorder).toBe("0px");
      expect(result.thumbRadius).toBe("0px");
      expect(result.thumbBorder).toBe("0px");
      expect(result.rootBackground).not.toBe(result.thumbBackground);
    }

    expect(checkedGeometry.inset.right).toBeCloseTo(2, 1);
    expect(uncheckedGeometry.inset.left).toBeCloseTo(2, 1);

    await page.evaluate(() => {
      document.documentElement.dir = "rtl";
    });
    await expect
      .poll(async () => (await geometry(checked)).inset.left)
      .toBeCloseTo(2, 1);
    await expect
      .poll(async () => (await geometry(unchecked)).inset.right)
      .toBeCloseTo(2, 1);
  });

  test("stays clear across themes, reduced motion, and 320px layouts", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 320, height: 800 });
    const specimen = await openSpecimen(page);
    const controls = specimen.getByRole("switch");

    for (const dark of [false, true]) {
      await page.evaluate((nextDark) => {
        document.documentElement.classList.toggle("dark", nextDark);
      }, dark);

      for (let index = 0; index < (await controls.count()); index += 1) {
        const control = controls.nth(index);
        const colors = await geometry(control);
        expect(colors.rootBackground).not.toBe(colors.thumbBackground);
        await expect(control).toBeVisible();
      }
    }

    const durations = await controls.first().evaluate((element) => {
      const thumb = element.querySelector<HTMLElement>("[data-slot='switch-thumb']");
      return {
        root: window.getComputedStyle(element).transitionDuration,
        thumb: thumb ? window.getComputedStyle(thumb).transitionDuration : null,
      };
    });
    expect(durations).toEqual({ root: "0s", thumb: "0s" });
    await expectNoPageOverflow(page);
  });
});
