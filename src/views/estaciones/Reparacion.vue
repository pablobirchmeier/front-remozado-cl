<template>
  <v-stepper v-model="currentStep" alt-labels editable bg-color="surface">
    <!-- Cabecera del Stepper -->
    <v-stepper-header>
      <template v-for="(item, index) in stepperItems" :key="index">
        <v-stepper-item
          :value="index + 1"
          :editable="maxStepReached > index"
          :title="item"
          :subtitle="`Paso ${index + 1}`"
          :active="currentStep === index + 1"
          @click="goToStep(index + 1)"
          style="cursor: pointer"
        >
        </v-stepper-item>
        <v-divider v-if="index < stepperItems.length - 1" />
      </template>
    </v-stepper-header>

    <!-- Contenido de los Pasos -->
    <v-stepper-window v-model="currentStep" class="stepper-window-compact">
      <!-- Paso 1: Escanear MAC -->
      <v-stepper-window-item :value="1">
        <v-card flat>
          <v-card-text class="pa-2">
            <p class="text-subtitle-1 font-weight-medium mb-2">
              Escanée la serie MAC del equipo
            </p>
            <v-text-field
              v-model="macAddress"
              label="Serie MAC del equipo"
              variant="solo-filled"
              density="compact"
              clearable
              hide-details
            />
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn
              color="primary"
              @click="nextStep"
              variant="tonal"
              :append-icon="'$next'"
              :disabled="!macCorect"
              >Siguiente</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-stepper-window-item>

      <!-- Paso 2: Resultado  -->
      <v-stepper-window-item :value="2">
        <v-card flat class="1">
          <v-card-title class="text-subtitle-1 font-weight-bold pa-1">
            Registro de Reparación
          </v-card-title>
          <v-divider class="mb-2"></v-divider>
          <v-row dense>
            <v-col cols="6">
              <h3 class="text-subtitle-2 font-weight-medium mb-1">
                Información del Equipo
              </h3>
              <v-text-field
                v-model="macAddress"
                label="Serie MAC"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-barcode-scan"
                readonly
                hide-details
              ></v-text-field>
              <v-alert
                v-if="equipoInfo"
                type="success"
                variant="tonal"
                density="compact"
                icon="mdi-information-outline"
                class="mt-2 pa-1"
              >
                <span class="text-caption">{{ equipoInfo }}</span>
              </v-alert>
              <v-alert
                v-if="previousRepairInfo"
                :type="previousObservations ? 'info' : 'warning'"
                variant="tonal"
                density="compact"
                icon="mdi-history"
                class="mt-2 pa-1"
              >
                <span class="text-caption">{{ previousRepairInfo }}</span>
              </v-alert>
              <div v-if="previousObservations" class="observations-box mt-2">
                <p class="text-caption font-weight-medium">
                  Obs. anteriores:
                  <span class="font-weight-regular">{{
                    previousObservations
                  }}</span>
                </p>
              </div>
            </v-col>
            <v-col
              cols="6"
              class="d-flex flex-column justify-center align-center"
            >
              <h3 class="text-subtitle-2 font-weight-medium mb-4 text-center">
                ¿Cuál fue el resultado?
              </h3>
              <div class="d-flex flex-column ga-4">
                <v-btn
                  color="success"
                  size="small"
                  variant="flat"
                  @click="onSuccess"
                  prepend-icon="mdi-check-circle-outline"
                  block
                >
                  Exitoso
                </v-btn>

                <v-btn
                  color="error"
                  size="small"
                  variant="flat"
                  @click="onFailure"
                  prepend-icon="mdi-close-circle-outline"
                  block
                >
                  Fallido
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-stepper-window-item>

      <!-- Paso 3: Tipo de Reparación/Daño -->
      <v-stepper-window-item :value="3">
        <v-card flat class="pa-2">
          <v-card-title class="text-subtitle-1 font-weight-bold pa-1">
            Detalle de la Intervención
          </v-card-title>
          <v-divider class="mb-2"></v-divider>
          <v-row dense>
            <v-col cols="6">
              <h3 class="text-subtitle-2 font-weight-medium mb-1">
                Información del Equipo
              </h3>
              <v-text-field
                v-model="macAddress"
                label="Serie MAC"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-barcode-scan"
                readonly
                hide-details
              ></v-text-field>
              <v-alert
                v-if="equipoInfo"
                type="success"
                variant="tonal"
                density="compact"
                icon="mdi-information-outline"
                class="mt-2 pa-1"
              >
                <span class="text-caption">{{ equipoInfo }}</span>
              </v-alert>
              <v-alert
                v-if="previousRepairInfo"
                :type="previousObservations ? 'info' : 'warning'"
                variant="tonal"
                density="compact"
                icon="mdi-history"
                class="mt-2 pa-1"
              >
                <span class="text-caption">{{ previousRepairInfo }}</span>
              </v-alert>
              <div v-if="previousObservations" class="observations-box mt-2">
                <p class="text-caption font-weight-medium">
                  Obs. anteriores:
                  <span class="font-weight-regular">{{
                    previousObservations
                  }}</span>
                </p>
              </div>
            </v-col>
            <v-col
              cols="6"
              class="d-flex flex-column justify-center align-center"
            >
              <div
                v-if="reparacionExitosa"
                class="d-flex flex-column justify-center align-center ga-4"
              >
                <h3 class="text-subtitle-2 font-weight-medium mb-1">
                  Tipo de Reparación
                </h3>
                <v-row dense class="d-flex">
                  <v-col cols="12" sm="6">
                    <v-btn
                      color="green"
                      block
                      size="small"
                      variant="flat"
                      prepend-icon="mdi-ethernet-cable"
                      @click="onRJ45"
                      class="mb-3"
                    >
                      Cambio RJ-45
                    </v-btn>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-btn
                      color="purple"
                      block
                      size="small"
                      variant="flat"
                      prepend-icon="mdi-lightbulb-on-outline"
                      @click="onLED"
                      class="mb-3"
                    >
                      Cambio LED
                    </v-btn>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-btn
                      color="blue"
                      block
                      size="small"
                      variant="flat"
                      prepend-icon="mdi-power-plug-outline"
                      @click="onPCarga"
                      class="mt-3"
                    >
                      Cambio P.CARGA
                    </v-btn>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-btn
                      color="light-blue"
                      block
                      size="small"
                      variant="flat"
                      prepend-icon="mdi-gesture-tap-button"
                      @click="onBotones"
                      class="mt-3"
                    >
                      Cambio Botones
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
              <div
                v-else
                class="d-flex flex-column justify-center align-center ga-3"
              >
                <h3 class="text-subtitle-2 font-weight-medium mb-1">
                  ¿Cuál fue el tipo de daño?
                </h3>
                <v-row dense class="w-[500px]">
                  <v-col cols="12" sm="6">
                    <v-btn
                      color="red-darken-1"
                      block
                      size="small"
                      variant="flat"
                      prepend-icon="mdi-power-plug-off-outline"
                      @click="onNoInicia"
                      class="mb-3"
                    >
                      No Inicia
                    </v-btn>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-btn
                      color="blue-grey"
                      block
                      size="small"
                      variant="flat"
                      prepend-icon="mdi-water-off-outline"
                      @click="onSulfato"
                      class="mb-3"
                    >
                      Sulfatado
                    </v-btn>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-btn
                      color="orange-darken-2"
                      block
                      size="small"
                      variant="flat"
                      prepend-icon="mdi-alert-decagram-outline"
                      @click="onNoEnciende"
                      class="mt-3"
                    >
                      No enciende
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-stepper-window-item>

      <!-- Paso 4: Observaciones Finales -->
      <v-stepper-window-item :value="4">
        <v-card flat class="pa-2">
          <v-card-title class="text-subtitle-1 font-weight-bold pa-1">
            Observaciones Finales
          </v-card-title>
          <v-divider class="mb-2"></v-divider>
          <v-row dense>
            <v-col cols="6">
              <h3 class="text-subtitle-2 font-weight-medium mb-1">
                Información del Equipo
              </h3>
              <v-text-field
                v-model="macAddress"
                label="Serie MAC"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-barcode-scan"
                readonly
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <h3 class="text-subtitle-2 font-weight-medium mb-1">
                Añadir observaciones
              </h3>
              <v-textarea
                v-model="observations"
                label="Observaciones"
                variant="solo-filled"
                density="compact"
                rows="3"
                hide-details
              />
            </v-col>
          </v-row>
          <v-card-actions class="justify-end pa-1 mt-1">
            <v-btn
              color="success"
              @click="registrarResultado"
              size="small"
              variant="tonal"
              :append-icon="'$complete'"
              >Finalizar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-stepper-window-item>
    </v-stepper-window>

    <v-footer class="d-flex justify-end text-caption pa-0 bg-transparent">
      © 2025 Amerinode.
    </v-footer>

    <v-snackbar
      v-model="snackbar"
      :timeout="5000"
      :color="snackbarColor"
      location="bottom start"
      variant="tonal"
      rounded="lg"
      elevation="24"
    >
      <div class="d-flex align-center">
        <v-icon
          :icon="
            snackbarColor === 'success'
              ? 'mdi-check-circle'
              : 'mdi-alert-circle'
          "
          class="mr-3"
        />
        <span>{{ snackbarMensaje }}</span>
      </div>
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar = false"> Cerrar </v-btn>
      </template>
    </v-snackbar>
  </v-stepper>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "@/lib/axios";

