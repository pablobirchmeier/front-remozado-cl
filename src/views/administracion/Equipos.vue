<template>
  <v-container class="pa-4">
    <v-data-table 
      :headers="headers"
      :items="equipos"
      :search="busqueda"
      class="elevation-1"
      items-per-page="50"
    >
      <template #top>
        <v-text-field
          v-model="busqueda"
          label="Buscar"
          prepend-inner-icon="mdi-magnify"
          class="mb-4"
          hide-details
        />
      </template>

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

    <!-- Dialog con slot para columna personalizada -->
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
          >
            <!-- Slot para hacer más ancha la columna de fecha -->
            <template #item.created_at="{ item }">
              <td style="min-width: 220px;">
                {{ item.created_at }}
              </td>
            </template>
          </v-data-table>
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

const dialogVer = ref(false)
const detalleEquipo = ref([])

const detalleHeaders = [
  { title: 'Usuario', key: 'usuario_nombre' },
  { title: 'Fecha y hora', key: 'created_at' },
  { title: 'Entrada/salida', key: 'tipo' },
  { title: 'Estación', key: 'estacion' },
  { title: 'Resultado', key: 'resultado' },
  { title: 'Observaciones', key: 'observaciones' },
]

onMounted(async () => {
  try {
    const response = await axios.get('/api/equipos')
    equipos.value = response.data
  } catch (error) {
    console.error('Error al cargar equipos:', error)
  }
})

async function verEquipo(equipo) {
  dialogVer.value = true
  detalleEquipo.value = []
  try {
    const response = await axios.get(`/api/equipos/${equipo.id}`)
    detalleEquipo.value = response.data
  } catch (error) {
    console.error('Error al obtener detalle del equipo:', error)
  }
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
