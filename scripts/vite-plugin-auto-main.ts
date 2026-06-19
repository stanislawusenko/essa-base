import type { Plugin } from 'vite'

/**
 * @file vite-plugin-auto-main.ts
 * @description Automatic main script injector plugin for ESSA Base (Tailwind ecosystem).
 * @version 1.0.0
 */

/* ==========================================================================
   INTERFACES & TYPES
   ========================================================================== */

interface PluginOptions {
  scriptPath?: string
}

/* ==========================================================================
   PLUGIN CORE
   ========================================================================== */

export default function autoMainPlugin(options: PluginOptions = {}): Plugin {
  const scriptPath = options.scriptPath ?? '/scripts/main.ts'

  return {
    name: 'vite-plugin-auto-main',
    enforce: 'pre',

    transformIndexHtml: {
      order: 'pre',
      handler(html: string) {
        const scriptPattern = new RegExp(`<script[^>]*src=["']${scriptPath}["']`, 'i')

        if (scriptPattern.test(html)) {
          return html
        }

        return {
          html,
          tags: [
            {
              tag: 'script',
              attrs: {
                type: 'module',
                src: scriptPath,
              },
              injectTo: 'body',
            },
          ],
        }
      },
    },
  }
}
