// @ts-check
const { test, expect } = require("@playwright/test");
const path = require("path");

const FILE_URL = "file://" + path.resolve(__dirname, "..", "index.html").replace(/\\/g, "/");

/** Collect uncaught page exceptions — the real signal that something broke. */
function watchErrors(page) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e.message || e)));
  return errors;
}

test("full walkthrough — welcome → all built modules → all built waves, no runtime errors", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto(FILE_URL);

  // Welcome screen
  await expect(page.locator("#welcome-screen")).toBeVisible();
  await page.evaluate(() => { window.DEV_AUTOREVEAL = true; });
  await page.getByRole("button", { name: /Start Module 1/i }).click();
  await expect(page.locator("#academy-screen")).toBeVisible();

  // Walk the whole Academy: dev.solveStep advances one stage per call and, on a
  // practice step, picks the correct answer. Loop until the Job screen appears.
  let reachedJob = false;
  for (let i = 0; i < 300; i++) {
    if (await page.locator("#job-screen").isVisible()) { reachedJob = true; break; }
    await page.evaluate(() => window.Academy.dev.solveStep());
  }
  expect(reachedJob, "Academy should graduate into the Job").toBe(true);

  // Walk all 5 waves: auto-reveal selects the answer in boot(); clicking the
  // primary confirms (win) then advances to the next file. Stop at slice-note.
  let finished = false;
  for (let i = 0; i < 80; i++) {
    if (await page.locator("#slice-note").isVisible()) { finished = true; break; }
    await page.locator("#primary").click();
  }
  expect(finished, "All built waves should clear to the slice-complete note").toBe(true);

  expect(errors, "no uncaught runtime errors during the full walkthrough").toEqual([]);
});

test("orientation backbone — the ask + the directive are always visible (Academy)", async ({ page }) => {
  watchErrors(page);
  await page.goto(FILE_URL);
  await page.getByRole("button", { name: /Start Module 1/i }).click();
  // Intro stage: both the ask and the directive should be present + visible.
  await expect(page.locator("#a-brief-ask")).toBeVisible();
  await expect(page.locator("#a-brief-task")).toBeVisible();
  await expect(page.locator("#a-brief-ask")).toContainText(/the ask/i);

  // Advance to the Study (teach) step — still no-click, but a real directive shows.
  await page.locator("#a-primary").click();
  await expect(page.locator("#a-brief-task")).toContainText(/Got it/i);
  // The renamed step label should read "Study", never "Watch".
  await expect(page.locator("#a-stepper")).toContainText("Study");
  await expect(page.locator("#a-stepper")).not.toContainText("Watch");
});

test("select_option renders clickable choices over a Tableau viz mockup (M1)", async ({ page }) => {
  watchErrors(page);
  await page.goto(FILE_URL);
  await page.getByRole("button", { name: /Start Module 1/i }).click();
  // M1 "The canvas" is the default first lesson, a select_option judgment module.
  // intro -> study -> first practice rep
  await page.locator("#a-primary").click(); // intro -> study
  await page.locator("#a-primary").click(); // study -> practice
  // The viz mockup renders as the read-only reference above the choices.
  await expect(page.locator(".viz")).toBeVisible();
  await expect(page.locator(".option-card")).toHaveCount(4);
  // Picking an option should enable Confirm.
  await page.locator(".option-card").first().click();
  await expect(page.locator("#a-primary")).toBeEnabled();
});

test("every listed onboarding module is authored & playable — no locked gaps", async ({ page }) => {
  watchErrors(page);
  await page.goto(FILE_URL);
  const data = await page.evaluate(() => ({
    planLen: ACADEMY_PLAN.length,
    builtCount: ACADEMY_PLAN.filter((d) => d.built).length,
    lessonsLen: LESSONS.length,
    // Every plan entry marked built must have a matching authored lesson by day.
    missing: ACADEMY_PLAN.filter((d) => d.built && !LESSONS.some((l) => l.day === d.day))
      .map((d) => d.day),
    // Every authored lesson must have the practice reps the player walks through.
    badShape: LESSONS.filter((l) =>
      !l.concept || !l.ask || !l.mentor_intro || !l.teach || !Array.isArray(l.practice) || l.practice.length === 0
    ).map((l) => l.id)
  }));
  expect(data.planLen, "syllabus should list all 10 modules").toBe(10);
  expect(data.builtCount, "all 10 listed modules should be marked built").toBe(10);
  expect(data.lessonsLen, "all 10 modules should be authored in LESSONS").toBe(10);
  expect(data.missing, "no built module should be missing its lesson (locked gap)").toEqual([]);
  expect(data.badShape, "every lesson should have ask/intro/teach/practice").toEqual([]);
});

test("modules chain M1 → … → M10 → Job via each outro's Next link", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto(FILE_URL);
  await page.evaluate(() => { window.DEV_AUTOREVEAL = true; });
  await page.getByRole("button", { name: /Start Module 1/i }).click();

  // Walk the natural chain: solveStep follows each outro's link to the next
  // module (or graduates at the end). Record which module number we're on each
  // time we're in the Academy, so we can prove all 10 are reached, in order.
  const seen = [];
  let reachedJob = false;
  for (let i = 0; i < 400; i++) {
    if (await page.locator("#job-screen").isVisible()) { reachedJob = true; break; }
    const title = await page.locator("#a-brief-title").textContent();
    const m = title && title.match(/Module\s+(\d+)/i);
    if (m) {
      const n = Number(m[1]);
      if (seen[seen.length - 1] !== n) seen.push(n);
    }
    await page.evaluate(() => window.Academy.dev.solveStep());
  }

  expect(reachedJob, "the chain should graduate into the Job after the last module").toBe(true);
  // Every module 1..10 should have been visited, and in ascending order.
  expect(seen, "each module should link to the next, 1 through 10").toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  expect(errors, "no runtime errors while chaining through all modules").toEqual([]);
});
