import fs from 'node:fs'
import path from 'node:path'
import { Plugin } from 'vite'

/* ==========================================================================
   INTERFACES & TYPES
   ========================================================================== */

/**
 * Configuration options for the menu generation process.
 */
interface PluginOptions {
  srcDir?: string
  ignoredDirs?: string[]
}

/**
 * Representation of a file or directory node for the navigation tree.
 */
interface TreeNode {
  name: string
  type: 'file' | 'dir'
  path?: string
  children?: TreeNode[]
}

/* ==========================================================================
   PLUGIN CORE
   ========================================================================== */

/**
 * Vite plugin to automatically generate `dev-menu.html`.
 * Scans the source directory recursively and creates a navigation tree
 * for easier access to pages during development.
 */
export default function generateMenuPlugin(options: PluginOptions = {}): Plugin {
  const srcDir = options.srcDir || path.resolve(process.cwd(), 'src')
  const devOutFile = path.resolve(srcDir, 'dev-menu.html')
  const ignoredDirs = options.ignoredDirs || ['css', 'js', 'partials', 'assets', '.vite']

  /* ==========================================================================
     FILE SYSTEM UTILITIES
     ========================================================================== */

  /**
   * Formats a modification timestamp into a YYYY-MM-DD HH:MM string.
   */
  const formatDate = (mtime: Date | number): string => {
    return new Date(mtime).toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0, 16)
  }

  /**
   * Recursively traverses the directory to build a structural profile of HTML files.
   * @param dir - Current directory path.
   * @param relativePath - Path relative to the source root.
   * @returns An array of TreeNode objects.
   */
  const getHtmlFiles = (dir: string, relativePath: string = ''): TreeNode[] => {
    const results: TreeNode[] = []
    if (!fs.existsSync(dir)) return results

    fs.readdirSync(dir, { withFileTypes: true }).forEach((item) => {
      // Ignore hidden files and the menu file itself
      if (item.name.startsWith('.') || item.name === 'dev-menu.html') return

      const fullPath = path.join(dir, item.name)
      const rel = path.join(relativePath, item.name).split(path.sep).join('/')

      if (item.isDirectory()) {
        if (!ignoredDirs.includes(item.name)) {
          const children = getHtmlFiles(fullPath, rel)
          if (children.length) {
            results.push({ name: item.name, type: 'dir', children })
          }
        }
      } else if (item.isFile() && item.name.endsWith('.html')) {
        results.push({ name: item.name, type: 'file', path: rel })
      }
    })
    return results
  }

  /* ==========================================================================
     HTML RENDERING LOGIC
     ========================================================================== */

  /**
   * Generates structural HTML markup for the file tree using recursion.
   * Sorts items to ensure 'index.html' appears at the top.
   * @param items - List of nodes to render.
   */
  const renderTree = (items: TreeNode[]): string => {
    // Sort items: 'index.html' takes precedence, then alphabetical order
    const sortedItems = [...items].sort((a, b) => {
      if (a.name === 'index.html') return -1
      if (b.name === 'index.html') return 1
      return a.name.localeCompare(b.name)
    })

    let html = '<ul>'

    sortedItems.forEach((item) => {
      if (item.type === 'file' && item.path) {
        const stats = fs.statSync(path.join(srcDir, item.path))
        const date = formatDate(stats.mtime)
        const isIndex = item.name === 'index.html'

        html += `
        <li style="display: flex; align-items: center; gap: 8px;">
          <span style="opacity: 0.6;">${isIndex ? '🏠' : '📄'}</span>
          <a href="/${item.path}" target="_blank" rel="noopener noreferrer"
             style="color:#2563eb; text-decoration:none; font-weight:${isIndex ? 'bold' : '500'}; font-size: 15px;">
             ${item.name}
          </a>
          <code style="color:#94a3b8; font-size:0.75rem; margin-left:auto; background:#f1f5f9; padding: 2px 6px; border-radius: 4px;">${date}</code>
        </li>`
      } else if (item.type === 'dir' && item.children) {
        html += `
        <li>
          <div style="display: flex; align-items: center; gap: 8px; color:#475569; margin-top: 16px;">
            <span>📁</span>
            <span style="font-weight:bold; text-transform:uppercase; font-size:0.8rem; letter-spacing: 0.05em;">${item.name}</span>
          </div>
          ${renderTree(item.children)}
        </li>`
      }
    })
    html += '</ul>'
    return html
  }

  /**
   * Generates the complete HTML document wrapper for the dev-menu.
   */
  const generateHtml = (tree: TreeNode[]): string => {
    const currentYear = new Date().getFullYear()
    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Project Pages Menu</title>
        <style>
          body { font-family: sans-serif; padding: 40px 20px; background: #f1f5f9; color: #1e293b; margin: 0; }
          .card { max-width: 850px; margin: 0 auto; background: white; padding: 40px; border-radius: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
          h1 { font-size: 1.875rem; margin: 0 0 24px 0; border-bottom: 2px solid #f1f5f9; padding-bottom: 16px; }
          ul { list-style:none; padding-left: 24px; margin: 20px 0; border-left: 1px dashed #cbd5e1; }
          li { margin-bottom: 12px; }
          .footer { margin-top: 30px; text-align: center; font-size: 0.8rem; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>📋 Project Page List</h1>
          ${tree.length > 0 ? renderTree(tree) : '<p>No HTML files found...</p>'}
        </div>
        <div class="footer">
          ESSA Base &copy; ${currentYear} | Distributed under MIT License<br>
          <a href="#">Documentation</a>
        </div>
      </body>
    </html>`
  }

  /**
   * Orchestrates directory scanning and atomic write operation.
   */
  const generateMenu = (outPath: string) => {
    try {
      const dir = path.dirname(outPath)
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

      const tree = getHtmlFiles(srcDir)
      const htmlContent = generateHtml(tree)
      fs.writeFileSync(outPath, htmlContent)
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(`[MenuPlugin] Compilation failed: ${err.message}`)
      } else {
        console.error('[MenuPlugin] Compilation failed: An unknown error occurred')
      }
    }
  }

  /* ==========================================================================
     VITE LIFECYCLE HOOKS
     ========================================================================== */

  return {
    name: 'vite-plugin-generate-dev-menu',

    buildStart() {
      generateMenu(devOutFile)
    },

    configureServer(server) {
      server.watcher.on('all', (event, file) => {
        if (file.endsWith('.html') && !file.includes('partials')) {
          generateMenu(devOutFile)
        }
      })
    },

    closeBundle() {
      const distDir = path.resolve(process.cwd(), 'dist')
      if (fs.existsSync(distDir)) {
        generateMenu(path.join(distDir, 'dev-menu.html'))
      }
    },
  }
}
