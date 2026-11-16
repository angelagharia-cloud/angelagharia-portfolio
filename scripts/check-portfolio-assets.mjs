import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const manifest = JSON.parse(readFileSync(path.join(root, "src/imports/opt/manifest.json"), "utf8"));
const images = Object.entries(manifest).flatMap(([name, sizes]) =>
  sizes.map(([width]) => path.join("src", "imports", "opt", name + "-" + width + ".webp"))
);
const fonts = [
  "dm-serif-display-latin.woff2",
  "dm-serif-display-latin-ext.woff2",
  "dm-serif-display-italic-latin.woff2",
  "dm-serif-display-italic-latin-ext.woff2",
  "inter-var-latin.woff2",
  "inter-var-latin-ext.woff2",
].map((name) => path.join("src", "assets", "fonts", name));
const missing = [...images, ...fonts].filter((name) => !existsSync(path.join(root, name)));
console.log("Checking " + images.length + " project images and " + fonts.length + " font files.");
if (missing.length) {
  console.error("Deployment blocked: " + missing.length + " original assets are absent from the Figma Make GitHub sync.");
  for (const file of missing.slice(0, 30)) console.error("  - " + file);
  if (missing.length > 30) console.error("  ... and " + (missing.length - 30) + " more");
  console.error("Restore the original project images and fonts; do not publish a broken portfolio.");
  process.exit(1);
}
console.log("Portfolio asset check passed.");
