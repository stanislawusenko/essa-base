/**
 * Main application entry point.
 * Orchestrates global style injection, third-party libraries, and core lifecycle initialization.
 */

/* ==========================================================================
   STYLE ARCHITECTURE
   ========================================================================== */

// Preloading critical font assets to ensure layout stability.
import '@fontsource/inter/400.css'
import '@fontsource/inter/700.css'

// Base styles
import '../styles/base.css'
// Note: wordpress.css is kept commented as a feature toggle for integration layers.
// import '../styles/wordpress.css'

/* ==========================================================================
   CORE FRAMEWORK & REGISTRATION
   ========================================================================== */

import Alpine from 'alpinejs'
import { registerComponents } from './alpine-components'

/**
 * Component registration.
 * Modular components must be registered with the Alpine instance
 * before the reactive engine is started.
 */
registerComponents(Alpine)

/**
 * Global exposure.
 * Attaches Alpine to the window object for browser-level accessibility.
 */
window.Alpine = Alpine

/* ==========================================================================
   INITIALIZATION ENGINE
   ========================================================================== */

function startAlpine(): void {
  try {
    Alpine.start()

    if (import.meta.env?.DEV) {
      console.log('ESSA Base: System initialized successfully')
    }
  } catch (err: unknown) {
    console.error('ESSA Base: Failed to start Alpine.js', err)
  }
}

// Lifecycle: Bind execution to the DOMContentLoaded event.
document.addEventListener('DOMContentLoaded', startAlpine)

/* ==========================================================================
   GLOBAL TYPE DEFINITIONS
   ========================================================================== */

declare global {
  interface Window {
    Alpine: any
  }
}
