import { Plugin } from 'vite'

interface PluginOptions {
  scriptPath?: string
}

/**
 * Vite plugin to automatically inject the main entry script into HTML files.
 * This ensures consistency across all pages in the Multi-Page Application.
 */
export default function autoMainPlugin(options: PluginOptions = {}): Plugin {
  const scriptPath = options.scriptPath ?? '/src/scripts/main.ts'

  return {
    name: 'vite-plugin-auto-main',
    enforce: 'pre',

    transformIndexHtml: {
      order: 'pre',
      handler(html: string) {
        // Prevent duplicate script injection
        if (html.includes(scriptPath) || html.includes('main.ts')) {
          return html
        }

        // Inject script module before the closing body tag
        const scriptTag = `\n    <script type="module" src="${scriptPath}"></script>\n`
        return html.replace(/<\/body>/i, `${scriptTag}</body>`)
      },
    },
  }
}
