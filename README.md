# ESSA Base
![Version: 1.0.0](https://img.shields.io/badge/version-1.0.0-blue.svg)

**Professional Multi-Page HTML Starter Template** built with Vite v6, Tailwind CSS v4, Alpine.js and Handlebars.

This template provides a clean, professional foundation for rapid multi-page development with a focus on code quality, performance, and modularity.

---

## Features

- **Vite v6:** Ultra-fast development server with Hot Module Replacement (HMR).
- **MPA Architecture:** Auto-discovery of HTML pages in src/.
- **Handlebars Integration:** Modular development using `{{> filename }}` syntax.
- **Tailwind CSS v4:** Next-gen CSS-first engine with built-in typography and container queries.
- **Design Tokens:** Centralized theme configuration via @theme in base.css for consistent design system management.
- **Alpine.js:** Lightweight reactivity for mobile menus, modals, and tabs.
- **Fonts:** Pre-configured via `@fontsource` for optimal loading.
- **Auto-generated Menu:** `dev-menu.html` stays updated with all your HTML pages automatically.
- **Auto Image Optimization:** Built-in automatic conversion of images to WebP and AVIF formats during production build using `vite-plugin-image-optimizer`.
- **WordPress Ready:** Includes wordpress.css for seamless integration with CMS admin bars and core styles (easily toggled in main.ts).
- **Professional Tooling**: Pre-configured ESLint (Flat Config), Prettier, and EditorConfig.

---

## Getting Started

1. **Clone the repository:**

```bash
   git clone https://github.com/stanislawusenko/essa-base.git
   cd essa-base
```

2. **Install dependencies:** Choose your preferred package manager:

```bash
   # Using Bun (recommended)
   bun install

   # OR using NPM
   npm install
```

3. **Start development server:**

```bash
   # Using Bun
   bun dev

   # OR using NPM
   npm run dev
```

4. **Build for production:**

```bash
   # Using Bun
   bun run build

   # OR using NPM
   npm run build
```

---

## Development Workflow

This project is configured for high code quality and consistency using **Husky** to enforce standards automatically.

- **Code Formatting:** Powered by **Prettier**. Files are automatically formatted before every commit.
- **Linting:** Powered by **ESLint (Flat Config)**. Ensures logical correctness and adherence to best practices.
- **Git Hooks:** Managed by **Husky**. The `pre-commit` hook automatically runs:
  `bun run format && bun run lint`

  _If any errors are detected, the commit will be blocked, ensuring that only "clean" code enters your repository._

---

## Asset Optimization

The template includes automatic image optimization to ensure the best possible performance for your website.

- **Automatic Conversion:** During the `build` process, all images in `src/assets/img/` are automatically processed and converted to **WebP** and **AVIF** formats.
- **Efficient Delivery:** To take full advantage of this, use the `<picture>` tag in your HTML:

```html
<picture>
  <source srcset="/assets/img/photo.avif" type="image/avif">
  <source srcset="/assets/img/photo.webp" type="image/webp">
  <img src="/assets/img/photo.jpg" alt="Description" loading="lazy">
</picture>
```

---

## Manual Commands

You can run these commands manually to verify your code or preview your build. Choose the tool you prefer:

| Action | Bun | Node.js (npm) |
| :--- | :--- | :--- |
| **Format** | `bun run format` | `npm run format` |
| **Lint** | `bun run lint` | `npm run lint` |
| **Build** | `bun run build` | `npm run build` |
| **Preview** | `bun run preview` | `npm run preview` |

---

## Project Structure

```
src/
├── img/                      # Assets (images, icons, etc.)
│
├── partials/
│   ├── header.html           # Reusable header component
│   └── footer.html           # Reusable footer component
│
├── public/                   # Static files (favicons, robots.txt, etc.)
│
├── scripts/
│   ├── alpine-components.ts  # Alpine.js core component declarations and module definitions
│   └── main.ts               # Main JavaScript entry point
│
├── styles/
│   ├── base.css              # Tailwind CSS core setup & theme configuration
│   └── wordpress.css         # WordPress-specific styles (admin bar, integrations)
│
├── types/                    # TypeScript global definitions
│   └── alpine.d.ts           # Alpine.js global type declarations
│
├── design-system-demo.html   # Design system documentation (excluded from build)
├── dev-menu.html             # Auto-generated project index for dev & client demos
├── index.html                # Main demo / homepage
│
dist/                         # Production build output (optimized & minified)
```
