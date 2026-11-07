import { existsSync, readdirSync } from 'node:fs'
import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://fulcrongrv.it'

// Gallery photos: public/foto when `npm run gallery` has filled it, otherwise the production bucket on R2.
// A fresh clone (or a Vercel build without NUXT_PUBLIC_GALLERY_URL) still builds and shows the real photos.
const hasLocalPhotos = existsSync('public/foto') && readdirSync('public/foto').length > 0
const galleryUrl = process.env.NUXT_PUBLIC_GALLERY_URL || (hasLocalPhotos ? '/foto' : 'https://foto.fulcrongrv.it')
const description =
  'FulcronGRV è un’associazione di gioco di ruolo dal vivo (LARP) dell’Appennino Tosco-Emiliano: la campagna fantasy “La Sinfonia dei Sette”, oneshot e molto altro.'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: ['@nuxt/content', '@nuxt/image'],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  // Markdown content (content/). Node's built-in SQLite, used only at build time.
  content: {
    experimental: { sqliteConnector: 'native' },
  },

  // Images in public/ are converted to WebP and resized when the site is generated.
  // The provider is fixed to ipx: on Vercel @nuxt/image would otherwise switch to
  // /_vercel/image, which does not exist in a static deployment (broken images).
  image: {
    provider: 'ipx',
    format: ['webp'],
    quality: 72,
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'it' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: description },
        { name: 'theme-color', content: '#002d40' },
        { name: 'msapplication-config', content: '/favicon/browserconfig.xml' },
        { property: 'og:site_name', content: 'FulcronGRV' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'it_IT' },
        { property: 'og:description', content: description },
        { property: 'og:image', content: `${siteUrl}/backgrounds/forest_op_comp.jpg` },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
        { rel: 'mask-icon', href: '/favicon/safari-pinned-tab.svg', color: '#002d40' },
        { rel: 'manifest', href: '/favicon/site.webmanifest' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      siteUrl,
      galleryUrl,
    },
  },

  // Old URLs from the previous versions of the site (static redirect pages)
  routeRules: {
    '/who': { redirect: '/chi-siamo' },
  },

  // Fully static site: `npm run generate` writes everything to .output/public
  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      // Bacheca has no links while it is empty, so the crawler would not find it
      routes: ['/', '/sitemap.xml', '/sinfonia/bacheca'],
    },
  },

  devServer: {
    port: 8080,
  },
})
