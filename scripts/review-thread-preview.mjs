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
    const release = await page.locator(".process-track").evaluate(el =>
      scrollY + el.getBoundingClientRect().bottom - innerHeight * .72)
    async function pose(label) {
      const result = await page.evaluate(() => {
        const spool = document.querySelector(".process-spool")
        const mark = document.querySelector(".process-exit").getBoundingClientRect()
        const box = spool.getBoundingClientRect()
        const mask = document.querySelector("#catch-line-creative-key path")
        return { visible: !spool.hidden && getComputedStyle(spool).visibility === "visible",
          offset: Math.hypot(box.left + box.width / 2 - mark.left, box.top + box.height / 2 - mark.top),
          paid: parseFloat(mask.getAttribute("stroke-dasharray")) }
      })
      assert(result.visible && result.offset < 3, JSON.stringify(result))
      await page.screenshot({path:output + "/" + name + "-handoff-" + label + ".png"})
      return result.paid
    }
    const scroll = delta => page.evaluate(y => window.scrollTo({top:y, behavior:"instant"}), release + delta)
    await scroll(-2)
    await page.waitForTimeout(350)
    const held = await pose("held")
    await scroll(4)
    await page.waitForTimeout(220)
    const falling = await pose("falling")
    await page.waitForTimeout(1000)
    const settled = await pose("settled")
    assert(settled > falling && falling > held, JSON.stringify({held, falling, settled}))
    await scroll(150)
    await page.waitForTimeout(100)
    assert(await pose("continuation") > settled)
    await scroll(-1)
    await page.waitForTimeout(450)
    assert(await pose("reverse") < .001)
    await page.locator("#work").scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    // Verify this is the same *physical* strand: the Selected Work
    // continuation must begin at the responsive end of Clarity & focus,
    // including the track's final sticky-release offset.
    await page.waitForFunction(() => Boolean(
      document.querySelector('#catch-line-creative-key path[d]')
    ), undefined, { timeout: 6000 });
    const seam = await page.evaluate(() => {
      const svg = document.querySelector('.project-thread');
      const exit = document.querySelector('.process-exit');
      const canvas = document.querySelector('.process-canvas');
      const track = document.querySelector('.process-track');
      const first = document.querySelector('#catch-line-creative-key path[d]');
      const start = first.getAttribute('d').trim().match(/^M\s*([-\d.]+)\s+([-\d.]+)/);
      const output = svg.getBoundingClientRect();
      const mark = exit.getBoundingClientRect();
      const box = canvas.getBoundingClientRect();
      const trackBox = track.getBoundingClientRect();
      return {
        startX: Number(start?.[1]),
        startY: Number(start?.[2]),
        exitX: mark.left - output.left,
        exitY: mark.top + trackBox.bottom - box.bottom - output.top,
      };
    });
    assert(Math.abs(seam.startX - seam.exitX) < 1.25 &&
      Math.abs(seam.startY - seam.exitY) < 1.25,
      `${name}: new work thread does not join process exit: ${JSON.stringify(seam)}`);
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
  console.log("PASS: hero, process-to-work cotton seam, three project links, mobile layout, and reduced-motion flow");
} finally {
  await browser.close();
}
