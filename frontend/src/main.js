import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Login from './pages/Login.vue'
import Signup from './pages/Signup.vue'
import Users from './pages/Users.vue'

const routes = [
  { path: '/', component: Login },
  { path: '/signup', component: Signup },
  { path: '/users', component: Users }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('jwt')
  if (to.path === '/users' && !token) return next('/')
  next()
})

createApp(App).use(router).mount('#app')
