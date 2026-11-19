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

    // A proper unspooling test must move through the *sticky process*
    // scroll range, not merely wheel a few pixels from the hero. The reel
    // auto-scroll can arrive at different positions on tall and short screens.
    const samples = [];
    await page.locator('.landing-entry[data-settled="true"]').waitFor({ timeout: 15000 });
    const snapshot = () => page.evaluate(() => {
      const node = document.querySelector("#process-cotton path");
      const spool = document.querySelector(".process-spool");
      return {
        shape: node?.getAttribute("d") ?? "",
        untangle: Number(node?.dataset.untangleProgress ?? 0),
        x: parseFloat(spool?.style.left || "NaN"),
        y: parseFloat(spool?.style.top || "NaN"),
      };
    });
    for (let index = 1; index <= 47; index++) {
      const fraction = index / 50;
      await page.evaluate(p => {
        const track = document.querySelector(".process-track");
        const bounds = track.getBoundingClientRect();
        const documentTop = bounds.top + scrollY;
        const range = Math.max(1, bounds.height - innerHeight * .44);
        window.scrollTo({ top: documentTop - innerHeight * .28 + range * p, behavior: "auto" });
      }, fraction);
      await page.waitForTimeout(65);
      const state = await snapshot();
      if (state.untangle > .06 && state.untangle < .94) {
        if (!samples.some(sample => sample.shape === state.shape)) {
          samples.push(state);
          if (samples.length === 1) {
            await page.screenshot({ path: `${output}/${name}-unwinding-start.png`, animations: "disabled" });
          } else if (samples.length === 3) {
            await page.screenshot({ path: `${output}/${name}-unwinding-middle.png`, animations: "disabled" });
            break;
          }
        }
      }
    }
    assert(samples.length >= 3,
      `${name}: first chapter must show at least three distinct untangling shapes; saw ${samples.length}`);
    for (const point of samples) {
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
