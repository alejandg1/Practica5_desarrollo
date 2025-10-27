<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div>
        <label>Email</label>
        <input v-model="email" type="email" />
      </div>
      <div>
        <label>Password</label>
        <input v-model="password" type="password" />
      </div>
      <button type="submit">Login</button>
    </form>
    <p>
      <router-link to="/signup">Sign up</router-link>
    </p>
    <p v-if="googleAvailable">
      <a :href="googleUrl">Login with Google</a>
    </p>
    <p v-else style="color:#b91c1c">Google login currently unavailable.</p>
  </div>
</template>

<script>
import api from '../services/api'
export default {
  data() {
    return { email: '', password: '', googleAvailable: false }
  },
  computed: {
    googleUrl() {
      // redirect to backend google auth
      return `${import.meta.env.VITE_API_BASE || 'http://localhost:3000'}/auth/google`
    }
  },
  methods: {
    async login() {
      try {
        const res = await api.post('/auth/login', { email: this.email, password: this.password })
        const token = res.data.token
        localStorage.setItem('jwt', token)
        this.$router.push('/users')
      } catch (err) {
        alert('Login failed')
      }
    }
  },
  async created() {
    try {
      const res = await api.get('/auth/status')
      this.googleAvailable = !!res.data.google
    } catch (err) {
      this.googleAvailable = false
    }
  }
}
</script>
