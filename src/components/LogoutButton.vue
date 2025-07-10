<template>
  <button @click="handleLogout" class="btn-logout">
    Cerrar sesión
  </button>
  
</template>

<script setup>
import { useRouter } from 'vue-router';
import axios from '../lib/axios';

const router = useRouter();

async function handleLogout() {
  try {
    await axios.post('/api/logout');
    localStorage.removeItem('token');
    router.push('/login');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
}
</script>


<style scoped>
.btn-logout {
  cursor: pointer;
  background-color: #e53e3e;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
}
.btn-logout:hover {
  background-color: #c53030;
}
</style>
