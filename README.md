# Practica4 - API con Node.js y MongoDB

## Requisitos
- Nodejs
- Docker y Docker Compose

## Instalación
1. Clona este repositorio:
   ```bash
   git clone https://github.com/alejandg1/Practica5_desarrollo.git
   ```
2. Ve al directorio del proyecto:
   ```bash
   cd practica5_desarrollo
   ```

## Ejecución
### Usando Docker Compose
1. Asegúrate de estar en el directorio raíz del proyecto.
2. Ejecuta el siguiente comando:
   ```bash
   docker-compose up
   ```
3. La API estará disponible en `http://localhost:3000`.

## Endpoints
- `POST /auth/login`: Inicia sesión y obtiene un token JWT.
- `POST /users`: Crea un nuevo usuario.
- `GET /users`: Obtiene todos los usuarios.
- `PUT /users/:id`: Actualiza un usuario por ID.
- `DELETE /users/:id`: Elimina un usuario por ID.