// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  pages: true,
  ssr: true,
  srcDir: 'src/',
  modules: [
    [
      '@nuxtjs/sitemap',
      {
        hostname: 'https://localhost:3000',
        routes: async () => {
          const response = await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US', {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyN2M0ODA0ZDdlNDc4MTc1NGQwNjU5YWI4ZjNhYTU3MCIsIm5iZiI6MTc1NTY1ODY5Mi4zMTQsInN1YiI6IjY4YTUzOWM0ODVmOTZmMTRjZDVkZDExZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UMVLlUQQzjig6pmy7dVBYukd5Sa018h3VOBsyZXLH5M`,
            },
          });
          const data = await response.json();
          return data.results.map((movie: { id: any; }) => `/movie/${movie.id}`);
        },
      },
    ],
    [
      '@nuxtjs/robots',
      {
        UserAgent: '*',
        Allow: '/',
        Sitemap: 'https://localhost:3000/sitemap.xml',
        Disallow: ['/admin', '/private'],
      },
    ],
  ],
})
