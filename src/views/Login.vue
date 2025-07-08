<template>
  <div class="login">
    <h2>Iniciar sesión</h2>
    <form @submit.prevent="login">
      <input type="email" v-model="email" placeholder="Correo electrónico" required />
      <input type="password" v-model="password" placeholder="Contraseña" required />
      <button type="submit">Iniciar sesión</button>
    </form>
    <p v-if="error" style="color: red;">{{ error }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      error: '',
    };
  },
  methods: {
    async login() {
      try {
        const response = await fetch('http://localhost:8000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Error al iniciar sesión');
        }

        const data = await response.json();
        // Guardar el token en localStorage o sessionStorage
        localStorage.setItem('token', data.access_token);

        // Redirigir a otra página
        this.$router.push('/clasificacion');
      } catch (err) {
        this.error = err.message;
      }
    },
  },
};
</script>
