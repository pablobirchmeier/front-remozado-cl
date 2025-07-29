<template>
  <v-container fluid class="pa-4">
    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <div class="loading-content">
        <v-progress-circular
          indeterminate
          size="64"
          color="primary"
        ></v-progress-circular>
        <p class="text-h6">Cargando estaciones de trabajo...</p>
      </div>
    </div>

    <!-- Contenido principal cuando ya cargó -->
    <div v-else>
      <!-- Header con filtros -->
      <div class="d-flex justify-space-between align-center mb-4">
        <v-select
          v-model="filtroEstado"
          :items="opcionesFiltro"
          item-title="texto"
          item-value="valor"
          label="Filtrar por estado"
          style="max-width: 220px"
          density="comfortable"
          hide-details
        />
        <div class="d-flex ga-2">
          <v-chip
            color="success"
            variant="tonal"
            size="default"
            prepend-icon="mdi-check-circle"
          >
            {{ estacionesActivas }} Activas
          </v-chip>
          <v-chip
            color="primary"
            variant="tonal"
            size="default"
            prepend-icon="mdi-account-group"
          >
            {{ totalEmpleados }} Empleados
          </v-chip>
        </div>
      </div>

      <!-- Tabla principal -->
      <v-data-table
        :headers="headers"
        :items="estacionesFiltradas"
        class="elevation-1"
        items-per-page="5"
        :search="busqueda"
        no-data-text="No hay estaciones disponibles"
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
        <!-- nombre con icono -->
        <template v-slot:item.nombre="{ item }">
          <div class="d-flex align-center">
            <v-icon :color="getIconColor(item)" size="20" class="mr-3">
              {{ getStationIcon(item.nombre) }}
            </v-icon>
            <span class="font-weight-medium">
              {{ item.nombre }}
            </span>
          </div>
        </template>

        <!-- empleados  -->
        <template v-slot:item.cantidad_empleados="{ item }">
          <div class="d-flex align-center justify-center">
            <v-chip
              :color="getEmployeeChipColor(item.cantidad_empleados)"
              size="small"
              variant="flat"
              class="font-weight-bold"
            >
              {{ item.cantidad_empleados }}
            </v-chip>
          </div>
        </template>

        <!-- estado -->
        <template v-slot:item.estado="{ item }">
          <v-chip
            :color="item.estado === 'activa' ? 'success' : 'error'"
            size="small"
            variant="tonal"
          >
            {{ item.estado }}
          </v-chip>
        </template>

        <!-- acciones -->
        <!-- <template v-slot:item.acciones="{ item }">
        <div class="d-flex align-center justify-center" style="gap: 8px">
          <v-btn icon density="compact" size="32" color="primary">
            <v-icon size="16">mdi-eye</v-icon>
          </v-btn>
          <v-btn icon density="compact" size="32" color="black">
            <v-icon size="16">mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon density="compact" size="32" color="grey">
            <v-icon size="16">mdi-dots-vertical</v-icon>
          </v-btn>
        </div>
      </template> -->
      </v-data-table>

      <!-- Footer -->
      <div class="d-flex justify-end text-caption text-medium-emphasis mt-4">
        © 2025 Amerinode.
      </div>
    </div>
    <!-- Cierre del div v-else -->
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "@/lib/axios";

const estaciones = ref([]);
const busqueda = ref("");
const loading = ref(true);

// Filtrado similar a Usuarios.vue
const filtroEstado = ref("activa");

const opcionesFiltro = [
  { texto: "Todas", valor: null },
  { texto: "Activas", valor: "activa" },
  { texto: "Inactivas", valor: "inactiva" },
];

const estacionesFiltradas = computed(() => {
  if (filtroEstado.value === null) return estaciones.value;
  return estaciones.value.filter(
    (estacion) => estacion.estado === filtroEstado.value
  );
});

// Headers de la tabla siguiendo el estilo de Usuarios.vue
const headers = [
  {
    title: "Estación",
    key: "nombre",
    sortable: true,
  },
  {
    title: "Personal",
    key: "cantidad_empleados",
    sortable: true,
    align: "center",
  },
  {
    title: "Estado",
    key: "estado",
    sortable: true,
    align: "center",
  },
  // {
  //   title: "Acciones",
  //   key: "acciones",
  //   sortable: false,
  //   align: "center",
  // },
];

const estacionesActivas = computed(
  () => estaciones.value.filter((e) => e.estado === "activa").length
);

const totalEmpleados = computed(() =>
  estaciones.value.reduce(
    (total, estacion) => total + estacion.cantidad_empleados,
    0
  )
);

const getStationIcon = (nombre) => {
  const iconMap = {
    Logística: "mdi-truck-delivery",
    Clasificación: "mdi-sort-variant",
    Remozado: "mdi-hammer-wrench",
    "Lavado de equipos": "mdi-washing-machine",
    "Arme y desarme": "mdi-wrench",
    "Reparación electrónica": "mdi-cpu-64-bit",
    Testeo: "mdi-test-tube",
    Microscopio: "mdi-microscope",
    Kitting: "mdi-package-variant-closed",
    "Control Calidad (QC)": "mdi-clipboard-check",
    SCRAP: "mdi-delete-variant",
  };
  return iconMap[nombre] || "mdi-factory";
};

const getIconColor = (estacion) => {
  if (estacion.cantidad_empleados === 0) return "orange";
  if (estacion.cantidad_empleados >= 3) return "success";
  return "primary";
};

const getEmployeeChipColor = (empleados) => {
  if (empleados === 0) return "orange";
  if (empleados >= 3) return "success";
  if (empleados >= 2) return "warning";
  return "primary";
};

onMounted(async () => {
  try {
    loading.value = true;
    const response = await axios.get("/api/estaciones");
    console.log("Estaciones cargadas:", response.data);
    estaciones.value = response.data;
  } catch (error) {
    console.error("Error al cargar estaciones:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
.v-data-table {
  :deep(.v-data-table__tr:hover) {
    background-color: rgba(var(--v-theme-primary), 0.04) !important;
  }
}

.v-chip {
  font-weight: 500;
}

.v-btn {
  border-radius: 50%;
}

.loading-container {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-content {
  text-align: center;

  .v-progress-circular {
    margin-bottom: 1rem;
  }

  p {
    color: rgb(var(--v-theme-on-surface));
    opacity: 0.6;
  }
}
</style>