// Estado del stepper
const currentStep = ref(1);
const maxStepReached = ref(1);
const equipoInfo = ref("");
const previousRepairInfo = ref("");
const previousObservations = ref("");
const reparacionExitosa = ref(false);
const canRepair = ref(0);
const macAddress = ref("");
const repairTypeExito = ref(0);
const repairTypeFracaso = ref(0);
const observations = ref("");
const error = ref("");

const snackbar = ref(false);
const snackbarMensaje = ref("");
const snackbarColor = ref("success");
const macCorect = ref(false);

const stepperItems = [
  "Identificación",
  "Resultado",
  "Detalle",
  "Observaciones",
];

// Función para avanzar al siguiente paso
const nextStep = () => {
  if (currentStep.value < stepperItems.length) {
    currentStep.value++;
    if (currentStep.value > maxStepReached.value) {
      maxStepReached.value = currentStep.value;
    }
  }
};

// Función para ir a un paso específico
const goToStep = (step) => {
  if (step <= maxStepReached.value) {
    currentStep.value = step;
  }
};

const onSuccess = () => {
  reparacionExitosa.value = true;
  canRepair.value = 1;
  nextStep();
};

const onFailure = () => {
  reparacionExitosa.value = false;
  canRepair.value = 0;
  nextStep();
};

