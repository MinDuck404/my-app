// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  pages: true,
  ssr: true,
  srcDir: 'src/',
  site: {
    url: 'https://localhost:3000',
    // url: 'https://example.com',
    name: 'My Nuxt Site',
  },
  modules: [// [
  //   '@nuxtjs/sitemap',
  //   {
  //     hostname: 'https://localhost:3000',

  //   },
  // ],
  [
    '@nuxtjs/robots',
    {
      UserAgent: '*',
      Allow: '/',
      Sitemap: 'https://localhost:3000/sitemap.xml',
      Disallow: ['/admin', '/private'],
    },
  ], '@nuxtjs/sitemap'],
})