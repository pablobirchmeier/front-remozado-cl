<template>
  <v-container class="pa-4">
    <div class="d-flex justify-end mb-4">
      <v-btn color="primary" @click="agregarUsuario">
        <v-icon start>mdi-plus</v-icon>
        Agregar usuario
      </v-btn>
    </div>

    <v-data-table
      :headers="headers"
      :items="usuarios"
      class="elevation-1"
      items-per-page="10"
      :search="busqueda"
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

      <template #header.rut>
        <th style="width: 140px;">RUT</th>
      </template>
      <template #item.rut="{ item }">
        <td style="min-width: 72px; max-width: 82px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          {{ item.rut }}
        </td>
      </template>

      <template #item.acciones="{ item }">
        <div class="d-flex align-center" style="gap: 8px;">
          <v-btn icon density="compact" size="32" color="black" @click="abrirModal(item)">
            <v-icon size="16">mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon density="compact" size="32" color="red">
            <v-icon size="16">mdi-delete</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table>

    <!-- Modal editar -->
    <v-dialog v-model="dialogEditar" max-width="500px">
      <v-card>
        <v-card-title class="text-h6">Editar Usuario</v-card-title>
        <v-card-text>
          <v-text-field v-model="usuarioEditando.nombre" label="Nombre" />
          <v-text-field v-model="usuarioEditando.email" label="Correo electrónico" />
          <v-select
            v-model="usuarioEditando.estacion_actual_id"
            :items="estaciones"
            item-title="nombre"
            item-value="id"
            label="Estación de trabajo"
            density="comfortable"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="guardarCambios">Guardar</v-btn>
          <v-btn text @click="dialogEditar = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Modal agregar -->
    <v-dialog v-model="dialogCrear" max-width="500px">
      <v-card>
        <v-card-title class="text-h6">Agregar Usuario</v-card-title>
        <v-card-text>
          <v-text-field v-model="nuevoUsuario.nombre" label="Nombre" />
          <v-text-field v-model="nuevoUsuario.email" label="Correo electrónico" />
          <v-text-field v-model="nuevoUsuario.rut" label="RUT" />
          <v-select
            v-model="nuevoUsuario.estacion_actual_id"
            :items="estaciones"
            item-title="nombre"
            item-value="id"
            label="Estación de trabajo"
            density="comfortable"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="crearUsuario">Crear</v-btn>
          <v-btn text @click="dialogCrear = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/lib/axios'

const usuarios = ref([])
const busqueda = ref('')
const estaciones = ref([])


// Tabla
const headers = [
  { title: 'RUT', key: 'rut' },
  { title: 'Nombre', key: 'nombre' },
  { title: 'Correo electrónico', key: 'email' },
  { title: 'Rol', key: 'rol_nombre' },
  { title: 'Acciones', key: 'acciones', sortable: false },
]

const dialogEditar = ref(false)
const usuarioEditando = ref({
  id: null,
  nombre: '',
  email: '',
  rut: '',
  estacion_actual_id: '',
})
const dialogCrear = ref(false)  
const nuevoUsuario = ref({
  nombre: '',
  email: '',
  rut: '',
  estacion_actual_id: '',
})

// Cargar usuarios
onMounted(async () => {
    try {
      const response = await axios.get('/api/usuarios')
      usuarios.value = response.data
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
    }
    try {
    const response = await axios.get('/api/select-estaciones')
    estaciones.value = response.data
  } catch (error) {
    console.error('Error al cargar estaciones:', error)
  }
})

function abrirModal(usuario) {
  usuarioEditando.value = { ...usuario }
  dialogEditar.value = true
}

async function guardarCambios() {
  try {
    await axios.put(`/api/usuarios/${usuarioEditando.value.id}`, usuarioEditando.value)
    dialogEditar.value = false
    await cargarUsuarios()
  } catch (error) {
    console.error('Error al guardar:', error)
  }
}
    
async function cargarUsuarios() {
  try {
    const response = await axios.get('/api/usuarios')
    usuarios.value = response.data
  } catch (error) {
    console.error('Error al recargar usuarios:', error)
  }
}

function agregarUsuario() {
  nuevoUsuario.value = {
    nombre: '',
    email: '',
    rut: '',
    estacion_actual_id: '',
  }
  dialogCrear.value = true
}

async function crearUsuario() {
  try {
    await axios.post('/api/usuarios', nuevoUsuario.value)
    dialogCrear.value = false
    await cargarUsuarios()
  } catch (error) {
    console.error('Error al crear usuario:', error)
  }
}
</script>
