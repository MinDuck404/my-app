<template>
    <div>
        <h1>Welcome to My Movie Site</h1>
        <p>Explore the latest movies and find your favorites!</p>
        <nuxt-link to="/movies/test">Go to Test Movie Page</nuxt-link>
        <br />
        <nuxt-link to="/movies/1175942">Browse Movies</nuxt-link>
    </div>
</template>
<script setup>
import { useHead } from '#imports'
import { useRoute } from 'vue-router'
const homepage = {
    title: 'My Movie Site',
    description: 'Discover the latest movies, reviews, and more!'
}
useHead({
    title: homepage.title,
    meta: [
        { name: 'description', content: homepage.description },
        { property: 'og:title', content: homepage.title },
        { property: 'og:description', content: homepage.description },
        { property: 'og:type', content: 'website' },
    ]
})
</script>