<template>
  <v-stepper :items="['Paso 1', 'Paso 2', 'Paso 3']">
    <!-- Paso 1: contenido actual dentro del stepper -->
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

    <!-- Paso 2 (vacío por ahora) -->
    <template v-slot:item.2>
      <v-card title="Paso 2" flat>
        <!-- contenido futuro -->
      </v-card>
    </template>

    <!-- Paso 3 (vacío por ahora) -->
    <template v-slot:item.3>
      <v-card title="Paso 3" flat>
        <!-- contenido futuro -->
      </v-card>
    </template>
  </v-stepper>
</template>

<script setup>
import { ref } from 'vue'

const mac = ref('')
const error = ref('')
const mensaje = ref('')

const escanear = () => {
  error.value = ''
  mensaje.value = ''

  if (mac.value.trim() === '') {
    error.value = 'La dirección MAC es obligatoria.'
    return
  }

  // Simulación de escaneo
  mensaje.value = `Equipo con MAC ${mac.value} escaneado correctamente`
  mac.value = ''
}
</script>
