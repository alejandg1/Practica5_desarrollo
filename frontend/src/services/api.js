import axios from 'axios'

// Compute base URL at runtime so browser clients call the host backend.
let base = import.meta.env.VITE_API_BASE || ''
try {
  // If VITE_API_BASE is empty or points to the docker service name 'app', prefer host origin
  if (!base || base.includes('://app')) {
    const proto = window.location.protocol
    const host = window.location.hostname
    base = `${proto}//${host}:3000`
  }
} catch (e) {
  base = import.meta.env.VITE_API_BASE || 'http://localhost:3000'
}

const api = axios.create({ baseURL: base })

// attach token
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('jwt')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

export default api
