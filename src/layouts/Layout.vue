<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :width="250" temporary>
      <v-card flat>
        <v-card-title class="text-subtitle-1 font-weight-bold">
          Amerinode Chile
        </v-card-title>
        <v-divider />
        <v-list dense nav class="text-h5">
          <template v-for="group in items" :key="group.id">
            <v-list-group :value="group.id">
              <template #activator="{ props }">
                <v-list-item v-bind="props">
                  <template #title>
                    <span class="text-h6">{{ group.title }}</span>
                  </template>
                </v-list-item>
              </template>

              <v-list-item
                v-for="child in group.children"
                :key="child.id"
                @click="handleTreeviewSelect([child.id])"
              >
                <template #title>
                  <span class="text-body-1">{{ child.title }}</span>
                </template>
              </v-list-item>
            </v-list-group>
          </template>

        </v-list>
      </v-card>
    </v-navigation-drawer>

    <v-app-bar elevation="7">
      <template #prepend>
        <v-app-bar-nav-icon v-if="esAdmin" @click="drawer = !drawer" />
      </template>

    <v-app-bar-title
      class="flex-grow-1"
      style="overflow: visible !important; text-overflow: unset !important; white-space: normal !important; flex: 1 1 auto;"
    >
      {{ tituloRutaActual }}
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
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import LogoutButton from '../components/LogoutButton.vue'
import { useUserStore } from '../stores/user'

const drawer = ref(false)
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const userName = computed(() => userStore.user?.nombre ?? 'Usuario')
const esAdmin = computed(() => userStore.user?.role_id === 1)
const tituloRutaActual = computed(() => route.meta.title ?? 'Remozado Chile')


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
    title: 'Estaciones',
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

function rutaDesdeEstacion(id) {
  const mapa = {
    2: 'usuarios',
    3: 'informes',
    4: 'productividad',
    5: 'estaciones-trabajo',
    6: 'equipos',
    10: 'logistica',
    11: 'clasificacion',
    12: 'lavado',
    13: 'remozado',
    14: 'armeydesarme',
    15: 'reparacion',
    16: 'testeo',
    17: 'microscopio',
    18: 'kitting',
    19: 'qc',
    20: 'scrap',
  }
  return mapa[id] || null
}

function handleTreeviewSelect(selectedIds) {
  const selectedId = selectedIds[0]
  if (!selectedId) return

  const ruta = rutaDesdeEstacion(selectedId)
  if (ruta) {
    router.push({ path: `/${ruta}` })
    drawer.value = false
  }
}

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (token) {
    try {
      const response = await axios.get('/api/user')
      const user = response.data
      userStore.setAuthData({ user })

      if (user.role_id === 3) {
        const destino = `/${rutaDesdeEstacion(user.estacion_actual_id)}`
        if (route.path !== destino) {
          router.replace(destino)
        }
      }
    } catch (error) {
      console.error('Error al cargar el usuario:', error)
      localStorage.removeItem('token')
      router.push('/login')
    }
  }
})
</script>
