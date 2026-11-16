# GitHub Pages deployment for Angel Agharia's portfolio

The GitHub repository includes the original Figma Make React/Vite code. The published Figma portfolio remains separate.

## Current blocker: missing original visual assets

The Figma Make sync included the site components and case-study copy, but omitted the image library and six self-hosted font files. The manifest at `src/imports/opt/manifest.json` references **83 WebP files** expected inside `src/imports/opt/`, with names in the form `<name>-<width>.webp`.

The font styles at `src/styles/fonts.css` expect **six WOFF2 files** in `src/assets/fonts/`.

The workflow checks those files before building. It stops rather than publishing a portfolio with empty project visuals. To run the check locally:

```sh
node scripts/check-portfolio-assets.mjs
```

Restore the *original* visuals, not placeholder replacements, keeping the requested paths and filenames.

## Deploy after restoring assets

The workflow in `.github/workflows/deploy-portfolio.yml` is configured with Node 22, pnpm 10 and Vite. In the repository, go to **Settings → Pages**, select **GitHub Actions** as the build and deployment source. Once all missing assets have been uploaded, trigger the workflow or push to main.

The intended staging URL is:
https://angelagharia-cloud.github.io/angelagharia-portfolio/

The workflow copies `deploy/github-index.html` over the Figma-specific build HTML *only during the build*. The Figma source remains unchanged.

## Custom domain

Only after the preview has been visually and functionally verified, configure `angelaghariadesign.com` in GitHub Pages and point its DNS records at GitHub Pages according to GitHub's instructions. The build's Vite base must change from `/angelagharia-portfolio/` to `/` for the root domain, before it is activated. Keep the existing Figma site online throughout.

## Launch acceptance checklist

- Homepage renders with real portrait, avatar and all featured project covers
- All six case studies open and display the original project illustrations
- Back navigation, direct hash links and smooth scrolling work
- Desktop/mobile responsiveness and reduced-motion behaviour work
- Contact links, metadata, web fonts, accessibility and HTTPS are verified
