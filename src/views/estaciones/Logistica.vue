<template>
  <v-container class="text-center pa-8">
    <v-tabs v-model="tab" align-tabs="center" class="mb-6">
      <v-tab value="importar">Importar</v-tab>
      <v-tab value="exportar">Exportar</v-tab>
    </v-tabs>

    <div v-if="tab === 'importar'">
      <p class="text-subtitle-1 mb-8">Importe archivo según corresponda</p>

      <!-- Fila 1 -->
      <v-row justify="center" align="center" class="mb-4">
        <v-col cols="12" md="4" class="d-flex justify-center">
          <v-btn
            class="btn-xl"
            color="blue"
            dark
            @click="triggerInput('now')"
          >
            ENTREGA NOW
            <v-icon end class="ml-2">mdi-upload</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" md="4" class="d-flex justify-center">
          <v-btn
            class="btn-xl"
            color="blue"
            dark
            @click="triggerInput('cdl')"
          >
            ENTREGA CDL
            <v-icon end class="ml-2">mdi-upload</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <!-- Fila 2 -->
      <v-row justify="center" align="center">
        <v-col cols="12" md="4" class="d-flex justify-center">
          <v-btn
            class="btn-xl"
            color="blue"
            dark
            @click="triggerInput('caducados')"
          >
            ARCHIVO CADUCADOS
            <v-icon end class="ml-2">mdi-upload</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" md="4" class="d-flex justify-center">
          <v-btn
            class="btn-xl"
            color="blue"
            dark
            @click="triggerInput('toolbox')"
          >
            ARCHIVO TOOLBOX
            <v-icon end class="ml-2">mdi-upload</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <!-- Inputs -->
      <input ref="inputNow" type="file" accept=".xls,.xlsx" class="d-none" @change="handleFileUpload($event, 'now')" />
      <input ref="inputCdl" type="file" accept=".xls,.xlsx,.csv" class="d-none" @change="handleFileUpload($event, 'cdl')" />
      <input ref="inputCaducados" type="file" accept=".csv" class="d-none" @change="handleFileUpload($event, 'caducados')" />
      <input ref="inputToolbox" type="file" accept=".csv" class="d-none" @change="handleFileUpload($event, 'toolbox')" />
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
const inputToolbox = ref(null)
const loading = ref(false)

const triggerInput = (tipo) => {
  if (tipo === 'now') inputNow.value.click()
  if (tipo === 'cdl') inputCdl.value.click()
  if (tipo === 'caducados') inputCaducados.value.click()
  if (tipo === 'toolbox') inputToolbox.value.click()
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
    else if (tipo === 'toolbox') url = '/api/logistica/importar-toolbox'
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

.btn-xl {
  min-width: 260px;
  height: 50px;
  font-size: 16px;
}
</style>
