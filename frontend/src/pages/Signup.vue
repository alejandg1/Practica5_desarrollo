<template>
  <div>
    <h1>Sign up</h1>
    <form @submit.prevent="signup">
      <div>
        <label>Name</label>
        <input v-model="name" />
      </div>
      <div>
        <label>Email</label>
        <input v-model="email" type="email" />
      </div>
      <div>
        <label>Password</label>
        <input v-model="password" type="password" />
      </div>
      <button type="submit">Sign up</button>
    </form>
    <p>
      <router-link to="/">Back to login</router-link>
    </p>
  </div>
</template>

<script>
import api from '../services/api'
export default {
  data() {
    return {
      name: '',
      email: '',
      password: ''
    }
  },
  methods: {
    async signup() {
      try {
        await api.post('/users', { name: this.name, email: this.email, password: this.password })
        alert('User created, please login')
        this.$router.push('/')
      } catch (err) {
        alert('Signup failed')
      }
    }
  }
}
</script>

<style>
h1 { margin-bottom: 12px }
label { display: block; margin-top: 6px }
</style>
