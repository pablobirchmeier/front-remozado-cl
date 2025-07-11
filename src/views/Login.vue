<template>
  <div class="login">
    <h2>Iniciar sesión</h2>
    <form @submit.prevent="login">
      <input
        type="email"
        v-model="email"
        placeholder="Correo electrónico"
        required
      />
      <input
        type="password"
        v-model="password"
        placeholder="Contraseña"
        required
      />
      <button type="submit">Iniciar sesión</button>
    </form>
    <p v-if="error" style="color: red;">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from '../lib/axios' // ✅ Asegúrate que esta instancia está bien configurada
import { useUserStore } from '../stores/user'

// Variables reactivas
const email = ref('')
const password = ref('')
const error = ref('')
const userStore = useUserStore()
// Router
const router = useRouter()

// Función de login
const login = async () => {
  error.value = ''
  try {
    const response = await axios.post('/api/login', {
      email: email.value,
      password: password.value,
    })

    userStore.setAuthData({
      user: response.data.user,
    })

    // Guardar token
    localStorage.setItem('token', response.data.access_token)

    // Redirección según estación_actual_id
    const estacionId = response.data.user.estacion_actual_id

    switch (estacionId) {
      case 1:
        router.push('/logistica')
        break
      case 2:
        router.push('/clasificacion')
        break
      case 3:
        router.push('/remozado')
        break
      case 4:
        router.push('/lavado')
        break
      case 5:
        router.push('/armeydesarme')
        break
      case 6:
        router.push('/reparacion')
        break
      case 7:
        router.push('/testeo')
        break
      case 8:
        router.push('/microscopio')
        break
      case 9:
        router.push('/kitting')
        break
      case 10:
        router.push('/qc')
        break
      case 11:
        router.push('/scrap')
        break
      default:
        router.push('/') // Ruta por defecto si no tiene estación
        break
    }

  } catch (err) {
    error.value = err.response?.data?.message || 'Error al iniciar sesión'
  }

}
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 80px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.login input {
  display: block;
  width: 100%;
  margin-bottom: 12px;
  padding: 8px;
  font-size: 16px;
}
.login button {
  width: 100%;
  padding: 10px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
