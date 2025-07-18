<template>
  <v-container class="text-center pa-8">
    <v-tabs v-model="tab" align-tabs="center" class="mb-6">
      <v-tab value="importar">Importar</v-tab>
      <v-tab value="exportar">Exportar</v-tab>
    </v-tabs>

    <div v-if="tab === 'importar'">
      <p class="text-subtitle-1 mb-8">Importe archivo Excel según corresponda</p>

      <div class="d-flex justify-center" style="gap: 50px;">
        <v-btn
          color="blue"
          class="white--text px-6 py-6 d-flex align-center justify-center"
          height="50"
          @click="triggerInput('now')"
        >
          <span class="text-button">ENTREGA NOW</span>
          <v-icon end class="ml-2">mdi-upload</v-icon>
        </v-btn>

        <v-btn
          color="blue"
          class="white--text px-6 py-6 d-flex align-center justify-center"
          height="50"
          @click="triggerInput('cdl')"
        >
          <span class="text-button">ENTREGA CDL</span>
          <v-icon end class="ml-2">mdi-upload</v-icon>
        </v-btn>
      </div>

      <!-- Inputs ocultos para carga -->
      <input
        ref="inputNow"
        type="file"
        accept=".xls,.xlsx"
        class="d-none"
        @change="handleFileUpload($event, 'now')"
      />
      <input
        ref="inputCdl"
        type="file"
        accept=".xls,.xlsx"
        class="d-none"
        @change="handleFileUpload($event, 'cdl')"
      />
    </div>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const tab = ref('importar')

// Refs a los inputs de tipo file
const inputNow = ref(null)
const inputCdl = ref(null)

// Función para simular click del input según el botón presionado
const triggerInput = (tipo) => {
  if (tipo === 'now') inputNow.value.click()
  if (tipo === 'cdl') inputCdl.value.click()
}

// Manejar subida del archivo y enviar a la API
const handleFileUpload = async (event, tipo) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('archivo', file)

  try {
    const url =
      tipo === 'now'
        ? '/api/logistica/importar-now' // Cambia por tu endpoint real
        : '/api/logistica/importar-cdl'

    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    console.log('✅ Subido correctamente', response.data)
    alert(`Archivo ${tipo.toUpperCase()} subido con éxito`)
  } catch (error) {
    console.error('❌ Error al subir', error)
    alert(`Error al subir archivo ${tipo.toUpperCase()}`)
  } finally {
    // Limpiar input para poder volver a subir el mismo archivo si es necesario
    event.target.value = ''
  }
}
</script>

<style scoped>
.white--text {
  color: white !important;
}

.d-none {
  display: none;
}
</style>
