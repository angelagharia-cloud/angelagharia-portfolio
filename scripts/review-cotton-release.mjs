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
  const seam = await page.evaluate(()=>{
    const svg=document.querySelector(".project-thread"), box=svg.getBoundingClientRect();
    const path=document.querySelector("#catch-line-creative-key path[d]");
    const arr=path.getAttribute("d").match(/^M\s*([-\d.]+)\s+([-\d.]+)/);
    const exit=document.querySelector(".process-exit").getBoundingClientRect();
    const track=document.querySelector(".process-track").getBoundingClientRect();
    const canvas=document.querySelector(".process-canvas").getBoundingClientRect();
    return {dx:Math.abs(Number(arr[1])-(exit.left-box.left)),
      dy:Math.abs(Number(arr[2])-(exit.top+track.bottom-canvas.bottom-box.top))};
  });
  assert(seam.dx<2 && seam.dy<2,label+": cotton from process must meet work path "+JSON.stringify(seam));

  await page.evaluate(y=>window.scrollTo({top:y,behavior:"instant"}),releaseScroll+2);
  await page.waitForTimeout(150);
  const first=await page.locator("#catch-line-creative-key path").evaluate(node=>
    ({stroke:node.getAttribute("style"),dash:getComputedStyle(node).strokeDashoffset}));
  await page.screenshot({path:output+"/"+label+"-drop-start.png"});
  await page.waitForTimeout(1000);
  const second=await page.locator("#catch-line-creative-key path").evaluate(node=>
    ({stroke:node.getAttribute("style"),dash:getComputedStyle(node).strokeDashoffset}));
  await page.screenshot({path:output+"/"+label+"-drop-end.png"});
  assert.notDeepEqual(first,second,label+": cotton must keep falling after scroll stops");

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
