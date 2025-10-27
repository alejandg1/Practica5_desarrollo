# Practica5 Frontend

Simple Vue 3 frontend (Vite) for Practica5 backend.

Run locally:

1. cd frontend
2. npm install
3. npm run dev

Environment:
- VITE_API_BASE default http://localhost:3000

Notes:
- Login stores JWT in localStorage under `jwt` and the `api` service attaches it automatically.
- Google Login link redirects straight to backend `/auth/google`. The backend must be configured with Google client id/secret and callback.
