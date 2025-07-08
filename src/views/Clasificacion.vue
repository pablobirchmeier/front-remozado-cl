<template>
  <div class="Clasificacion">
    <h2>Escanée equipo</h2>
    <form @submit.prevent="escanear">
      <input type="text" v-model="mac" placeholder="MAC address" required />
      <button type="submit">Escanear</button>
    </form>
    <p v-if="error" style="color: red;">{{ error }}</p>
    <p v-if="mensaje" style="color: green;">{{ mensaje }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mac: '',
      error: '',
      mensaje: '',
    };
  },
  methods: {
    async escanear() {
      this.error = '';
      this.mensaje = '';

      try {
        const response = await fetch(
          `http://localhost:8000/api/clasificacion/registrar-entrada?mac=${encodeURIComponent(this.mac)}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`, // si usas Sanctum con token
            },
          }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Error en la clasificación');
        }

        const data = await response.json();
        this.mensaje = data.message || 'Equipo registrado correctamente';
        this.mac = '';
      } catch (err) {
        this.error = err.message;
      }
    },
  },
};
</script>