const onRJ45 = () => {
  repairTypeExito.value = 1;
  nextStep();
};
const onLED = () => {
  repairTypeExito.value = 2;
  nextStep();
};
const onPCarga = () => {
  repairTypeExito.value = 3;
  nextStep();
};
const onBotones = () => {
  repairTypeExito.value = 4;
  nextStep();
};
const onNoInicia = () => {
  repairTypeFracaso.value = 1;
  nextStep();
};
const onSulfato = () => {
  repairTypeFracaso.value = 2;
  nextStep();
};
const onNoEnciende = () => {
  repairTypeFracaso.value = 3;
  nextStep();
};

const showSnackbar = (message, color = "success") => {
  snackbarMensaje.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
};

const verificarMacAddress = async () => {
  error.value = "";
  equipoInfo.value = "";
  const mac = macAddress.value.trim();
  try {
    const response = await axios.get("/api/reparacion/registrar-entrada", {
      params: { mac: mac },
    });

    const data = response.data;
    console.log("MAC verificada:", data);

    if (data.equipo) {
      equipoInfo.value = `Material: ${data.equipo.material} - Modelo: ${data.equipo.modelo}`;
    } else {
      equipoInfo.value = "";
    }

    if (data.resultado && data.resultado !== "[]") {
      let resultado;

      // Verificar si resultado es un string JSON o ya es un objeto
      if (typeof data.resultado === "string") {
        try {
          resultado = JSON.parse(data.resultado);
        } catch (parseError) {
          console.warn("Error al parsear resultado como JSON:", parseError);
          // Si no se puede parsear, asumir que no hay resultados anteriores
          previousRepairInfo.value =
            "No se encontraron reparaciones anteriores.";
          previousObservations.value = "";
          showSnackbar("Serie MAC verificada correctamente.", "success");
          macCorect.value = true;
          return;
        }
      } else {
        // Si ya es un objeto, usarlo directamente
        resultado = data.resultado;
      }

      const fecha = new Date(resultado.created_at).toLocaleDateString("es-CL");
      const tipo = resultado.exito
        ? resultado.tipo_reparacion
        : resultado.tipo_dano;
      previousRepairInfo.value = `Última reparación: ${fecha} - ${
        resultado.exito ? "Exitosa" : "Fallida"
      } (${tipo})`;
      previousObservations.value = resultado.observaciones;
    } else {
      previousRepairInfo.value = "No se encontraron reparaciones anteriores.";
      previousObservations.value = "";
    }

    showSnackbar("Serie MAC verificada correctamente.", "success");
    macCorect.value = true;
  } catch (err) {
    console.log("Error al verificar MAC:", err);
    showSnackbar(
      err.response?.data?.error || "Error al verificar la MAC.",
      "error"
    );
    equipoInfo.value = "";
    previousRepairInfo.value = "";
    previousObservations.value = "";
  }
};

