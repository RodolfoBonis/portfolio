import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  target: 'static',

  typescript: {
    typeCheck: true,
    tsConfig: {
      compilerOptions: {
        moduleResolution: 'bundler',
      },
    },
  },

  runtimeConfig: {
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

  routeRules: {
    '/**': { ssr: true },
    '/_nuxt/**': { static: true },
  },
})
