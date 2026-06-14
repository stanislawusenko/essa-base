/**
 * Alpine.js Component Registry
 * Centralized hub for registering reusable interactive components and plugins.
 */

import Alpine from 'alpinejs'

/**
 * Registers global Alpine.js components.
 * * @param {typeof Alpine} AlpineInstance - The Alpine.js instance to register components with.
 */
export function registerComponents(AlpineInstance: typeof Alpine): void {
  /* ------------------------------------------------------------------------
     COMPONENT: DROPDOWN
     ------------------------------------------------------------------------ */
  AlpineInstance.data('dropdown', () => ({
    open: false,

    toggle() {
      this.open = !this.open
    },
  }))

  /* ------------------------------------------------------------------------
     COMPONENT: MODAL (Template)
     ------------------------------------------------------------------------ */
  // AlpineInstance.data('modal', () => ({ ... }))
}