watch(macAddress, (newValue) => {
  if (newValue && newValue.trim().length === 12) {
    verificarMacAddress();
  }
});

const resetState = () => {
  currentStep.value = 1;
  maxStepReached.value = 1;
  equipoInfo.value = "";
  previousRepairInfo.value = "";
  previousObservations.value = "";
  reparacionExitosa.value = false;
  canRepair.value = 0;
  macAddress.value = "";
  repairTypeExito.value = 0;
  repairTypeFracaso.value = 0;
  observations.value = "";
  macCorect.value = false;
};

const registrarResultado = async () => {
  const payload = {
    mac: macAddress.value,
    exito: canRepair.value,
    observaciones: observations.value,
  };

  if (reparacionExitosa.value) {
    payload.tipo_reparacion = repairTypeExito.value;
  } else {
    payload.tipo_dano = repairTypeFracaso.value;
  }

  try {
    const response = await axios.post(
      "/api/reparacion/registrar-resultado",
      payload
    );
    console.log("Resultado registrado:", response.data);
    showSnackbar(response.data.message, "success");
    resetState();
  } catch (error) {
    console.error("Error al registrar resultado:", error);
    showSnackbar(
      error.response?.data?.error || "Error al registrar resultado.",
      "error"
    );
  }
};
</script>

