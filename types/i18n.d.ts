// Ambient declaration for @nuxtjs/i18n auto-imports.
//
// The project's tsconfig.json excludes `.nuxt/`, so the type
// definitions Nuxt generates for auto-imports
// (.nuxt/imports.d.ts → defineI18nRoute, useLocalePath, etc.)
// don't reach `vue-tsc`. Re-declare just the symbols we actually
// call at compile-time so the type-check stage of `nuxt build`
// stops complaining without importing the module per-file.
//
// Adding new auto-imported i18n composables to this file is only
// needed when `vue-tsc` errors on them — the runtime auto-import
// pipeline doesn't depend on this file.

declare global {
  function defineI18nRoute(route: { locales?: false | string[] } | false): void
}

export {}
