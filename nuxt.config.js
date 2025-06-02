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

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Rodolfo De Bonis – Portfólio',
    htmlAttrs: {
      lang: 'pt',
    },
    meta: [
      {
        charset: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        name: 'description',
        content:
          'Portfólio de Rodolfo De Bonis – Engenheiro de Software, especialista em Desenvolvimento Mobile, DevOps, SaaS.',
      },
      {
        name: 'format-detection',
        content: 'telephone=no',
      },
      {
        property: 'og:title',
        content: 'Rodolfo De Bonis – Portfólio',
      },
      {
        property: 'og:description',
        content: 'Engenheiro de Software | DevOps | Mobile | D&D Master',
      },
      {
        property: 'og:image',
        content: 'https://rodolfodebonis.com.br/api/portfolio/me.jpeg',
      },
      {
        property: 'og:url',
        content: 'https://rodolfodebonis.com.br',
      },
      {
        property: 'og:type',
        content: 'website',
      },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
    ],
    script: [{ src: 'https://unpkg.com/scrollreveal' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/colors.css',
    '@/assets/css/main.css',
    '@fortawesome/fontawesome-svg-core/styles.css',
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
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~/plugins/fontawesome.js'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/dotenv
    ['@nuxtjs/dotenv', { systemvars: true }],
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/color-mode', '@vueuse/nuxt', '@nuxtjs/google-fonts'],

  colorMode: {
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark',
    storageKey: 'nuxt-color-mode',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    dataValue: 'dark',
  },

  styleResources: {
    scss: ['./assets/css/*.css'],
  },

  build: {},
  devServerHandlers: [],

  server: {
    host: '0.0.0.0',
  },

  compatibilityDate: '2025-01-30',
  devtools: { enabled: true },

  googleFonts: {
    families: {
      Inter: [300, 400, 600, 700],
      Poppins: [400, 600],
    },
    display: 'swap',
  },

  app: {
    head: {
      title: 'Rodolfo De Bonis – Portfólio',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Portfólio de Rodolfo De Bonis – Engenheiro de Software, especialista em Desenvolvimento Mobile, DevOps, SaaS.',
        },
        { property: 'og:title', content: 'Rodolfo De Bonis – Portfólio' },
        {
          property: 'og:description',
          content: 'Engenheiro de Software | DevOps | Mobile | D&D Master',
        },
        {
          property: 'og:image',
          content: 'https://rodolfodebonis.com.br/imagens/og-image.png',
        },
        { property: 'og:url', content: 'https://rodolfodebonis.com.br' },
        { property: 'og:type', content: 'website' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
      script: [{ src: 'https://unpkg.com/scrollreveal' }],
    },
  },

  // Configuração de roteamento
  router: {
    options: {
      strict: false,
    },
    trailingSlash: true,
  },

  // Configuração de geração estática
  generate: {
    fallback: true,
  },

  // Configuração de roteamento
  routeRules: {
    '/**': { ssr: true },
    '/_nuxt/**': { static: true },
  },
})
