<!-- layouts/DefaultLayout.vue -->
<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :width="250" temporary>
      <!-- Drawer -->
      <v-card flat>
        <v-card-title class="text-subtitle-1 font-weight-bold">Menú</v-card-title>
        <v-divider />
        <v-treeview
          :items="items"
          item-value="id"
          activatable
          open-on-click
          class="mt-2"
        />
      </v-card>
    </v-navigation-drawer>

    <v-app-bar elevation="7">
      <template #prepend>
        <v-app-bar-nav-icon @click="drawer = !drawer" />
      </template>

      <v-app-bar-title class="flex-grow-1 text-truncate">
        Remozado Chile
      </v-app-bar-title>

      <v-spacer />

      <v-btn text class="me-2" v-if="userStore.user">
        {{ userName }}
      </v-btn>

      <LogoutButton class="me-4" />
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import LogoutButton from '../components/LogoutButton.vue'
import { useUserStore } from '../stores/user'

const drawer = ref(false)
const userStore = useUserStore()
const userName = computed(() => userStore.user?.nombre ?? 'Usuario')

const items = ref([
  {
    id: 1,
    title: 'Administración',
    children: [
      { id: 2, title: 'Usuarios' },
      { id: 3, title: 'Informes' },
      { id: 4, title: 'Productividad' },
      { id: 5, title: 'Estaciones de trabajo' },
      { id: 6, title: 'Equipos' },
    ],
  },
  {
    id: 30,
    title: 'Estaciones de trabajo',
    children: [
      { id: 10, title: 'Logística / Recepción' },
      { id: 11, title: 'Clasificación' },
      { id: 12, title: 'Lavado de equipos' },
      { id: 13, title: 'Remozado de equipos' },
      { id: 14, title: 'Arme y desarme' },
      { id: 15, title: 'Reparación electrónica' },
      { id: 16, title: 'Testeo' },
      { id: 17, title: 'Microscopio' },
      { id: 18, title: 'Kitting' },
      { id: 19, title: 'Control Calidad (QC)' },
      { id: 20, title: 'SCRAP' },
    ],
  },
])
</script>
