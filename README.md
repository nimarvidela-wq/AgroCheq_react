# AgroCheq — Gestión Full Stack de Cheques

Aplicación web SPA desarrollada con **React (Vite)** y una **API REST en Node.js + Express** con persistencia local en archivo JSON, diseñada para el control, filtrado y seguimiento de vencimientos de cheques en empresas agropecuarias.

## Estructura del proyecto

```text
agrocheq-react/
├── backend/                  # API REST (Node.js + Express)
│   ├── data/
│   │   └── cheques.json      # Persistencia de datos en JSON
│   ├── src/
│   │   ├── controllers/      # Lógica CRUD y validaciones
│   │   ├── middlewares/      # Logger, manejo de 404 y errores 500
│   │   ├── routes/           # Definición de endpoints (/api/cheques)
│   │   └── index.js          # Punto de entrada del servidor
│   └── package.json
├── public/                   # Recursos estáticos
├── src/                      # Frontend (React)
│   ├── components/           # Componentes reutilizables (Sidebar, tarjetas, etiquetas)
│   ├── pages/                # Vistas principales (Inicio y Cheques)
│   └── App.jsx               # Estado global y consumo de la API
├── .env                      # Variables de entorno del frontend
└── package.json
```

## Requisitos previos

* Tener instalado **Node.js** (v18 o superior).

## Instalación y ejecución

Para ejecutar el sistema completo es necesario levantar **dos terminales en paralelo** (una para el backend y otra para el frontend).

### 1. Iniciar el Backend (Puerto 3000)

```bash
cd backend
npm install
npm run dev
```

El servidor quedará escuchando en `http://localhost:3000`. Se puede verificar ingresando a `http://localhost:3000/api/salud`.

### 2. Iniciar el Frontend (Puerto 5173)

En una segunda terminal, ubicado en la carpeta raíz (`agrocheq-react/`):

1. Crear un archivo `.env` en la raíz con la URL de la API:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```
2. Instalar dependencias y arrancar Vite:
   ```bash
   npm install
   npm run dev
   ```

Abrir en el navegador la dirección local indicada por Vite (por defecto `http://localhost:5173`).

## Endpoints principales de la API

| Método | Ruta | Descripción | Respuesta exitosa |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cheques` | Lista todos los cheques (admite `?banco=` y `?buscar=`) | `200 OK` |
| `GET` | `/api/cheques/:id` | Obtiene un cheque específico por su ID | `200 OK` |
| `POST` | `/api/cheques` | Valida y registra un nuevo cheque | `201 Created` |
| `PUT` | `/api/cheques/:id` | Actualiza los datos de un cheque existente | `200 OK` |
| `DELETE` | `/api/cheques/:id` | Elimina un cheque por su ID | `204 No Content` |