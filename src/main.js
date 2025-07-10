import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router.js';
import axios from 'axios';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { useUserStore } from './stores/user'; // 👈 Asegúrate de importar el store
// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const vuetify = createVuetify({
  components,
  directives,
})

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.use(vuetify);
app.use(pinia);
app.use(router);
app.mount('#app');

// 👇 Este código debe ir después de app.use(pinia)
const userStore = useUserStore();
//userStore.validateToken().then((isValid) => {
//  if (!isValid) {
//    router.push('/login');
//  }
//});
