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
  await page.locator(".thread-follow-cta").waitFor({state:"visible"});
  await page.waitForTimeout(1200);
  // Visitors should encounter the designer's introduction BEFORE either CTA.
  // The decorative photographed spool must not retain an invisible hit target.
  const hero = await page.evaluate(()=>{
    const rect = selector => document.querySelector(selector).getBoundingClientRect();
    const intro=rect(".hero-copy > .t-lead");
    const actions=rect(".hero-actions");
    const first=rect(".hero-actions .work-shortcut");
    const second=rect(".hero-actions .thread-follow-cta");
    return {
      introEnds: intro.bottom, actionsStart: actions.top,
      selectedX: first.left, selectedY: first.top,
      threadX: second.left, threadY: second.top,
      width: document.documentElement.scrollWidth-innerWidth,
      triggerCount: document.querySelectorAll(".spool-trigger").length,
    };
  });
  assert(hero.introEnds<=hero.actionsStart+2,
    label+": introduction should precede both actions "+JSON.stringify(hero));
  assert(hero.selectedY<=hero.threadY+2,
    label+": Selected Work should be the first action "+JSON.stringify(hero));
  assert(hero.triggerCount===0,
    label+": the spool should not have an invisible click target");
  assert(hero.width<3,label+": hero layout causes horizontal overflow");
  await page.screenshot({path:output+"/"+label+"-hero-actions.png"});
  await page.evaluate(()=>{
    const canvas=document.querySelector(".process-canvas");
    const spool=canvas.querySelector(".process-spool");
    const timing={cueAt:null,landedAt:null};
    const record=()=>{
      const now=performance.now();
      if(timing.cueAt===null && canvas.querySelector(".process-scroll-cue"))
        timing.cueAt=now;
      if(timing.landedAt===null && !spool.hasAttribute("hidden"))
        timing.landedAt=now;
    };
    const observer=new MutationObserver(record);
    observer.observe(canvas,{subtree:true,childList:true,attributes:true,attributeFilter:["hidden"]});
    window.__scrollCueTiming={timing,observer};
  });
  await page.locator(".thread-follow-cta").click();
  await page.waitForTimeout(reducedMotion==="reduce"?250:3800);
  if (reducedMotion==="reduce") {
    assert.equal(await page.locator(".process-scroll-cue").count(),0,
      "Reduced-motion visitors should not see an animated scroll instruction");
    assert(await page.locator("#design-process").count());
    await page.screenshot({path:output+"/"+label+"-reduced.png"});
    assert.equal(errors.length,0,errors.join("; "));
    await ctx.close();return;
  }
  // At the precise end of the cinematic landing, the next step must be
  // discoverable without guessing or scrolling.
  const cue=page.locator(".process-scroll-cue");
  await cue.waitFor({state:"visible",timeout:5000});
  const instruction=await cue.innerText();
  assert(instruction.includes(viewport.width<=640?"Swipe up to unravel":"Scroll to unravel"),
    label+": contextual cue should match device "+instruction);
  const cueTiming=await page.evaluate(()=>{
    const t=window.__scrollCueTiming;
    t?.observer.disconnect();
    return t?.timing;
  });
  assert(cueTiming && cueTiming.cueAt!==null && cueTiming.landedAt!==null,
    label+": no recorded cue/landing timing "+JSON.stringify(cueTiming));
  const instructionLag=cueTiming.cueAt-cueTiming.landedAt;
  console.log(label+" scroll cue vs landing (ms)",instructionLag.toFixed(0));
  assert(instructionLag<550,
    label+": scroll instruction must appear with landing, not seconds later "+instructionLag);
  const initialStep=await page.locator(".process-step-meter").getAttribute("aria-label");
  assert.equal(initialStep,"Design process, step 1 of 4",
    label+": stage meter should start at chapter one");
  // Let the restrained reveal finish so visual proof shows the legible
  // settled state, not a deliberately blurred entry frame.
  await page.waitForTimeout(700);
  const cueBox=await cue.boundingBox();
  const questionBox=await page.locator(".process-question").boundingBox();
  assert(cueBox && questionBox &&
    (cueBox.y>=questionBox.y+questionBox.height-4 || cueBox.x>questionBox.x+questionBox.width+6),
    label+": instruction must not cover the active process question");
  await page.screenshot({path:output+"/"+label+"-scroll-instruction.png"});

  // One meaningful scroll should move the cotton, advance the journey
  // counter, and retire the cue, including when visitors scroll backwards.
  const beforeScroll=await page.evaluate(()=>scrollY);
  await page.evaluate(()=>window.scrollBy({top:Math.max(180,innerHeight*.24),behavior:"instant"}));
  await page.waitForTimeout(350);
  await cue.waitFor({state:"hidden",timeout:2500});
  let nextStep=await page.locator(".process-step-meter").getAttribute("aria-label");
  // The initial tangle is deliberately long. One gesture should dismiss
  // the hint, but a full stage can take several normal scroll gestures.
  for (let attempt=0; attempt<5 && nextStep===initialStep; attempt++) {
    await page.evaluate(()=>window.scrollBy({top:150,behavior:"instant"}));
    await page.waitForTimeout(100);
    nextStep=await page.locator(".process-step-meter").getAttribute("aria-label");
  }
  assert.notEqual(nextStep,initialStep,label+": progress must advance with continued scrolling");
  await page.evaluate(y=>window.scrollTo({top:y,behavior:"instant"}),beforeScroll);
  await page.waitForTimeout(150);
  assert.equal(await cue.count(),0,label+": instruction should not return when scrolling up");

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

  // Capture every motion progress tick in-page. Screenshot compositing can
  // take over a second on the complex textured SVG, after the drop has ended.
  // Testing two screenshots alone would incorrectly report a frozen strand.
  await page.evaluate(()=>{
    const layer=document.querySelector(".project-thread");
    const samples=[Number(layer.dataset.gravityProgress||0)];
    const observer=new MutationObserver(()=>samples.push(Number(layer.dataset.gravityProgress||0)));
    observer.observe(layer,{attributes:true,attributeFilter:["data-gravity-progress"]});
    window.__cottonSamples={samples,observer};
  });
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
  const state=()=>page.locator(".project-thread").evaluate(node=>({
    progress:Number(node.dataset.gravityProgress),
    drop:Number(node.dataset.gravityDrop),
    handoff:node.dataset.handoff,
  }));
  const start=await state();
  const first=await page.screenshot({path:output+"/"+label+"-drop-start.png"});
  const firstCotton=await page.screenshot({clip});
  await page.waitForTimeout(1000);
  const end=await state();
  const second=await page.screenshot({path:output+"/"+label+"-drop-end.png"});
  const secondCotton=await page.screenshot({clip});
  const sampled=await page.evaluate(()=>{
    const recording=window.__cottonSamples;
    recording?.observer.disconnect();
    return recording?.samples||[];
  });
  const extent={min:Math.min(...sampled),max:Math.max(...sampled),frames:sampled.length};
  console.log(label+" cotton release", JSON.stringify({start,end,extent,changed:!firstCotton.equals(secondCotton)}));
  assert(extent.max-extent.min>.45 && extent.frames>5,
    label+": gravity release did not visibly advance "+JSON.stringify({start,end,extent}));

  await page.evaluate(y=>window.scrollTo({top:y,behavior:"instant"}),releaseScroll+170);
  await page.waitForTimeout(160);
  await page.screenshot({path:output+"/"+label+"-follow-work.png"});

  // All six cards—not only the featured pair and Stammer Halo—must be
  // physically caught by the cotton and then spring back to their original
  // silhouette. Drive normal scrolling through each stitched corner.
  const names=["creative-key","gravitad","stammer-halo",
    "smartmeal","interruption-study","ucd-campus"];
  const count=await page.locator(".project-thread").getAttribute("data-catch-count");
  assert.equal(count,String(names.length),label+": every project needs a thread catch");
  const grabs=[];
  for(const name of names) {
    const card=page.locator('#work article[data-cotton-corner="'+name+'"]');
    assert.equal(await card.count(),1,label+": missing project corner "+name);
    const anchorY=await card.evaluate(el=>el.getBoundingClientRect().top+scrollY);
    const startY=anchorY-viewport.height*.68;
    let maxLoad=0, strongestY=startY;
    for(let delta=-110;delta<=350;delta+=23) {
      const target=Math.max(0,startY+delta);
      await page.evaluate(y=>window.scrollTo({top:y,behavior:"instant"}),target);
      await page.waitForTimeout(27);
      const load=await card.evaluate(el=>parseFloat(el.style.getPropertyValue("--cotton-load")||"0"));
      if(load>maxLoad){maxLoad=load;strongestY=target}
    }
    await page.evaluate(y=>window.scrollTo({top:y,behavior:"instant"}),strongestY);
    await page.waitForTimeout(80);
    await page.screenshot({path:output+"/"+label+"-grab-"+name+".png"});
    grabs.push({name,maxLoad});
    assert(maxLoad>.25,label+": cotton never grips "+name+" "+JSON.stringify(grabs));
  }
  console.log(label+" cotton-card-grabs",JSON.stringify(grabs));
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
