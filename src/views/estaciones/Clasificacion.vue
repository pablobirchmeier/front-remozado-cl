<template>
  <v-stepper v-model="pasoActual" :items="['Identificación', 'Clasificación']">
    
    <!-- Paso 1 -->
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

    <!-- Paso 2 -->
    <template v-slot:item.2>
      <v-card flat>
        <v-row>
          <v-col cols="8" md="8">
            <div class="text-subtitle-1 font-weight-medium mb-2">
              Este equipo ya ha sido:
            </div>
            <div class="text-body-1">Lavado: 1 vez, última vez 30-06-2025</div>
            <div class="text-body-1">Reparado: 1 vez, última vez 30-06-2025</div>
            <div class="text-body-1">Remozado: 1 vez, última vez 28-06-2025</div>
            <div class="text-body-1">Cambio de tapa: 0 veces</div>
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

    <!-- Sin acciones -->
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

const escanear = async () => {
  error.value = ''
  mensaje.value = ''

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

    // Avanza automáticamente al paso 2
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

    // Vuelve automáticamente al paso 1
    pasoActual.value = 1
    equipoId.value = null
    mac.value = ''

    setTimeout(() => {
      mensaje.value = ''
    }, 5000)

  } catch (error) {
    error.value = error.response?.data?.message || 'Error al registrar el resultado'
  }
}
</script>
