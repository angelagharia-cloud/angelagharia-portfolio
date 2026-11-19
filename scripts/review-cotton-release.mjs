import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";

const output = "release-review";
await mkdir(output, { recursive:true });
const browser = await chromium.launch({headless:true, args:["--no-sandbox"]});
const checks = [];

async function review(label, viewport, reducedMotion="no-preference") {
  const ctx = await browser.newContext({viewport, deviceScaleFactor:1, reducedMotion});
  const page = await ctx.newPage();
  const errors=[];
  page.on("pageerror", e=>errors.push(e.message));
  await page.goto("http://127.0.0.1:4173/#/", {waitUntil:"domcontentloaded"});
  await page.locator(".spool-trigger").waitFor({state:"visible"});
  await page.waitForTimeout(1200);
  await page.locator(".spool-trigger").click();
  await page.waitForTimeout(reducedMotion==="reduce"?250:3800);
  if (reducedMotion==="reduce") {
    assert(await page.locator("#design-process").count());
    await page.screenshot({path:output+"/"+label+"-reduced.png"});
    assert.equal(errors.length,0,errors.join("; "));
    await ctx.close();return;
  }
  const releaseScroll = await page.locator(".process-track").evaluate(node =>
    window.scrollY+node.getBoundingClientRect().bottom-window.innerHeight*.72);
  await page.evaluate(y=>window.scrollTo({top:y,behavior:"instant"}),releaseScroll-8);
  await page.waitForTimeout(150);
  // Read the actual visible continuous yarn. The per-card #catch-line mask is
  // intentionally hidden, starts at the card, and is NOT the Clarity source.
  await page.screenshot({path:output+"/"+label+"-pre-handoff.png"});
  const seam = await page.evaluate(()=>{
    const svg=document.querySelector(".project-thread"), box=svg.getBoundingClientRect();
    const path=document.querySelector(".continuous-cotton-fibre > path[d]");
    const arr=path?.getAttribute("d")?.match(/^M\s*([-\d.]+)\s+([-\d.]+)/);
    const exit=document.querySelector(".process-exit").getBoundingClientRect();
    const track=document.querySelector(".process-track").getBoundingClientRect();
    const canvas=document.querySelector(".process-canvas").getBoundingClientRect();
    return {dx:arr?Math.abs(Number(arr[1])-(exit.left-box.left)):Infinity,
      dy:arr?Math.abs(Number(arr[2])-(exit.top+track.bottom-canvas.bottom-box.top)):Infinity,
      source:arr?.slice(1), exit:{x:exit.left-box.left,
        y:exit.top+track.bottom-canvas.bottom-box.top}};
  });
  assert(seam.dx<5 && seam.dy<5,label+": cotton from process must meet work path "+JSON.stringify(seam));

  await page.evaluate(y=>window.scrollTo({top:y,behavior:"instant"}),releaseScroll+2);
  await page.waitForTimeout(150);
  // Motion's SVG pathLength can render without an inline stroke-dash style.
  // Verify the actual on-screen yarn pays out by comparing the rendered pixels
  // around the spool at one fixed scroll position.
  const origin=await page.locator(".process-exit").boundingBox();
  const cropX=Math.max(0,Math.min(viewport.width-100,origin.x-25));
  const cropY=Math.max(0,Math.min(viewport.height-145,origin.y-20));
  const clip={x:cropX,y:cropY,width:Math.min(100,viewport.width-cropX),
    height:Math.min(145,viewport.height-cropY)};
  const first=await page.screenshot({path:output+"/"+label+"-drop-start.png"});
  const firstCotton=await page.screenshot({clip});
  await page.waitForTimeout(1000);
  const second=await page.screenshot({path:output+"/"+label+"-drop-end.png"});
  const secondCotton=await page.screenshot({clip});
  assert(!firstCotton.equals(secondCotton),
    label+": the cotton beside Clarity must visibly grow while scroll is stationary");

  await page.evaluate(y=>window.scrollTo({top:y,behavior:"instant"}),releaseScroll+170);
  await page.waitForTimeout(160);
  await page.screenshot({path:output+"/"+label+"-follow-work.png"});
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  assert(overflow<3,label+": horizontal overflow");
  assert.equal(errors.length,0,errors.join("; "));
  checks.push({label,seam,first,second,overflow});
  await ctx.close();
}
try{
  await review("desktop",{width:1440,height:900});
  await review("mobile",{width:390,height:844});
  await review("reduced",{width:1024,height:768},"reduce");
  await writeFile(output+"/report.json",JSON.stringify(checks,null,2));
  console.log("PASS: original Clarity strand continues and pays out under gravity into Selected Work");
}finally{await browser.close();}
