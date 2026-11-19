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
    await page.waitForTimeout(3500);
    await page.screenshot({ path: `${output}/${name}-step-one-arrival.png`, fullPage: true });
    await page.locator("#work").scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${output}/${name}-projects.png`, fullPage: true });
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
  console.log("PASS: hero, process entrance, three project links, mobile layout, and reduced-motion flow");
} finally {
  await browser.close();
}
