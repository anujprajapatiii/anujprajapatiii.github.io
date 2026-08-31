import { expect, test, type Locator, type Page } from "@playwright/test";

const fixture = {
  path: "/style-guide#tabs",
  root: "[data-tabs-supported-specimen]",
  lineList: "Project views, line tabs",
  containedList: "Release views, contained tabs",
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

  await expect(specimen).toBeVisible();
  await expect(specimen.getByRole("tablist")).toHaveCount(2);

  // ARIA wiring is added when the visible React island hydrates. Waiting for
  // both roots keeps action tests deterministic without a fixed delay.
  await expect(tab(lineList(page), "Overview")).toHaveAttribute(
    "aria-controls",
    /.+/,
  );
  await expect(tab(containedList(page), "Summary")).toHaveAttribute(
    "aria-controls",
    /.+/,
  );

  return specimen;
}

function supportedCase(page: Page, variant: "line" | "contained") {
  return page
    .locator(fixture.root)
    .locator(`[data-tabs-specimen="${variant}"]`);
}

function lineList(page: Page) {
  return supportedCase(page, "line").getByRole("tablist", {
    name: fixture.lineList,
  });
}

function containedList(page: Page) {
  return supportedCase(page, "contained").getByRole("tablist", {
    name: fixture.containedList,
  });
}

function tab(list: Locator, name: string) {
  return list.getByRole("tab", { name, exact: true });
}

async function expectSelected(tabLocator: Locator, selected = true) {
  await expect(tabLocator).toHaveAttribute(
    "aria-selected",
    selected ? "true" : "false",
  );
}

async function expectOneSelectedPanel(root: Locator, list: Locator) {
  const tabs = list.getByRole("tab");
  const selected = list.locator('[role="tab"][aria-selected="true"]');

  expect(await tabs.count()).toBeGreaterThan(1);
  await expect(selected).toHaveCount(1);
  await expect(root.getByRole("tabpanel")).toHaveCount(1);

  for (let index = 0; index < (await tabs.count()); index += 1) {
    await expect(tabs.nth(index)).toHaveAttribute("id", /.+/);
  }

  await expect(selected).toHaveAttribute("aria-controls", /.+/);

  const connection = await selected.evaluate((element) => {
    const controls = element.getAttribute("aria-controls");
    const panel = controls ? document.getElementById(controls) : null;

    return {
      panelExists: panel?.getAttribute("role") === "tabpanel",
      panelHidden: panel?.hasAttribute("hidden") ?? true,
      labelledBy: panel?.getAttribute("aria-labelledby") ?? null,
      tabId: element.id,
    };
  });

  expect(connection.panelExists).toBe(true);
  expect(connection.panelHidden).toBe(false);
  expect(connection.labelledBy).toBe(connection.tabId);
}

async function expectNoPageOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
}

