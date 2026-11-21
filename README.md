# Sistema Académico ITI — Frontend (Módulo de Materias y Estudiantes)

Aplicación web desarrollada en **React.js + Vite** para la gestión académica del Instituto Tecnológico ITI, integrando consumo de API REST con **Axios**, enrutamiento con **React Router** y estilos con **Bootstrap 5**.

## Funcionalidades principales

- **Autenticación y navegación:** Inicio de sesión y menú lateral con acceso a *Inicio*, *Estudiantes* y *Materias*.
- **Gestión de Estudiantes:** Listado, registro, edición y eliminación con validaciones de campos únicos y créditos enteros positivos.
- **Gestión de Materias (CRUD completo):**
  - Listado dinámico desde la API (`GET /api/materias`).
  - Registro de nuevas materias (`POST /api/materias`) con validación de código único, campos obligatorios, créditos enteros positivos y estado (`Activo` / `Inactivo`).
  - Edición de materias (`PUT /api/materias/:codigo`) con código bloqueado y alternancia entre tabla y formulario.
  - Eliminación con confirmación (`DELETE /api/materias/:codigo`) y actualización automática sin recargar la página.

## Tecnologías utilizadas

- React.js + Vite
- React Router DOM
- Axios
- Bootstrap 5 y Bootstrap Icons

## Instalación y ejecución local

1. **Clonar el repositorio e instalar dependencias:**
   ```bash
   npm install