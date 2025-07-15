import { createRouter, createWebHistory } from 'vue-router'
import Login from './views/Login.vue'
import Clasificacion from './views/estaciones/Clasificacion.vue'
import Logistica from './views/estaciones/Logistica.vue'
import Remozado from './views/estaciones/Remozado.vue'
import Lavado from './views/estaciones/Lavado.vue'
import ArmeYDesarme from './views/estaciones/ArmeYDesarme.vue'
import Reparacion from './views/estaciones/Reparacion.vue'
import Testeo from './views/estaciones/Testeo.vue'
import Microscopio from './views/estaciones/Microscopio.vue'
import Kitting from './views/estaciones/Kitting.vue'
import QC from './views/estaciones/QC.vue'
import Scrap from './views/estaciones/Scrap.vue'
import Usuarios from './views/administracion/Usuarios.vue'
import Informes from './views/administracion/Informes.vue'
import Estaciones from './views/administracion/EstacionDeTrabajo.vue'
import Equipos from './views/administracion/Equipos.vue'
import Productividad from './views/administracion/Productividad.vue'

// Pinia store
import { useUserStore } from './stores/user'
import EstacionDeTrabajo from './views/administracion/EstacionDeTrabajo.vue'

const routes = [
  {
    path: '/login',
    component: Login,
    meta: { guestOnly: true, layout: 'none' },
  },
  {
    path: '/clasificacion',
    component: Clasificacion,
    meta: {
      requiresAuth: true,
      estacionId: 2,
      title: 'Clasificación',
    },
  },
  {
    path: '/logistica',
    component: Logistica,
    meta: {
      requiresAuth: true,
      estacionId: 1,
      title: 'Logística / Recepción',
    },
  },
  {
    path: '/remozado',
    component: Remozado,
    meta: {
      requiresAuth: true,
      estacionId: 3,
      title: 'Remozado de equipos',
    },
  },
  {
    path: '/lavado',
    component: Lavado,
    meta: {
      requiresAuth: true,
      estacionId: 4,
      title: 'Lavado de equipos',
    },
  },
  {
    path: '/armeydesarme',
    component: ArmeYDesarme,
    meta: {
      requiresAuth: true,
      estacionId: 5,
      title: 'Arme y Desarme',
    },
  },
  {
    path: '/reparacion',
    component: Reparacion,
    meta: {
      requiresAuth: true,
      estacionId: 6,
      title: 'Reparación electrónica',
    },
  },
  {
    path: '/testeo',
    component: Testeo,
    meta: {
      requiresAuth: true,
      estacionId: 7,
      title: 'Testeo',
    },
  },
  {
    path: '/microscopio',
    component: Microscopio,
    meta: {
      requiresAuth: true,
      estacionId: 8,
      title: 'Microscopio',
    },
  },
  {
    path: '/kitting',
    component: Kitting,
    meta: {
      requiresAuth: true,
      estacionId: 9,
      title: 'Kitting',
    },
  },
  {
    path: '/qc',
    component: QC,
    meta: {
      requiresAuth: true,
      estacionId: 10,
      title: 'Control Calidad (QC)',
    },
  },
  {
    path: '/scrap',
    component: Scrap,
    meta: {
      requiresAuth: true,
      estacionId: 11,
      title: 'SCRAP',
    },
  },
  {
    path: '/usuarios',
    component: Usuarios,
    meta: {
      requiresAuth: true,
      estacionId: 12,
      title: 'Usuarios',
    },
  },
  {
    path: '/informes',
    component: Informes,
    meta: {
      requiresAuth: true,
      estacionId: 13,
      title: 'Informes',
    },
  },
  {
    path: '/productividad',
    component: Productividad,
    meta: {
      requiresAuth: true,
      estacionId: 14,
      title: 'Productividad',
    },
  },
  {
    path: '/estaciones-trabajo',
    component: Estaciones,
    meta: {
      requiresAuth: true,
      estacionId: 15,
      title: 'Estaciones de trabajo',
    },
  },
  {
    path: '/equipos',
    component: Equipos,
    meta: {
      requiresAuth: true,
      estacionId: 16,
      title: 'Equipos',
    },
  },
  {
    path: '/dashboard',
    component: Usuarios, // Puedes cambiar el componente si no corresponde
    meta: {
      requiresAuth: true,
      estacionId: 17,
      title: 'Dashboard',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]


const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 👮 Global guardia de navegación  
//import { useUserStore } from './stores/user' // Ajusta si tu path es diferente
//import { rutaDesdeEstacion } from './utils/estaciones' // Debes tener esta función definida

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userStore = useUserStore()
  const user = userStore.user

  // 🚫 No autenticado: redirige siempre a login
  if (!token && to.meta.requiresAuth) {
    return next('/login')
  }

  // ✅ Si ya está autenticado y entra a una ruta guestOnly (ej: /login)
  if (to.meta.guestOnly && token) {
    if (user?.role_id === 3) {
      // Operador: redirige a su estación correspondiente
      return next(`/${rutaDesdeEstacion(user.estacion_actual_id)}`)
    } else {
      // Admin o supervisor: van al dashboard
      return next('/dashboard')
    }
  }

  // 🔐 Protección por rol y estación
  if (to.meta.requiresAuth && user?.role_id === 3) {
    const rutaActualEsperada = `/${rutaDesdeEstacion(user.estacion_actual_id)}`

    // Si intenta moverse a otra ruta, lo mandamos a la suya
    if (to.path !== rutaActualEsperada) {
      return next(rutaActualEsperada)
    }
  }

  // ✅ Todo OK
  return next()
})


// 🧠 Utilidad para redirección desde estacion_actual_id
function rutaDesdeEstacion(estacionId) {
  switch (estacionId) {
    case 1: return 'logistica'
    case 2: return 'clasificacion'
    case 3: return 'remozado'
    case 4: return 'lavado'
    case 5: return 'armeydesarme'
    case 6: return 'reparacion'
    case 7: return 'testeo'
    case 8: return 'microscopio'
    case 9: return 'kitting'
    case 10: return 'qc'
    case 11: return 'scrap'
    default: return 'login'
  }
}

export default router
