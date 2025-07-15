<template>
  <v-container class="pa-4">
    <v-data-table 
      :headers="headers"
      :items="equipos"
      :search="busqueda"
      class="elevation-1"
      items-per-page="50"
    >
      <!-- Búsqueda -->
      <template #top>
        <v-text-field
          v-model="busqueda"
          label="Buscar"
          prepend-inner-icon="mdi-magnify"
          class="mb-4"
          hide-details
        />
      </template>

      <!-- Estado visual con chip -->
      <template #item.estado="{ item }">
        <v-chip
          :color="item.estado === 'VIGENTE' ? 'green' : 'grey'"
          text-color="white"
          small
          label
        >
          {{ item.estado }}
        </v-chip>
      </template>

      <!-- CRIT. COM -->
      <template #item.criterio_comercial="{ item }">
        <v-chip
          :color="item.criterio_comercial === 1 ? 'red' : 'grey'"
          text-color="white"
          small
          label
        >
          {{ item.criterio_comercial === 1 ? 'SI' : 'NO' }}
        </v-chip>
      </template>

      <!-- Acciones -->
      <template #item.acciones="{ item }">
        <div class="d-flex" style="gap: 8px;">
          <v-btn icon density="compact" size="32" color="green" @click="verEquipo(item)">
            <v-icon size="16">mdi-eye</v-icon>
          </v-btn>
          <v-btn icon density="compact" size="32" color="cyan" @click="buscarDetalle(item)">
            <v-icon size="16">mdi-magnify</v-icon>
          </v-btn>
          <v-btn icon density="compact" size="32" color="black" @click="editarEquipo(item)">
            <v-icon size="16">mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon density="compact" size="32" color="red" @click="eliminarEquipo(item)">
            <v-icon size="16">mdi-delete</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table>

    <!-- Modal de vista (detalle del equipo) -->
    <v-dialog v-model="dialogVer" max-width="800px">
      <v-card>
        <v-card-title class="text-h6">
          Detalle del equipo
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="detalleHeaders"
            :items="detalleEquipo"
            class="elevation-1"
            dense
            hide-default-footer
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialogVer = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/lib/axios'

const equipos = ref([])
const busqueda = ref('')

const headers = [
  { title: 'N° CATALOGO(SAP)', key: 'serie' },
  { title: 'MAC ADDRESS', key: 'mac' },
  { title: 'MODELO', key: 'modelo_id' },
  { title: 'TECNOLOGÍA', key: 'tecnologia' },
  { title: 'ESTADO', key: 'estado' },
  { title: 'CRIT. COM', key: 'criterio_comercial' },
  { title: 'Acciones', key: 'acciones', sortable: false },
]

// Estado del modal y datos de detalle
const dialogVer = ref(false)
const detalleEquipo = ref([]) // Aquí irán los datos del backend
const detalleHeaders = [
  { title: 'Campo A', key: 'campoA' },
  { title: 'Campo B', key: 'campoB' },
  { title: 'Campo C', key: 'campoC' },
]

onMounted(async () => {
  try {
    const response = await axios.get('/api/equipos')
    equipos.value = response.data
  } catch (error) {
    console.error('Error al cargar equipos:', error)
  }
})

function verEquipo(equipo) {
  dialogVer.value = true
  detalleEquipo.value = [] // Limpia tabla

  // ⚠️ Luego reemplazas esto con tu lógica real de fetch al backend
  // Simulación por ahora
  detalleEquipo.value = [
    { campoA: 'Valor A1', campoB: 'Valor B1', campoC: 'Valor C1' },
    { campoA: 'Valor A2', campoB: 'Valor B2', campoC: 'Valor C2' },
  ]

  // Más adelante puedes hacer:
  // const response = await axios.get(`/api/equipos/${equipo.id}/detalle`)
  // detalleEquipo.value = response.data
}

function buscarDetalle(equipo) {
  console.log('Buscar detalle:', equipo)
}

function editarEquipo(equipo) {
  console.log('Editar equipo:', equipo)
}

function eliminarEquipo(equipo) {
  console.log('Eliminar equipo:', equipo)
}
</script>
