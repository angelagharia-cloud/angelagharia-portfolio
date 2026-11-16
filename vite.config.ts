import { defineConfig } from 'vite'
import path from 'path'
import { existsSync } from 'node:fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function figmaAssetFallback() {
  const prefix = '\0figma-asset-fallback:'

  return {
    name: 'figma-asset-fallback',
    enforce: 'post' as const,
    resolveId(id: string, importer?: string) {
      if (id.startsWith('figma:asset/')) {
        return `${prefix}${id.slice('figma:asset/'.length)}`
      }

      if (
        importer &&
        id.includes('imports/') &&
        /\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(id)
      ) {
        const absolutePath = path.resolve(path.dirname(importer), id)
        if (!existsSync(absolutePath)) {
          return `${prefix}${path.basename(id)}`
        }
      }
    },
    load(id: string) {
      if (!id.startsWith(prefix)) return

      const assetName = id.slice(prefix.length)
      const label = assetName.slice(0, 8).toUpperCase()
      const placeholder = `
        <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop stop-color="#f4f4f5"/>
              <stop offset="1" stop-color="#e4e4e7"/>
            </linearGradient>
          </defs>
          <rect width="1600" height="1000" fill="url(#g)"/>
          <text x="800" y="500" text-anchor="middle" dominant-baseline="middle"
            font-family="Arial, sans-serif" font-size="34" fill="#71717a">
            Asset ${label}
          </text>
        </svg>
      `

      return `export default ${JSON.stringify(
        `data:image/svg+xml;charset=utf-8,${encodeURIComponent(placeholder)}`,
      )}`
    },
  }
}

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    figmaAssetFallback(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/app'),
    },
  },
})
