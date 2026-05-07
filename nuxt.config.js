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
    },
    define: {
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
    },
  },

  components: true,

  modules: ['@nuxtjs/color-mode', '@vueuse/nuxt', '@nuxtjs/google-fonts'],

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
      htmlAttrs: { lang: 'pt-BR' },
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
    '/_nuxt/**': { static: true },

    '/': { swr: 600 },                        // 10 min — refresh latest posts
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
