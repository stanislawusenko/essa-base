/**
 * Alpine.js shims
 * Declaration file to prevent TypeScript from searching for missing types
 * in node_modules, effectively suppressing the 'implicitly has an any type' error.
 */
declare module 'alpinejs' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Alpine: any
  export default Alpine
}
