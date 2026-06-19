import Alpine from 'alpinejs'

/**
 * @file alpine-components.ts
 * @description Centralized hub for registering reusable interactive Alpine.js components.
 * @version 1.0.0
 */

export function registerComponents(AlpineInstance: typeof Alpine): void {
  // Component: Dropdown
  AlpineInstance.data('dropdown', () => ({
    open: false,

    toggle() {
      this.open = !this.open
    },
  }))
}
