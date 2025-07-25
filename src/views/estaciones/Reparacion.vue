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
              :disabled="!macAddress.trim()"
              >Siguiente</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-stepper-window-item>

      <!-- Paso 2: Resultado de la Reparación -->
      <v-stepper-window-item :value="2">
        <v-card flat class="pa-2">
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
                v-if="hasPreviousRepair"
                type="info"
                variant="tonal"
                density="compact"
                icon="mdi-history"
                class="mt-2 pa-1"
              >
                <span class="text-caption"
                  >Equipo reparado 1 vez (28-06-2025).</span
                >
              </v-alert>
              <div v-if="hasPreviousObservations" class="observations-box mt-2">
                <p class="text-caption font-weight-medium">
                  Obs. anteriores:
                  <span class="font-weight-regular">Se cambiaron botones.</span>
                </p>
              </div>
            </v-col>
            <v-col
              cols="6"
              md="12"
              class="d-flex flex-column justify-center align-center"
            >
              <h3 class="text-subtitle-2 font-weight-medium mb-4 text-center">
                ¿Cuál fue el resultado?
              </h3>
              <div class="d-flex flex-column ga-8">
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
                v-if="hasPreviousRepair"
                type="info"
                variant="tonal"
                density="compact"
                icon="mdi-history"
                class="mt-2 pa-1"
              >
                <span class="text-caption"
                  >Equipo reparado 1 vez (28-06-2025).</span
                >
              </v-alert>
              <div v-if="hasPreviousObservations" class="observations-box mt-2">
                <p class="text-caption font-weight-medium">
                  Obs. anteriores:
                  <span class="font-weight-regular">Se cambiaron botones.</span>
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
                rows="2"
                hide-details
                no-resize
              />
            </v-col>
          </v-row>
          <v-card-actions class="justify-end pa-1 mt-1">
            <v-btn
              color="success"
              @click="submit"
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
  </v-stepper>
</template>

<script setup>
import { ref } from "vue";

// Estado del stepper
const currentStep = ref(1);
const maxStepReached = ref(1);
const hasPreviousRepair = ref(true);
const hasPreviousObservations = ref(true);
const reparacionExitosa = ref(false);
const canRepair = ref(0);
const macAddress = ref("");
const repairTypeExito = ref(0);
const repairTypeFracaso = ref(0);
const observations = ref("");

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

const emit = defineEmits(["submit"]);

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
  repairTypeExito.value = 0;
  nextStep();
};
const onLED = () => {
  repairTypeExito.value = 1;
  nextStep();
};
const onPCarga = () => {
  repairTypeExito.value = 2;
  nextStep();
};
const onBotones = () => {
  repairTypeExito.value = 3;
  nextStep();
};
const onNoInicia = () => {
  repairTypeFracaso.value = 0;
  nextStep();
};
const onSulfato = () => {
  repairTypeFracaso.value = 1;
  nextStep();
};
const onNoEnciende = () => {
  repairTypeFracaso.value = 2;
  nextStep();
};

const submit = () => {
  console.log({
    macAddress: macAddress.value,
    canRepair: canRepair.value,
    repairType: repairType.value,
    observations: observations.value,
  });
  emit("submit");
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
</style>
