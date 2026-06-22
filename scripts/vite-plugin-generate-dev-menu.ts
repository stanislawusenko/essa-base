import fs from 'node:fs'
import path from 'node:path'
import type { Plugin, ViteDevServer } from 'vite'

/**
 * @file vite-plugin-generate-dev-menu.ts
 * @description Automatically generates a clean, light-themed navigation page for ESSA Base HTML templates.
 * @version 1.1.0
 */

/* ==========================================================================
   INTERFACES & TYPES
   ========================================================================== */

interface MenuNode {
  name: string
  type: 'file' | 'dir'
  path?: string
  children?: MenuNode[]
}

interface MenuOptions {
  srcDir?: string
  ignoredDirs?: string[]
}

/* ==========================================================================
   PLUGIN CORE
   ========================================================================== */

export default function generateMenuPlugin(options: MenuOptions = {}): Plugin {
  const srcDir = options.srcDir || path.resolve(process.cwd(), 'src')
  const devOutFile = path.resolve(srcDir, 'dev-menu.html')
  const ignoredDirs = options.ignoredDirs || [
    'css',
    'js',
    'partials',
    'assets',
    '.vite',
    'node_modules',
    'dist',
  ]

  let debounceTimer: NodeJS.Timeout

  /* ==========================================================================
     FILE SYSTEM UTILITIES
     ========================================================================== */

  const formatDate = (mtime: Date): string => mtime.toISOString().replace('T', ' ').slice(0, 16)

  const getHtmlFiles = (dir: string, relativePath = ''): MenuNode[] => {
    const results: MenuNode[] = []
    if (!fs.existsSync(dir)) return results

    const items = fs.readdirSync(dir, { withFileTypes: true })

    // Custom sorting: Directories first, then files (with index.html hardcoded to the top)
    items.sort((a, b) => {
      if (a.isDirectory() !== b.isDirectory()) {
        return a.isDirectory() ? -1 : 1
      }
      if (a.isFile() && b.isFile()) {
        if (a.name === 'index.html') return -1
        if (b.name === 'index.html') return 1
      }
      return a.name.localeCompare(b.name)
    })

    for (const item of items) {
      if (item.name.startsWith('.') || item.name === 'dev-menu.html') continue

      const fullPath = path.join(dir, item.name)
      const rel = path.join(relativePath, item.name).replace(/\\/g, '/')

      if (item.isDirectory() && !ignoredDirs.includes(item.name)) {
        const children = getHtmlFiles(fullPath, rel)
        if (children.length) results.push({ name: item.name, type: 'dir', children })
      } else if (item.isFile() && path.extname(item.name) === '.html') {
        results.push({ name: item.name, type: 'file', path: rel })
      }
    }
    return results
  }

  /* ==========================================================================
     HTML RENDERING LOGIC
     ========================================================================== */

  const renderTree = (items: MenuNode[]): string => {
    return (
      '<ul style="list-style: none; padding-left: 24px; margin: 20px 0; border-left: 1px dashed #cbd5e1;">' +
      items.map((item) => (item.type === 'file' ? renderFile(item) : renderDir(item))).join('') +
      '</ul>'
    )
  }

  const renderFile = (item: MenuNode): string => {
    const stats = fs.statSync(path.join(srcDir, item.path!))
    const isIndex = item.name === 'index.html'
    return `<li style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
      <span style="opacity: 0.6;">${isIndex ? '🏠' : '📄'}</span>
      <a href="/${item.path}" target="_blank" rel="noopener noreferrer"
         style="color: #2563eb; text-decoration: none; font-weight: ${isIndex ? '700' : '500'}; font-size: 15px;">
         ${item.name}
      </a>
      <code style="color: #94a3b8; font-size: 0.75rem; margin-left: auto; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${formatDate(stats.mtime)}</code>
    </li>`
  }

  const renderDir = (item: MenuNode): string => `
    <li>
      <div style="display: flex; align-items: center; gap: 8px; color: #475569; margin-top: 16px;">
        <span>📁</span>
        <span style="font-weight: bold; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.05em;">${item.name}</span>
      </div>
      ${renderTree(item.children!)}
    </li>`

  const generateHtml = (tree: MenuNode[]): string => {
    const currentYear = new Date().getFullYear()
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Pages Menu</title>
    <style>
      body { font-family: system-ui, -apple-system, sans-serif; padding: 40px 20px; background: #f1f5f9; color: #1e293b; margin: 0; }
      .card { max-width: 850px; margin: 0 auto; background: white; padding: 40px; border-radius: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
      h1 { font-size: 1.875rem; margin: 0 0 24px 0; border-bottom: 2px solid #f1f5f9; padding-bottom: 16px; font-weight: 700; }
      .footer { margin-top: 30px; text-align: center; font-size: 0.8rem; color: #64748b; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>📋 Project Page List</h1>
      <main>
        ${tree.length > 0 ? renderTree(tree) : '<p style="color: #64748b; font-size: 14px;">No HTML files found...</p>'}
      </main>
    </div>
    <div class="footer">
      ESSA Base &copy; ${currentYear} | Distributed under MIT License
    </div>
  </body>
</html>`
  }

  const generateMenu = (outPath: string) => {
    try {
      const html = generateHtml(getHtmlFiles(srcDir))
      fs.writeFileSync(outPath, html)

      console.log(`\x1b[32m✅ [ESSA Base] Dev-menu synchronized: ${path.basename(outPath)}\x1b[0m`)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(`\x1b[31m❌ [ESSA Base] Dev-menu Sync Error: ${err.message}\x1b[0m`)
    }
  }

  /* ==========================================================================
     VITE LIFECYCLE HOOKS
     ========================================================================== */

  return {
    name: 'vite-plugin-generate-dev-menu',
    buildStart: () => generateMenu(devOutFile),

    configureServer(server: ViteDevServer) {
      server.watcher.on('all', (_event, file) => {
        if (
          path.extname(file) === '.html' &&
          !file.includes('dev-menu.html') &&
          !file.includes('partials')
        ) {
          clearTimeout(debounceTimer)
          debounceTimer = setTimeout(() => generateMenu(devOutFile), 300)
        }
      })
    },

    closeBundle: () => {
      const distDir = path.resolve(process.cwd(), 'dist')
      if (fs.existsSync(distDir)) generateMenu(path.join(distDir, 'dev-menu.html'))
    },
  }
}
