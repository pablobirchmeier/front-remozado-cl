<template>
  <v-container class="pa-4">
    <div class="d-flex justify-space-between align-center mb-4">
      <v-select
        v-model="filtroActivo"
        :items="opcionesFiltro"
        item-title="texto"
        item-value="valor"
        label="Filtrar por estado"
        style="max-width: 220px;"
        density="comfortable"
        hide-details
      />
      <v-btn color="primary" @click="agregarUsuario">
        <v-icon start>mdi-plus</v-icon>
        Agregar usuario
      </v-btn>
    </div>


    <v-data-table
      :headers="headers"
      :items="usuariosFiltrados"
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

          <!-- Botón condicional -->
          <v-btn
            v-if="item.activo === 1"
            icon
            density="compact"
            size="32"
            color="red"
            @click="confirmarBloqueo(item)"
          >
            <v-icon size="16">mdi-account-off</v-icon>
          </v-btn>

          <v-btn
            v-else
            icon
            density="compact"
            size="32"
            color="green"
            @click="desbloquearUsuario(item)"
          >
            <v-icon size="16">mdi-account-check</v-icon>
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
          <v-text-field
            v-model="nuevoUsuario.nombre"
            label="Nombre"
            :error-messages="errores.nombre"
          />
          <v-text-field
            v-model="nuevoUsuario.email"
            label="Correo electrónico"
            :error-messages="errores.email"
          />
          <v-text-field
            v-model="nuevoUsuario.rut"
            label="RUT"
            :error-messages="errores.rut"
          />
          <v-select
            v-model="nuevoUsuario.estacion_actual_id"
            :items="estaciones"
            item-title="nombre"
            item-value="id"
            label="Estación de trabajo"
            density="comfortable"
            :error-messages="errores.estacion_actual_id"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="crearUsuario">Crear</v-btn>
          <v-btn text @click="dialogCrear = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogConfirmarBloqueo" max-width="400px">
      <v-card>
        <v-card-title class="text-h6">Confirmar bloqueo</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas bloquear al usuario
          <strong>{{ usuarioAConfirmar?.nombre }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="red" @click="ejecutarBloqueo">Bloquear</v-btn>
          <v-btn text @click="dialogConfirmarBloqueo = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      color="success"
      rounded="pill"
      elevation="5"
    >
      {{ snackbarMensaje }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from '@/lib/axios'
import { computed } from 'vue'

const usuarios = ref([])
const busqueda = ref('')
const estaciones = ref([])

const snackbar = ref(false)
const snackbarMensaje = ref('')

const errores = reactive({})

const dialogConfirmarBloqueo = ref(false)
const usuarioAConfirmar = ref(null)


// Tabla
const headers = [
  { title: 'RUT', key: 'rut' },
  { title: 'Nombre', key: 'nombre' },
  { title: 'Correo electrónico', key: 'email' },
  { title: 'Rol', key: 'rol_nombre' },
  { title: 'Acciones', key: 'acciones', sortable: false },
]

const filtroActivo = ref(1)

const opcionesFiltro = [
  { texto: 'Todos', valor: null },
  { texto: 'Activos', valor: 1 },
  { texto: 'Inactivos', valor: 0 },
]

const usuariosFiltrados = computed(() => {
  if (filtroActivo.value === null) return usuarios.value
  return usuarios.value.filter(usuario => usuario.activo === filtroActivo.value)
})

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

// Cargar usuarios y estaciones
onMounted(async () => {
  await cargarUsuarios()
  try {
    const response = await axios.get('/api/select-estaciones')
    estaciones.value = response.data
  } catch (error) {
    console.error('Error al cargar estaciones:', error)
  }
})

async function cargarUsuarios() {
  try {
    const response = await axios.get('/api/usuarios')
    usuarios.value = response.data
  } catch (error) {
    console.error('Error al cargar usuarios:', error)
  }
}

function agregarUsuario() {
  nuevoUsuario.value = {
    nombre: '',
    email: '',
    rut: '',
    estacion_actual_id: '',
  }
  limpiarErrores()
  dialogCrear.value = true
}

function abrirModal(usuario) {
  usuarioEditando.value = { ...usuario }
  limpiarErrores()
  dialogEditar.value = true
}

function limpiarErrores() {
  Object.keys(errores).forEach(key => {
    errores[key] = []
  })
}

async function crearUsuario() {
  limpiarErrores()
  try {
    await axios.post('/api/usuarios', nuevoUsuario.value)
    dialogCrear.value = false
    await cargarUsuarios()
    snackbarMensaje.value = 'Usuario agregado exitosamente'
    snackbar.value = true
  } catch (error) {
    if (error.response?.status === 422) {
      const errorData = error.response.data.errors || {}
      Object.keys(errorData).forEach(key => {
        errores[key] = errorData[key]
      })
    } else {
      console.error('Error al crear usuario:', error)
    }
  }
}

async function guardarCambios() {
  limpiarErrores()
  try {
    await axios.put(`/api/usuarios/${usuarioEditando.value.id}`, usuarioEditando.value)
    dialogEditar.value = false
    await cargarUsuarios()
    snackbarMensaje.value = 'Usuario actualizado exitosamente'
    snackbar.value = true
  } catch (error) {
    if (error.response?.status === 422) {
      const errorData = error.response.data.errors || {}
      Object.keys(errorData).forEach(key => {
        errores[key] = errorData[key]
      })
    } else {
      console.error('Error al guardar cambios:', error)
    }
  }
}

async function bloquearUsuario(usuario) {
  try {
    await axios.put(`/api/usuarios/${usuario.id}/bloquear`)
    await cargarUsuarios()
    snackbarMensaje.value = `Usuario ${usuario.nombre} bloqueado correctamente`
    snackbar.value = true
  } catch (error) {
    console.error('Error al bloquear usuario:', error)
  }
}

async function ejecutarBloqueo() {
  if (!usuarioAConfirmar.value) return

  try {
    await axios.put(`/api/usuarios/${usuarioAConfirmar.value.id}/bloquear`)
    await cargarUsuarios()
    snackbarMensaje.value = `Usuario ${usuarioAConfirmar.value.nombre} bloqueado correctamente`
    snackbar.value = true
  } catch (error) {
    console.error('Error al bloquear usuario:', error)
  } finally {
    dialogConfirmarBloqueo.value = false
    usuarioAConfirmar.value = null
  }
}

function confirmarBloqueo(usuario) {
  usuarioAConfirmar.value = usuario
  dialogConfirmarBloqueo.value = true
}

async function desbloquearUsuario(usuario) {
  try {
    await axios.put(`/api/usuarios/${usuario.id}/desbloquear`)
    await cargarUsuarios()
    snackbarMensaje.value = `Usuario ${usuario.nombre} desbloqueado correctamente`
    snackbar.value = true
  } catch (error) {
    console.error('Error al desbloquear usuario:', error)
  }
}


</script>