<style lang="scss" scoped>
.v-stepper {
  background: #f7f8fa;
  border-radius: 12px;
  padding: 0.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.v-stepper-item {
  padding: 0rem;
}

.v-stepper-window {
  margin: 0.5rem 1.5rem;
}

.stepper-window-compact {
  flex-grow: 1;
  overflow-y: auto;
}

:deep(.v-stepper-header) {
  box-shadow: none;
  padding: 0;
}

:deep(.v-stepper-item__avatar) {
  transition: all 0.3s ease;
}

:deep(.v-stepper-item--active .v-stepper-item__avatar) {
  background-color: rgb(var(--v-theme-primary));
  color: white;
  transform: scale(1.1);
}

:deep(.v-stepper-item--complete .v-stepper-item__avatar) {
  background-color: rgb(var(--v-theme-success));
  color: white;
}

.observations-box {
  background-color: #f0f2f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 4px 8px;
}

// Estilos responsivos para móvil vertical
@media screen and (max-width: 768px) and (orientation: portrait) {
  .v-stepper {
    padding: 0.25rem;
    border-radius: 8px;
  }

  .v-stepper-window {
    margin: 0.25rem 0.5rem;
  }

  // Mejorar el header del stepper en móvil vertical
  :deep(.v-stepper-header) {
    padding: 0.5rem 0.25rem;

    .v-stepper-item {
      min-width: auto;

      .v-stepper-item__title {
        font-size: 0.75rem;
        line-height: 1.2;
      }

      .v-stepper-item__subtitle {
        font-size: 0.65rem;
      }
    }
  }

  // Ajustes para el contenido de los pasos
  .v-card-text {
    padding: 0.75rem !important;
  }

  .v-card-title {
    font-size: 1rem !important;
    padding: 0.5rem !important;
  }

  // Mejorar las columnas en móvil vertical
  .v-row.dense {
    margin: -4px;

    .v-col {
      padding: 4px;

      // Solo en móvil vertical, cambiar las columnas a full width
      &[cols="6"] {
        flex: 0 0 100%;
        max-width: 100%;
      }
    }
  }

  // Contenedor específico para botones móviles - solo en vertical
  .v-stepper-window-item:nth-child(2) {
    .v-col:last-child {
      .d-flex.flex-column.ga-4 {
        gap: 0.75rem !important;
        width: 100%;
        max-width: 280px;
        margin: 0 auto;
      }
    }
  }

  // Paso 2 y 3: Reorganizar layout para móvil vertical
  .v-stepper-window-item:nth-child(2),
  .v-stepper-window-item:nth-child(3) {
    .v-row {
      .v-col:first-child {
        margin-bottom: 1rem;
      }

      .v-col:last-child {
        .d-flex.flex-column {
          gap: 0.75rem;
          align-items: center;
        }
      }
    }
  }

  // Ajustar botones para móvil vertical
  .v-btn {
    font-size: 0.8rem;
    min-height: 40px;
    padding: 0.5rem 1rem;

    &.v-btn--block {
      margin-bottom: 0.5rem;
      max-width: 100%;
    }
  }

  // Mejorar el grid de botones en paso 3
  .v-stepper-window-item:nth-child(3) {
    .v-row.dense {
      max-width: 320px;
      margin: 0 auto;

      .v-col {
        &[cols="12"] {
          .v-btn {
            padding: 0.75rem;
            margin-bottom: 0.75rem;
            min-height: 44px;
          }
        }
      }
    }
  }

  // Ajustar alertas y texto
  .v-alert {
    margin-top: 0.5rem !important;
    padding: 0.5rem !important;

    .text-caption {
      font-size: 0.7rem;
      line-height: 1.3;
    }
  }

  .observations-box {
    margin-top: 0.5rem;
    padding: 6px 8px;

    .text-caption {
      font-size: 0.7rem;
      line-height: 1.3;
    }
  }

  // Mejorar campos de texto
  .v-text-field,
  .v-textarea {
    .v-field__input {
      font-size: 0.85rem;
    }

    .v-field__label {
      font-size: 0.8rem;
    }
  }

  // Ajustar subtítulos
  .text-subtitle-1 {
    font-size: 0.9rem !important;
  }

  .text-subtitle-2 {
    font-size: 0.8rem !important;
  }

  // Mejorar las acciones de las tarjetas
  .v-card-actions {
    padding: 0.5rem !important;

    .v-btn {
      font-size: 0.8rem;
      padding: 0.5rem 1.5rem;
      min-height: 40px;
    }
  }

  // Footer responsive
  .v-footer {
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem !important;
  }

  // Snackbar responsive
  .v-snackbar {
    .v-snackbar__wrapper {
      font-size: 0.8rem;
    }
  }
}

// Mantener el diseño original en móvil horizontal
@media screen and (max-width: 768px) and (orientation: landscape) {
  .v-row.dense {
    .v-col {
      &[cols="6"] {
        flex: 0 0 50%;
        max-width: 50%;
      }
    }
  }

  // Mantener diseño horizontal para botones
  .v-stepper-window-item:nth-child(2) {
    .v-col:last-child {
      .d-flex.flex-column.ga-4 {
        gap: 1rem;
        max-width: none;
        margin: 0;
      }
    }
  }
}

// Media query específica para dispositivos muy pequeños (< 400px de ancho)
@media screen and (max-width: 400px) and (orientation: portrait) {
  .v-stepper {
    padding: 0.125rem;
  }

  .v-stepper-window {
    margin: 0.125rem 0.25rem;
  }

  :deep(.v-stepper-header) {
    .v-stepper-item {
      .v-stepper-item__title {
        font-size: 0.7rem;
      }

      .v-stepper-item__subtitle {
        font-size: 0.6rem;
      }
    }
  }

  .v-btn {
    font-size: 0.75rem;
    min-height: 32px;
    padding: 0 0.75rem;
  }

  .text-subtitle-1 {
    font-size: 0.85rem !important;
  }

  .text-subtitle-2 {
    font-size: 0.75rem !important;
  }
}
</style>
