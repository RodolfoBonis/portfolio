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
  // Matches @nuxtjs/i18n v9: pass `false` to opt-out the page from
  // localised route generation. The object form takes `paths` for
  // custom slugs per locale + `locales` (array of codes) to scope
  // generation. `locales: false` is invalid and the module silently
  // ignores the call — typing it that way previously masked a real
  // bug where blog pages weren't actually opted out.
  function defineI18nRoute(
    route: { locales?: string[]; paths?: Record<string, string> } | false,
  ): void
}

export {}
