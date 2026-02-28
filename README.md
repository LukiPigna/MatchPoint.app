# 🎾 Reserva Tu Cancha

Aplicación web para gestión de reservas de canchas de pádel.  
Desarrollada por **Lucas Pignataro** desde cero para uso local y pruebas.

---

## Stack

| Capa     | Tecnología                            |
|----------|---------------------------------------|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS |
| Backend  | Node.js + Express 4 + TypeScript      |
| Auth     | JWT (jsonwebtoken) + bcryptjs         |
| Datos    | In-memory (reinicia con el servidor)  |

---

## Estructura del proyecto

```
reserva-tu-cancha/
├── backend/          # API REST (Express)
│   └── src/
│       ├── data/     # Base de datos en memoria + seed
│       ├── middleware/
│       ├── routes/
│       ├── types.ts
│       ├── constants.ts
│       └── index.ts  # Punto de entrada
│
├── frontend/         # SPA React
│   └── src/
│       ├── components/
│       ├── services/  # Cliente HTTP
│       ├── types/
│       ├── constants.ts
│       └── App.tsx
│
└── README.md
```

---

## Cómo correr localmente

### Requisitos

- Node.js 18+
- npm 9+

### 1. Backend (puerto 4000)

```bash
cd backend
npm install
npm run dev
```

### 2. Frontend (puerto 5173)

Abrí una segunda terminal:

```bash
cd frontend
npm install
npm run dev
```

### 3. Abrí el navegador

```
http://localhost:5173
```

---

## Cuentas de prueba

| Email              | Contraseña  | Rol    |
|--------------------|-------------|--------|
| ana@torres.com     | u2password  | Player |
| luis@fer.com       | u3password  | Player |
| marta@g.com        | u4password  | Player |
| carlos@rios.com    | u1password  | Owner  |

El rol **Owner** accede al panel de administración.

---

## Variables de entorno (opcionales)

El backend funciona sin ningún `.env`. Para personalizar, podés crear `backend/.env`:

```env
PORT=4000
JWT_SECRET=tu-clave-secreta-aqui
```

---

## Funcionalidades

- 🔐 Registro e inicio de sesión con JWT
- 🏟️ Selección de sede / venue
- 📅 Calendario y grilla de horarios
- ✅ Crear reservas públicas o privadas
- 👥 Unirse / abandonar reservas
- 🏆 Sistema de puntos por resultado
- 🛡️ Clubs con ranking
- 🎯 Torneos
- 📊 Leaderboard de jugadores y clubs
- 👤 Perfil editable con sistema de amigos
- 🛠️ Panel de administración (rol owner)

---

> **Nota:** Los datos son en memoria. Al reiniciar el servidor, vuelven al estado inicial de prueba.
