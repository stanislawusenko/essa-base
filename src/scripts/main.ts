import Alpine from 'alpinejs'
import { registerComponents } from './alpine-components'

import '@fontsource/inter/400.css'
import '@fontsource/inter/700.css'
import '../styles/base.css'
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
      console.log('ESSA Base: System initialized successfully')
    }
  } catch (err: unknown) {
    console.error('ESSA Base: Failed to start Alpine.js', err)
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
