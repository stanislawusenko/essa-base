import Alpine from 'alpinejs'
import { registerComponents } from './alpine-components'

import '@fontsource/manrope/400.css'
import '@fontsource/manrope/600.css'
import '@fontsource/manrope/700.css'
import '@fontsource/manrope/800.css'

// ESSA Base Style Architecture Layer Orchestration (Tailwind v4 Specification)
import '../styles/design-tokens.css' // 1. Global design tokens & theme configurations
import '../styles/core-components.css' // 2. Core element resets & system components
import '../styles/project-components.css' // 3. Custom layout components & custom vanilla CSS

// Note: wordpress.css is kept commented as a feature toggle for integration layers.
// import '../styles/wordpress.css'

/**
 * @file main.ts
 * @description Primary entry point for ESSA Base. Handles style orchestration and Alpine.js core initialization.
 * @version 1.0.0
 */

/* ==========================================================================
   CORE FRAMEWORK & REGISTRATION
   ========================================================================== */

registerComponents(Alpine)

window.Alpine = Alpine

/* ==========================================================================
   INITIALIZATION ALPINE
   ========================================================================== */

function startAlpine(): void {
  try {
    Alpine.start()

    if (import.meta.env?.DEV) {
      console.log(
        '%c✅ [ESSA Base]%c System initialized successfully',
        'color: #10b981; font-weight: bold;',
        'color: inherit;',
      )
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err)

    console.error(
      `%c❌ [ESSA Base]%c System Init Error: ${errorMessage}`,
      'color: #ef4444; font-weight: bold;',
      'color: inherit;',
      err,
    )
  }
}

document.addEventListener('DOMContentLoaded', startAlpine)

/* ==========================================================================
   GLOBAL TYPE DEFINITIONS
   ========================================================================== */

declare global {
  interface Window {
    Alpine: any
  }
}
