<template>
  <v-container class="text-center pa-8">
    <v-tabs v-model="tab" align-tabs="center" class="mb-6">
      <v-tab value="importar">Importar</v-tab>
      <v-tab value="exportar">Exportar</v-tab>
    </v-tabs>

    <!-- IMPORTAR -->
    <div v-if="tab === 'importar'">
      <p class="text-subtitle-1 mb-8">Importe archivo según corresponda</p>

      <v-row justify="center" align="center" class="mb-4">
        <v-col cols="12" md="4" class="d-flex justify-center">
          <v-btn class="btn-xl" color="blue" dark @click="triggerInput('now')">
            ENTREGA NOW <v-icon end class="ml-2">mdi-upload</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" md="4" class="d-flex justify-center">
          <v-btn class="btn-xl" color="blue" dark @click="triggerInput('cdl')">
            ENTREGA CDL <v-icon end class="ml-2">mdi-upload</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-row justify="center" align="center">
        <v-col cols="12" md="4" class="d-flex justify-center">
          <v-btn class="btn-xl" color="blue" dark @click="triggerInput('caducados')">
            ARCHIVO CADUCADOS <v-icon end class="ml-2">mdi-upload</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" md="4" class="d-flex justify-center">
          <v-btn class="btn-xl" color="blue" dark @click="triggerInput('toolbox')">
            ARCHIVO TOOLBOX <v-icon end class="ml-2">mdi-upload</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <!-- Inputs ocultos -->
      <input ref="inputNow" type="file" accept=".xls,.xlsx" class="d-none" @change="handleFileUpload($event, 'now')" />
      <input ref="inputCdl" type="file" accept=".xls,.xlsx,.csv" class="d-none" @change="handleFileUpload($event, 'cdl')" />
      <input ref="inputCaducados" type="file" accept=".csv" class="d-none" @change="handleFileUpload($event, 'caducados')" />
      <input ref="inputToolbox" type="file" accept=".csv" class="d-none" @change="handleFileUpload($event, 'toolbox')" />
    </div>

    <!-- EXPORTAR -->
    <div v-if="tab === 'exportar'">
      <v-btn class="btn-xl" color="green" dark @click="dialog = true">
        ARCHIVO MATRIZ <v-icon end class="ml-2">mdi-download</v-icon>
      </v-btn>

      <v-dialog v-model="dialog" max-width="400">
        <v-card>
          <v-card-title class="text-h6">Seleccionar mes</v-card-title>
          <v-card-text>
            <v-select
              v-model="mesSeleccionado"
              :items="meses"
              label="Mes"
              item-title="label"
              item-value="value"
              return-object
            />
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text @click="dialog = false">Cancelar</v-btn>
            <v-btn color="primary" @click="descargarArchivoMatriz">Aceptar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <!-- Overlay -->
    <v-overlay :model-value="loading" persistent class="align-center justify-center">
      <v-progress-circular indeterminate size="64" color="primary" />
    </v-overlay>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

const tab = ref('importar')
const inputNow = ref(null)
const inputCdl = ref(null)
const inputCaducados = ref(null)
const inputToolbox = ref(null)
const loading = ref(false)
const dialog = ref(false)
const mesSeleccionado = ref(null)

const meses = [
  { label: 'Enero', value: 1 }, { label: 'Febrero', value: 2 }, { label: 'Marzo', value: 3 },
  { label: 'Abril', value: 4 }, { label: 'Mayo', value: 5 }, { label: 'Junio', value: 6 },
  { label: 'Julio', value: 7 }, { label: 'Agosto', value: 8 }, { label: 'Septiembre', value: 9 },
  { label: 'Octubre', value: 10 }, { label: 'Noviembre', value: 11 }, { label: 'Diciembre', value: 12 },
]

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

    await axios.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    loading.value = false
    await Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: `Archivo ${tipo.toUpperCase()} subido correctamente`,
      confirmButtonColor: '#3085d6',
    })
  } catch (error) {
    loading.value = false
    await Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: `Hubo un problema al subir archivo ${tipo.toUpperCase()}`,
      confirmButtonColor: '#d33',
    })
  } finally {
    loading.value = false
    event.target.value = ''
  }
}

const descargarArchivoMatriz = async () => {
  if (!mesSeleccionado.value) return
  loading.value = true

  try {
    const response = await axios.post(
      '/api/logistica/exportar-archivo-matriz',
      { mes: mesSeleccionado.value.value },
      { responseType: 'blob' }
    )

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `archivo_matriz_mes_${mesSeleccionado.value.value}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()

    dialog.value = false
    loading.value = false
    await Swal.fire({
      icon: 'success',
      title: '¡Descarga lista!',
      text: 'Archivo exportado correctamente',
      confirmButtonColor: '#3085d6',
    })
  } catch (error) {
    loading.value = false
    await Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: 'Hubo un problema al generar el archivo',
      confirmButtonColor: '#d33',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.d-none {
  display: none;
}

.btn-xl {
  min-width: 260px;
  height: 50px;
  font-size: 16px;
}
</style>
