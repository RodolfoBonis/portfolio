import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  // Note: `target: 'static'` is a Nuxt 2 leftover and is ignored by
  // Nuxt 4 — the actual deploy target is the Nitro preset, which the
  // Dockerfile already runs as `node .output/server/index.mjs`.
  // Removed so the actual mode (Node server) is unambiguous.

  typescript: {
    typeCheck: true,
    tsConfig: {
      compilerOptions: {
        moduleResolution: 'bundler',
      },
    },
  },

  runtimeConfig: {
    // Server-only — never sent to the client. Both env vars come from
    // the Helm chart (values-{stg,prod}.yaml -> Vault).
    blogApiUrl:
      process.env.BLOG_API_URL ||
      'https://api.management.rodolfodebonis.com.br',
    blogTenantId: process.env.BLOG_TENANT_ID || '',
    public: {
      cdnApiKey: process.env.CDN_API_KEY,
      // Cloudflare Turnstile site key — public by design; the
      // server-side validation against the secret happens upstream
      // in rb_management_api.
      turnstileSiteKey:
        process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY ||
        '0x4AAAAAADMxSiVZ-Z2SNWwG',
    },
  },

  css: [
    '@/assets/css/colors.css',
    '@/assets/css/main.css',
    'material-design-icons-iconfont/dist/material-design-icons.css',
  ],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['vue'],
    },
    build: {
      assetsInlineLimit: 0,
      // Pin core deps to dedicated vendor chunks so they stay
      // cacheable across releases — when the app code changes the
      // browser keeps the cached vue/i18n/markdown bundles instead
      // of re-downloading them. Each chunk gets its own content
      // hash, paired with the `immutable` Cache-Control on
      // /_nuxt/** added in PR1.
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-vue': ['vue', 'vue-router'],
            'vendor-i18n': ['vue-i18n', '@intlify/core-base'],
            'vendor-md': ['markdown-it'],
          },
        },
      },
    },
    define: {
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
    },
  },

  components: true,

  modules: ['@nuxtjs/color-mode', '@vueuse/nuxt', '@nuxtjs/google-fonts', '@nuxtjs/turnstile', '@nuxtjs/i18n', '@nuxt/image'],

  // @nuxt/image: AVIF first (smallest), WebP fallback, original as
  // last resort. screens line up with the Tailwind breakpoints we
  // already use elsewhere so the generated srcset matches the layout
  // grid without ad-hoc tuning. Remote rb-cdn host is whitelisted so
  // the ipx provider can fetch + transform covers/avatar.
  image: {
    format: ['avif', 'webp'],
    quality: 80,
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    domains: ['rodolfodebonis.com.br', 'rb-cdn.rodolfodebonis.com.br'],
  },

  // Bilingual portfolio. PT-BR keeps every existing URL (root, no
  // prefix); EN gets a /en mirror via prefix_except_default.
  // Browser detection only kicks in on the first hit at /; visitors
  // who land on a deep link (shared blog post, tag page, an /en/...
  // bookmark) are served the URL they asked for, then the cookie
  // pins the choice. The 4 blog page files opt out via
  // defineI18nRoute({ locales: false }) — the existing /blog and
  // /en/blog routes are preserved exactly so indexed slugs don't
  // 301 or 404.
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'pt-BR',
    locales: [
      { code: 'pt-BR', language: 'pt-BR', file: 'pt-BR.json', name: 'Português' },
      { code: 'en', language: 'en', file: 'en.json', name: 'English' },
    ],
    langDir: 'locales/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      fallbackLocale: 'pt-BR',
    },
    baseUrl: 'https://rodolfodebonis.com.br',
    bundle: {
      optimizeTranslationDirective: false,
    },
  },

  turnstile: {
    siteKey:
      process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY ||
      '0x4AAAAAADMxSiVZ-Z2SNWwG',
  },

  colorMode: {
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark',
    storageKey: 'nuxt-color-mode',
    globalName: '__NUXT_COLOR_MODE__',
    classPrefix: '',
    dataValue: 'dark',
  },

  googleFonts: {
    families: {
      'General Sans': [300, 400, 500, 600, 700],
      'JetBrains Mono': [400, 500, 700],
    },
    display: 'swap',
  },

  app: {
    head: {
      title: 'Rodolfo De Bonis — Software Engineer',
      // <html lang> now managed by @nuxtjs/i18n via useLocaleHead.
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Engenheiro de Software com 8+ anos de experiência em Go, Flutter, Kubernetes e DevOps.',
        },
        { name: 'theme-color', content: '#09090b' },
        { property: 'og:title', content: 'Rodolfo De Bonis — Software Engineer' },
        { property: 'og:description', content: 'Engenheiro de Software | DevOps | Mobile | D&D Master' },
        { property: 'og:image', content: 'https://rodolfodebonis.com.br/api/cdn/portfolio/me.jpeg' },
        { property: 'og:url', content: 'https://rodolfodebonis.com.br' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
        // Speed up first-paint: the Google Fonts CSS is fetched
        // immediately and the two weights actually used above the
        // fold (500 + 700 for headings + body) are warmed before
        // discovery via the @import chain. Saves 380–440ms of font
        // delay per Lighthouse.
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
      ],
      script: [
        // GTM loaded as a deferred external script (not inline)
        // so the back/forward cache is restored on revisits — the
        // inline IIFE blocked it. async still keeps it off the
        // critical path; events queued via dataLayer keep working
        // because we still seed it below.
        {
          innerHTML: 'window.dataLayer=window.dataLayer||[];',
        },
        {
          src: 'https://www.googletagmanager.com/gtm.js?id=GTM-PKXGMS9W',
          async: true,
          defer: true,
          tagPosition: 'bodyClose',
        },
      ],
      noscript: [
        {
          innerHTML: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PKXGMS9W" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          tagPosition: 'bodyOpen',
        },
      ],
    },
  },

  build: {},
  devServerHandlers: [],

  server: {
    host: '0.0.0.0',
  },

  compatibilityDate: '2025-01-30',
  devtools: { enabled: true },

  // SWR (stale-while-revalidate) for the blog routes: the HTML is
  // pre-rendered at build/first-hit, served instantly on subsequent
  // requests, and revalidated in the background after the TTL. The
  // home page rebuilds every 10 min so a freshly-published post shows
  // up in the "Últimas postagens" section without a manual rebuild.
  routeRules: {
    '/**': { ssr: true },
    // Versioned, content-hashed assets — safe to cache forever.
    // `immutable` tells the browser to skip the conditional GET on
    // navigations, the single biggest perceived speedup on repeat
    // visits. Lighthouse "Use efficient cache lifetimes" used to
    // flag ~1.8 MiB savings here.
    '/_nuxt/**': {
      headers: { 'cache-control': 'public, max-age=31536000, immutable' },
    },
    '/icons/**': {
      headers: { 'cache-control': 'public, max-age=31536000, immutable' },
    },
    '/favicon.ico': {
      headers: { 'cache-control': 'public, max-age=604800' },
    },
    '/apple-touch-icon.png': {
      headers: { 'cache-control': 'public, max-age=604800' },
    },

    '/': { swr: 600 },                        // 10 min — refresh latest posts
    '/en': { swr: 600 },                      // EN home mirror
    '/blog': { swr: 300 },                    // 5 min — list page
    '/blog/**': { swr: 600 },                 // 10 min — article detail
    '/en/blog': { swr: 300 },
    '/en/blog/**': { swr: 600 },

    // The proxy under /api/blog should never be cached (it forwards
    // tenant-scoped headers and we want every revalidation to hit a
    // fresh upstream response).
    '/api/blog/**': { cache: false },
  },
})
