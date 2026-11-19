import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";

const base = process.env.PREVIEW_URL || "http://127.0.0.1:4173/#/";
const output = process.env.REVIEW_DIR || "thread-review";
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
const report = [];

async function inspect(name, viewport, reducedMotion = "no-preference") {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    reducedMotion,
    recordVideo: reducedMotion === "no-preference" ? { dir: output, size: viewport } : undefined,
  });
  const page = await context.newPage();
  const pageErrors = [];
  const failedImages = [];
  page.on("pageerror", err => pageErrors.push(err.message));
  page.on("response", response => {
    if (response.status() >= 400 && /\.(webp|png|jpe?g|mp4)(\?|$)/i.test(response.url()))
      failedImages.push({ status: response.status(), url: response.url() });
  });
  await page.goto(base, { waitUntil: "domcontentloaded", timeout: 45_000 });
  await page.locator(".spool-trigger").waitFor({ state: "visible", timeout: 20_000 });
  await page.locator("#design-process .landing-entry").waitFor({ state: "attached" });
  // Let the typographic intro and font measurements settle before judging layout.
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `${output}/${name}-initial.png`, fullPage: true, animations: "disabled" });

  const geometry = await page.evaluate(() => {
    const canvas = document.querySelector(".process-canvas").getBoundingClientRect();
    const marker = document.querySelector(".landing-entry").getBoundingClientRect();
    return {
      canvasX: canvas.left, canvasWidth: canvas.width, markerX: marker.left,
      landingFraction: (marker.left - canvas.left) / canvas.width,
      count: document.querySelectorAll(".process-word").length,
      cards: [...document.querySelectorAll("#work article[data-cotton-corner]")].map(el => el.getAttribute("data-cotton-corner")),
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    };
  });
  assert.equal(geometry.count, 4, "Four process stages should exist");
  assert(geometry.landingFraction >= .03 && geometry.landingFraction <= .19,
    `Landing should be in Step 1, got ${geometry.landingFraction}`);
  assert.deepEqual(geometry.cards.sort(), ["creative-key", "gravitad", "stammer-halo"]);
  assert(geometry.documentWidth <= geometry.viewportWidth + 2,
    `Horizontal overflow: document ${geometry.documentWidth}px versus viewport ${geometry.viewportWidth}px`);

  if (reducedMotion === "reduce") {
    await page.locator(".spool-trigger").click();
    await page.waitForTimeout(200);
    await page.screenshot({ path: `${output}/${name}-reduced.png`, fullPage: true });
    assert(await page.locator("#design-process").count(), "Process remains accessible with reduced motion");
  } else {
    await page.locator(".spool-trigger").click();
    await page.waitForTimeout(850);
    await page.screenshot({ path: `${output}/${name}-spool-release.png`, fullPage: true });
    await page.screenshot({ path: `${output}/${name}-release-viewport.png` });
    if (viewport.width < 640) {
      const collision = await page.evaluate(() => {
        const title = document.querySelector(".hero-copy h1").getBoundingClientRect();
        const button = document.querySelector(".work-shortcut").getBoundingClientRect();
        const overlapX = Math.max(0, Math.min(title.right, button.right) - Math.max(title.left, button.left));
        const overlapY = Math.max(0, Math.min(title.bottom, button.bottom) - Math.max(title.top, button.top));
        return overlapX * overlapY;
      });
      assert(collision < 40, `Mobile title/button collision during reel flight: ${collision}px²`);
    }
    await page.waitForTimeout(3500);
    await page.screenshot({ path: `${output}/${name}-step-one-arrival.png`, fullPage: true });
    await page.screenshot({ path: `${output}/${name}-arrival-viewport.png` });

    // The actual cotton geometry must CHANGE while the first chapter
    // loosens. Merely revealing an immutable squiggle is not sufficient.
    const snapshot = () => page.evaluate(() => {
      const shape = document.querySelector("#process-cotton path")?.getAttribute("d") ?? "";
      const spool = document.querySelector(".process-spool");
      const x = parseFloat(spool?.style.left || "NaN");
      const y = parseFloat(spool?.style.top || "NaN");
      return { shape, x, y };
    });
    const knotBefore = await snapshot();
    await page.evaluate(() => window.scrollBy({ top: 28, behavior: "instant" }));
    await page.waitForTimeout(150);
    const knotFirst = await snapshot();
    await page.screenshot({ path: `${output}/${name}-unwinding-start.png`, animations: "disabled" });
    await page.evaluate(() => window.scrollBy({ top: 44, behavior: "instant" }));
    await page.waitForTimeout(150);
    const knotSecond = await snapshot();
    await page.screenshot({ path: `${output}/${name}-unwinding-middle.png`, animations: "disabled" });
    assert.notEqual(knotBefore.shape, knotFirst.shape,
      `${name}: cotton knot must deform on scroll, not just reveal`);
    assert.notEqual(knotFirst.shape, knotSecond.shape,
      `${name}: knots must continue to loosen through Step 1`);
    for (const point of [knotFirst, knotSecond]) {
      assert(Number.isFinite(point.x) && Number.isFinite(point.y),
        `${name}: spool lost its physical position while unwinding`);
    }
    await page.locator("#work").scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${output}/${name}-projects.png`, fullPage: true });
    await page.screenshot({ path: `${output}/${name}-projects-viewport.png` });
  }
  await context.close();
  assert.equal(pageErrors.length, 0, `${name}: browser errors: ${pageErrors.join(" | ")}`);
  assert.equal(failedImages.length, 0, `${name}: failed images: ${JSON.stringify(failedImages)}`);
  report.push({ name, geometry, pageErrors, failedImages });
}

try {
  await inspect("desktop", { width: 1440, height: 900 });
  await inspect("mobile", { width: 390, height: 844 });
  await inspect("reduced-motion", { width: 1024, height: 768 }, "reduce");
  await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
  console.log("PASS: hero, true scroll-driven knot morph, process entrance, project links, mobile layout, and reduced-motion flow");
} finally {
  await browser.close();
}
