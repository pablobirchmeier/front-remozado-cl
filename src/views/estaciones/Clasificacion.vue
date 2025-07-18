<template>
  <v-stepper v-model="pasoActual" :items="['Identificación', 'Clasificación']">

    <template v-slot:item.1>
      <v-container class="pa-4" style="max-width: 500px;">
        <v-card elevation="8">
          <v-card-title class="text-h6">Escanear equipo</v-card-title>

          <v-card-text>
            <v-form @submit.prevent="escanear">
              <v-text-field
                v-model="mac"
                label="MAC Address"
                prepend-icon="mdi-qrcode-scan"
                required
              ></v-text-field>

              <v-btn type="submit" color="primary" block>
                Escanear
              </v-btn>
            </v-form>

            <v-alert
              v-if="error"
              type="error"
              class="mt-4"
              dense
              border="start"
            >
              {{ error }}
            </v-alert>

            <v-alert
              v-if="mensaje"
              type="success"
              class="mt-4"
              dense
              border="start"
            >
              {{ mensaje }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-container>
    </template>

    <template v-slot:item.2>
      <v-card flat>
        <v-row>
          <v-col cols="8" md="8">

            <template v-if="equipoResultados && equipoResultados.length > 0">
              <div class="text-subtitle-1 font-weight-medium mb-2">
                Este equipo ya ha sido:
              </div>
              <div v-for="resultado in equipoResultados" :key="resultado.tipo_resultado" class="text-body-1">
                Este equipo se ha {{ formatoAccion(resultado.tipo_resultado) }}:
                <span v-if="resultado.cantidad > 0">
                  {{ resultado.cantidad }} {{ resultado.cantidad === 1 ? 'vez' : 'veces' }},
                  última vez {{ formatoFecha(resultado.ultima_fecha_hora) }}
                </span>
                <span v-else>
                  0 veces
                </span>
              </div>
            </template>
            <template v-else>
              <div class="text-body-1">
                No hay registros de acciones para este equipo.
              </div>
            </template>
          </v-col>

          <v-col cols="4" md="4" class="d-flex flex-column align-end justify-center ga-2">
            <v-btn color="blue" class="mb-2" style="color: white; width: 200px;" @click="seleccionarTipo(1)">
              EXPRESS
            </v-btn>

            <v-btn color="green" class="mb-2" style="color: white; width: 200px;" @click="seleccionarTipo(2)">
              NORMAL
            </v-btn>

            <v-btn color="orange darken-1" class="mb-2" style="color: white; width: 200px;" @click="seleccionarTipo(3)">
              TAPA AMARILLA
            </v-btn>

            <v-btn color="red darken-1" style="color: white; width: 200px;" @click="seleccionarTipo(4)">
              REPARACIÓN
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </template>

    <template v-slot:actions>

    </template>
  </v-stepper>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const pasoActual = ref(1)
const mac = ref('')
const error = ref('')
const mensaje = ref('')
const equipoId = ref(null)
const equipoResultados = ref([]) // Nueva variable reactiva para los resultados de clasificación

const escanear = async () => {
  error.value = ''
  mensaje.value = ''
  equipoResultados.value = [] // Limpiar resultados anteriores

  if (mac.value.trim() === '') {
    error.value = 'La dirección MAC es obligatoria.'
    return
  }

  try {
    const response = await axios.get('/api/clasificacion/registrar-entrada', {
      params: { mac: mac.value }
    })

    mensaje.value = response.data.message || 'Equipo registrado correctamente'
    equipoId.value = response.data.mov?.equipo_id
    
    // Asignar los resultados de la API a la variable reactiva
    if (response.data.resultados) {
      equipoResultados.value = response.data.resultados
    } else {
      equipoResultados.value = []
    }
    
    pasoActual.value = 2

  } catch (err) {
    error.value = err.response?.data?.message || 'Error en la clasificación'
  }
}

const seleccionarTipo = async (valor) => {
  try {
    const response = await axios.post('/api/clasificacion/registrar-resultado', {
      resultado: valor,
      mac: mac.value,
      equipo_id: equipoId.value
    })

    mensaje.value = response.data.mensaje || 'Resultado registrado correctamente'
    pasoActual.value = 1
    equipoId.value = null
    mac.value = ''
    equipoResultados.value = [] // Limpiar resultados al volver al paso 1

    setTimeout(() => {
      mensaje.value = ''
    }, 5000)

  } catch (error) {
    error.value = error.response?.data?.message || 'Error al registrar el resultado'
  }
}

const formatoFecha = (fechaHora) => {
  if (!fechaHora) return 'N/A';
  const fecha = new Date(fechaHora);
  const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return fecha.toLocaleDateString('es-ES', opciones);
};

const formatoAccion = (tipo) => {
  switch (tipo) {
    case 'Remozado':
      return 'remozado';
    case 'Lavado':
      return 'lavado';
    case 'Reparacion':
      return 'reparado';
    case 'Arme y desarme':
      return 'cambiado la tapa';
    default:
      return tipo.toLowerCase();
  }
};
</script>