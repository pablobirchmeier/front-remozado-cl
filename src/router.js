import { createRouter, createWebHistory } from 'vue-router';
import Login from './views/Login.vue';
import Clasificacion from './views/Clasificacion.vue';
//import Dashboard from './views/Dashboard.vue';
// Puedes seguir agregando más vistas
const routes = [
  { path: '/login', component: Login, meta: { guestOnly: true }, },
  { path: '/clasificacion', component: Clasificacion, meta: { requiresAuth: true } },
  { path: '/', redirect: '/login' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 👇 Guardia global para rutas protegidas
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  // Si requiere login y no hay token → redirige a /login
  if (to.meta.requiresAuth && !token) {
    next('/login');
  }

  // Si ya estás logeado e intentas ir a /login → redirige al dashboard
  else if (to.meta.guestOnly && token) {
    next('/clasificacion');
  }

  // Si todo bien, continúa
  else {
    next();
  }
});

export default router;