test.describe("Supported Tabs", () => {
  test("connects each tablist to one selected panel", async ({ page }) => {
    await openSpecimen(page);

    await expectOneSelectedPanel(supportedCase(page, "line"), lineList(page));
    await expectOneSelectedPanel(
      supportedCase(page, "contained"),
      containedList(page),
    );
  });

  test("keeps Line and Contained visual contracts distinct", async ({ page }) => {
    await openSpecimen(page);
    const line = lineList(page);
    const contained = containedList(page);

    await expect(line).toHaveAttribute("data-variant", "line");
    await expect(line).toHaveAttribute("data-layout", "content");
    await expect(line.locator('[data-slot="tabs-indicator"]')).toHaveCount(1);
    await expect(contained).toHaveAttribute("data-variant", "contained");
    await expect(contained).toHaveAttribute("data-layout", "content");
    await expect(
      contained.locator('[data-slot="tabs-indicator"]'),
    ).toHaveCount(0);

    for (const list of [line, contained]) {
      const radii = await list.evaluate((element) => [
        window.getComputedStyle(element).borderRadius,
        ...Array.from(element.querySelectorAll<HTMLElement>('[role="tab"]')).map(
          (trigger) => window.getComputedStyle(trigger).borderRadius,
        ),
      ]);
      expect(new Set(radii)).toEqual(new Set(["0px"]));
    }

    const rules = await Promise.all([
      line.evaluate((element) =>
        Number.parseFloat(window.getComputedStyle(element).borderBottomWidth),
      ),
      contained.evaluate((element) =>
        Number.parseFloat(window.getComputedStyle(element).borderBottomWidth),
      ),
    ]);
    expect(rules[0]).toBeGreaterThan(0);
    expect(rules[1]).toBe(0);

    const selectedShadow = await tab(contained, "Summary").evaluate(
      (element) => {
        const probe = document.createElement("span");
        probe.style.boxShadow = "var(--light-shade-raised)";
        document.body.append(probe);
        const expected = window.getComputedStyle(probe).boxShadow;
        probe.remove();

        return {
          actual: window.getComputedStyle(element).boxShadow,
          expected,
        };
      },
    );
    expect(selectedShadow.actual).not.toBe("none");
    expect(selectedShadow.actual).toBe(selectedShadow.expected);
  });

  test("Line tabs activate manually and disabled tabs never activate", async ({
    page,
  }) => {
    await openSpecimen(page);
    const list = lineList(page);
    const overview = tab(list, "Overview");
    const decisions = tab(list, "Decision log");
    const archive = tab(list, "Archive");

    await overview.focus();
    await page.keyboard.press("ArrowRight");
    await expect(decisions).toBeFocused();
    await expectSelected(overview);
    await expectSelected(decisions, false);

    await page.keyboard.press("Enter");
    await expectSelected(decisions);

    await expect(archive).toHaveAttribute("aria-disabled", "true");
    await archive.focus();
    await page.keyboard.press("Enter");
    await archive.click({ force: true });
    await expectSelected(decisions);
    await expectSelected(archive, false);
  });

  test("controlled Line tabs add, select, remove, and choose a safe fallback", async ({
    page,
  }) => {
    await openSpecimen(page);
    const lineCase = supportedCase(page, "line");
    const list = lineList(page);
    const add = lineCase.getByRole("button", { name: "Add tab" });
    const remove = lineCase.getByRole("button", { name: "Remove selected" });

    await expect(list.getByRole("tab")).toHaveCount(3);
    await add.click();
    await expect(list.getByRole("tab")).toHaveCount(4);
    await expectSelected(tab(list, "Research findings"));

    await remove.click();
    await expect(list.getByRole("tab")).toHaveCount(3);
    await expect(tab(list, "Research findings")).toHaveCount(0);
    await expectSelected(tab(list, "Decision log"));

    await remove.click();
    await expect(list.getByRole("tab")).toHaveCount(2);
    await expectSelected(tab(list, "Overview"));
    await expect(remove).toBeDisabled();
  });

  test("uncontrolled Contained tabs fall back when the current view is removed", async ({
    page,
  }) => {
    await openSpecimen(page);
    const containedCase = supportedCase(page, "contained");
    const list = containedList(page);
    const remove = containedCase.getByRole("button", {
      name: "Remove current view",
    });

    await expect(
      containedCase.locator('[data-tabs-state="uncontrolled-dynamic"]'),
    ).toHaveCount(1);
    await expect(list.getByRole("tab")).toHaveCount(12);
    await expectSelected(tab(list, "Summary"));

    await remove.click();
    await expect(list.getByRole("tab")).toHaveCount(11);
    await expect(tab(list, "Summary")).toHaveCount(0);
    await expectSelected(tab(list, "Interaction states"));
    await expect(
      containedCase.getByText(/Current: Interaction states$/),
    ).toBeVisible();
  });

  test("live direction changes preserve both selections", async ({ page }) => {
    const specimen = await openSpecimen(page);
    const lineRoot = supportedCase(page, "line").locator(
      "[data-tabs-direction]",
    );
    const containedRoot = supportedCase(page, "contained").locator(
      "[data-tabs-direction]",
    );
    const decisions = tab(lineList(page), "Decision log");
    const interactionStates = tab(containedList(page), "Interaction states");

    await decisions.click();
    await interactionStates.click();
    await specimen.getByRole("button", { name: "Use right-to-left" }).click();

    await expect(lineRoot).toHaveAttribute("dir", "rtl");
    await expect(lineRoot).toHaveAttribute("data-tabs-direction", "rtl");
    await expect(containedRoot).toHaveAttribute("dir", "rtl");
    await expect(containedRoot).toHaveAttribute("data-tabs-direction", "rtl");
    await expectSelected(decisions);
    await expectSelected(interactionStates);

    await specimen.getByRole("button", { name: "Use left-to-right" }).click();
    await expect(lineRoot).toHaveAttribute("data-tabs-direction", "ltr");
    await expect(containedRoot).toHaveAttribute("data-tabs-direction", "ltr");
    await expectSelected(decisions);
    await expectSelected(interactionStates);
  });

  test("long labels overflow locally at 320px without widening the page", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await openSpecimen(page);
    const list = containedList(page);
    const first = tab(list, "Summary");
    const last = tab(list, "Archived decisions");

    const overflow = await list.evaluate((element) => {
      const firstTab = element.querySelector<HTMLElement>('[role="tab"]');
      const styles = window.getComputedStyle(element);

      return {
        clientWidth: element.clientWidth,
        overflowX: styles.overflowX,
        scrollWidth: element.scrollWidth,
        whiteSpace: firstTab
          ? window.getComputedStyle(firstTab).whiteSpace
          : null,
      };
    });
    expect(overflow.scrollWidth).toBeGreaterThan(overflow.clientWidth);
    expect(["auto", "scroll"]).toContain(overflow.overflowX);
    expect(overflow.whiteSpace).toBe("nowrap");

    await first.focus();
    await page.keyboard.press("End");
    await expect(last).toBeFocused();
    await expect
      .poll(() => list.evaluate((element) => element.scrollLeft))
      .toBeGreaterThan(0);
    await expectNoPageOverflow(page);
  });
});
