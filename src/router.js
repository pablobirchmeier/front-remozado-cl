import { createRouter, createWebHistory } from 'vue-router';
import Login from './views/Login.vue';
import Clasificacion from './views/Clasificacion.vue';
//import DefaultLayout from './layouts/DefaultLayout.vue'; // 👈 Importa el layout

const routes = [
  {
    path: '/login',
    component: Login,
    meta: { guestOnly: true, layout: 'none' },
  },
  {
    path: '/',
    children: [
      {
        path: 'clasificacion',
        component: Clasificacion,
        meta: { requiresAuth: true },
      },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/login' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 👇 Guardia global para rutas protegidas
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else if (to.meta.guestOnly && token) {
    next('/clasificacion');
  } else {
    next();
  }
});

export default router;
