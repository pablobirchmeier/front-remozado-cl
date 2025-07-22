<template>
  <v-container class="text-center pa-8">
    <v-tabs v-model="tab" align-tabs="center" class="mb-6">
      <v-tab value="importar">Importar</v-tab>
      <v-tab value="exportar">Exportar</v-tab>
    </v-tabs>

    <div v-if="tab === 'importar'">
      <p class="text-subtitle-1 mb-8">Importe archivo según corresponda</p>

    <div class="d-flex justify-center" style="gap: 50px;">
      <v-btn color="blue" class="white--text px-6 d-flex align-center justify-center" height="50" @click="triggerInput('now')">
        <span>ENTREGA NOW</span>
        <v-icon end class="ml-2">mdi-upload</v-icon>
      </v-btn>

      <v-btn color="blue" class="white--text px-6 d-flex align-center justify-center" height="50" @click="triggerInput('cdl')">
        <span>ENTREGA CDL</span>
        <v-icon end class="ml-2">mdi-upload</v-icon>
      </v-btn>
    </div>

    <div class="d-flex justify-center mt-5" style="gap: 50px;">
      <v-btn color="blue" class="white--text px-6 d-flex align-center justify-center" height="50" @click="triggerInput('caducados')">
        <span>ARCHIVO CADUCADOS</span>
        <v-icon end class="ml-2">mdi-upload</v-icon>
      </v-btn>
    </div>


      <input ref="inputNow" type="file" accept=".xls,.xlsx" class="d-none" @change="handleFileUpload($event, 'now')" />
      <input ref="inputCdl" type="file" accept=".xls,.xlsx,.csv" class="d-none" @change="handleFileUpload($event, 'cdl')" />
      <input ref="inputCaducados" type="file" accept=".xls,.xlsx,.csv" class="d-none" @change="handleFileUpload($event, 'caducados')" />
    </div>

    <v-overlay :model-value="loading" persistent class="d-flex align-center justify-center">
      <v-progress-circular indeterminate size="64" color="primary" />
    </v-overlay>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const tab = ref('importar')
const inputNow = ref(null)
const inputCdl = ref(null)
const inputCaducados = ref(null)
const loading = ref(false)

const triggerInput = (tipo) => {
  if (tipo === 'now') inputNow.value.click()
  if (tipo === 'cdl') inputCdl.value.click()
  if (tipo === 'caducados') inputCaducados.value.click()
}

const handleFileUpload = async (event, tipo) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)
  loading.value = true

  try {
    let url = ''
    if (tipo === 'now') url = '/api/logistica/importar-now'
    else if (tipo === 'cdl') url = '/api/logistica/importar-cdl'
    else if (tipo === 'caducados') url = '/api/logistica/importar-caducados'

    const response = await axios.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    alert(`Archivo ${tipo.toUpperCase()} subido con éxito`)
  } catch (error) {
    alert(`Error al subir archivo ${tipo.toUpperCase()}`)
  } finally {
    loading.value = false
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
