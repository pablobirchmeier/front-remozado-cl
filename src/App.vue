<!-- App.vue -->
<template>
  <component :is="layoutComponent" />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from './layouts/Layout.vue'

const route = useRoute()

const layoutComponent = computed(() => {
  return route.meta.layout === 'none'
    ? 'router-view' // Si no está logeado solo muestre router-view, si está logedao muestra el componente DefaultLayout que dentro también tiene un router-view
    : DefaultLayout 
})
</script>
