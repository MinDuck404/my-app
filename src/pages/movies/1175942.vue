// pages/movies/[id].vue - Trang chi tiết phim với SEO động
<template>
  <div class="movie-detail">
    <!-- Hero Section -->
    <div 
      class="hero-section" 
      :style="{ backgroundImage: safeMovie.backdrop_path ? `url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${safeMovie.backdrop_path})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }"
    >
      <div class="hero-overlay">
        <div class="container">
          <div class="movie-info">
            <img 
              :src="safeMovie.poster_path ? `https://image.tmdb.org/t/p/w500${safeMovie.poster_path}` : 'https://via.placeholder.com/500x750/666/fff?text=No+Image'" 
              :alt="safeMovie.title"
              class="poster"
              @error="$event.target.src = 'https://via.placeholder.com/500x750/666/fff?text=No+Image'"
            />
            <div class="details">
              <h1>{{ safeMovie.title }}</h1>
              <p v-if="safeMovie.tagline" class="tagline">{{ safeMovie.tagline }}</p>
              <div class="meta">
                <span class="rating">⭐ {{ safeMovie.vote_average.toFixed(1) }}/10</span>
                <span class="year">{{ new Date(safeMovie.release_date).getFullYear() }}</span>
                <span v-if="safeMovie.runtime > 0" class="runtime">{{ safeMovie.runtime }} phút</span>
              </div>
              <div v-if="safeMovie.genres.length > 0" class="genres">
                <span 
                  v-for="genre in safeMovie.genres" 
                  :key="genre.id"
                  class="genre-tag"
                >
                  {{ genre.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="container content-section">
      <div class="overview">
        <h2>Tổng quan</h2>
        <p>{{ safeMovie.overview }}</p>
      </div>

      <div v-if="safeMovie.production_companies.length > 0 || safeMovie.budget > 0 || safeMovie.revenue > 0" class="production-info">
        <h3>Thông tin sản xuất</h3>
        <div class="info-grid">
          <div v-if="safeMovie.budget > 0" class="info-item">
            <strong>Ngân sách:</strong> 
            ${{ safeMovie.budget.toLocaleString() }}
          </div>
          <div v-if="safeMovie.revenue > 0" class="info-item">
            <strong>Doanh thu:</strong> 
            ${{ safeMovie.revenue.toLocaleString() }}
          </div>
          <div v-if="safeMovie.production_companies.length > 0" class="info-item">
            <strong>Công ty sản xuất:</strong>
            {{ safeMovie.production_companies.map(c => c.name).join(', ') }}
          </div>
          <div v-if="safeMovie.production_countries.length > 0" class="info-item">
            <strong>Quốc gia:</strong>
            {{ safeMovie.production_countries.map(c => c.name).join(', ') }}
          </div>
        </div>
      </div>

      <!-- Collection nếu có -->
      <div v-if="safeMovie.belongs_to_collection" class="collection">
        <h3>Thuộc bộ sưu tập</h3>
        <div class="collection-info">
          <img 
            :src="safeMovie.belongs_to_collection.poster_path ? `https://image.tmdb.org/t/p/w200${safeMovie.belongs_to_collection.poster_path}` : 'https://via.placeholder.com/200x300/666/fff?text=Collection'"
            :alt="safeMovie.belongs_to_collection.name"
            @error="$event.target.src = 'https://via.placeholder.com/200x300/666/fff?text=Collection'"
          />
          <span>{{ safeMovie.belongs_to_collection.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>

import { getCurrentInstance } from 'vue'

const instance = getCurrentInstance()
console.log(instance.type.name) // nếu có khai báo "name"
const route = useRoute()
const movieId = 1175942 

// Debug: Log để check route params
// console.log('Route params:', route.params)
// console.log('Movie ID:', movieId)

// Validate movieId
if (!movieId || movieId === 'undefined') {
  throw createError({
    statusCode: 404,
    statusMessage: 'Movie ID not found'
  })
}

// API key 
const API_KEY = '27c4804d7e4781754d0659ab8f3aa570'
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyN2M0ODA0ZDdlNDc4MTc1NGQwNjU5YWI4ZjNhYTU3MCIsIm5iZiI6MTc1NTY1ODY5Mi4zMTQsInN1YiI6IjY4YTUzOWM0ODVmOTZmMTRjZDVkZDExZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UMVLlUQQzjig6pmy7dVBYukd5Sa018h3VOBsyZXLH5M'

// Fetch movie data với error handling
let movie = null
try {
  movie = await $fetch(`https://api.themoviedb.org/3/movie/${movieId}`, {
    query: {
      language: 'en-US'
    },
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'accept': 'application/json'
    }
  })
  
  // console.log('Movie data:', movie)
  
  // Validate movie data
  if (!movie || !movie.id) {
    throw new Error('Invalid movie data')
  }
  
} catch (error) {
  console.error('API Error:', error)
  throw createError({
    statusCode: 404,
    statusMessage: `Movie with ID ${movieId} not found`
  })
}

// Fallback values để tránh lỗi undefined
const safeMovie = {
  title: movie?.title || 'Unknown Movie',
  original_title: movie?.original_title || movie?.title || 'Unknown Movie',
  overview: movie?.overview || 'No description available',
  tagline: movie?.tagline || '',
  poster_path: movie?.poster_path || '/placeholder.jpg',
  backdrop_path: movie?.backdrop_path || '/placeholder.jpg',
  release_date: movie?.release_date || '2024-01-01',
  vote_average: movie?.vote_average || 0,
  vote_count: movie?.vote_count || 0,
  runtime: movie?.runtime || 0,
  budget: movie?.budget || 0,
  revenue: movie?.revenue || 0,
  genres: movie?.genres || [],
  production_companies: movie?.production_companies || [],
  production_countries: movie?.production_countries || [],
  spoken_languages: movie?.spoken_languages || [],
  belongs_to_collection: movie?.belongs_to_collection || null,
  homepage: movie?.homepage || '',
  adult: movie?.adult || false,
  id: movie?.id || movieId
}

// Tạo URL canonical
const canonicalUrl = `https://localhost:3000/movies/${movieId}`

// Tạo description tối ưu SEO với fallback
const seoDescription = safeMovie.overview.length > 0 
  ? `${safeMovie.overview.substring(0, 150)}... Xem thông tin chi tiết, đánh giá và trailer của ${safeMovie.title} (${new Date(safeMovie.release_date).getFullYear()}). ${safeMovie.genres.length > 0 ? `Thể loại: ${safeMovie.genres.map(g => g.name).join(', ')}.` : ''}`
  : `Xem thông tin chi tiết về phim ${safeMovie.title} (${new Date(safeMovie.release_date).getFullYear()}) tại website của chúng tôi.`

// Setup SEO Meta Tags
useSeoMeta({
  // Basic SEO
  title: `${safeMovie.title} (${new Date(safeMovie.release_date).getFullYear()})${safeMovie.genres.length > 0 ? ` | Phim ${safeMovie.genres[0]?.name}` : ''}`,
  description: seoDescription,
  keywords: `${safeMovie.title}, ${safeMovie.original_title !== safeMovie.title ? safeMovie.original_title + ', ' : ''}phim ${safeMovie.genres.map(g => g.name).join(', ')}, ${new Date(safeMovie.release_date).getFullYear()}, ${safeMovie.production_companies.map(c => c.name).join(', ')}`,
  
  // Open Graph
  ogTitle: `${safeMovie.title} (${new Date(safeMovie.release_date).getFullYear()})`,
  ogDescription: safeMovie.overview || seoDescription,
  ogImage: safeMovie.poster_path ? `https://image.tmdb.org/t/p/w500${safeMovie.poster_path}` : 'https://via.placeholder.com/500x750/667eea/ffffff?text=Movie+Poster',
  ogUrl: canonicalUrl,
  ogType: 'video.movie',
  ogSiteName: 'Your Movie Site',
  
  // Twitter Card
  twitterCard: 'summary_large_image',
  twitterTitle: `${safeMovie.title} (${new Date(safeMovie.release_date).getFullYear()})`,
  twitterDescription: safeMovie.overview || seoDescription,
  twitterImage: safeMovie.poster_path ? `https://image.tmdb.org/t/p/w500${safeMovie.poster_path}` : 'https://via.placeholder.com/500x750/667eea/ffffff?text=Movie+Poster',
  twitterSite: '@yourmoviesite',
  
  // Additional movie-specific meta
  'video:duration': safeMovie.runtime > 0 ? safeMovie.runtime * 60 : undefined,
  'video:release_date': safeMovie.release_date,
})

// Structured Data (JSON-LD) với fallback values
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Movie',
        name: safeMovie.title,
        alternateName: safeMovie.original_title !== safeMovie.title ? safeMovie.original_title : undefined,
        description: safeMovie.overview || `Information about ${safeMovie.title}`,
        image: safeMovie.poster_path ? `https://image.tmdb.org/t/p/w500${safeMovie.poster_path}` : undefined,
        datePublished: safeMovie.release_date,
        genre: safeMovie.genres.map(g => g.name),
        duration: safeMovie.runtime > 0 ? `PT${safeMovie.runtime}M` : undefined,
        contentRating: safeMovie.adult ? 'R' : 'PG',
        aggregateRating: safeMovie.vote_count > 0 ? {
          '@type': 'AggregateRating',
          ratingValue: safeMovie.vote_average,
          ratingCount: safeMovie.vote_count,
          bestRating: 10,
          worstRating: 0
        } : undefined,
        productionCompany: safeMovie.production_companies.length > 0 ? safeMovie.production_companies.map(company => ({
          '@type': 'Organization',
          name: company.name
        })) : undefined,
        countryOfOrigin: safeMovie.production_countries.length > 0 ? safeMovie.production_countries.map(country => country.name) : undefined,
        inLanguage: safeMovie.spoken_languages.length > 0 ? safeMovie.spoken_languages.map(lang => lang.english_name) : undefined,
        url: canonicalUrl,
        sameAs: safeMovie.homepage ? [safeMovie.homepage] : undefined
      })
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl
    }
  ]
})

// Breadcrumb structured data với safe values
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Trang chủ',
            item: 'https://localhost:3000'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Phim',
            item: 'https://localhost:3000/movies'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: safeMovie.title,
            item: canonicalUrl
          }
        ]
      })
    }
  ]
})
</script>
