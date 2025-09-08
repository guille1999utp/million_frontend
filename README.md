# 🏠 Million properties - Plataforma Inmobiliaria

Una plataforma web moderna y elegante para la gestión y visualización de propiedades inmobiliarias, desarrollada con las últimas tecnologías web.

## 📋 Descripción del Proyecto

**Million properties** es una aplicación web completa que permite a los usuarios gestionar propiedades inmobiliarias, propietarios, imágenes y transacciones. La plataforma ofrece una experiencia de usuario fluida con animaciones suaves, diseño responsivo y una interfaz intuitiva.

### ✨ Características Principales

- 🏘️ **Gestión de Propiedades**: Crear, editar, eliminar y visualizar propiedades
- 👥 **Gestión de Propietarios**: Administrar información de propietarios con fotos
- 📸 **Galería de Imágenes**: Subir y gestionar múltiples imágenes por propiedad
- 📊 **Historial de Transacciones**: Registrar y seguir el historial de ventas/alquileres
- 🔍 **Búsqueda y Filtros**: Buscar propiedades por nombre, dirección y rango de precios
- 📱 **Diseño Responsivo**: Optimizado para dispositivos móviles y desktop
- 🎨 **Animaciones Fluidas**: Transiciones suaves con GSAP y Framer Motion

## 🚀 Cómo Ejecutar el Proyecto

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm, yarn, pnpm o bun

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/guille1999utp/million_frontend.git
   cd million_frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   # o
   pnpm install
   # o
   bun install
   ```

3. **Configurar variables de entorno**
   
   Crea un archivo `.env` en la raíz del proyecto con la siguiente configuración:
   
   ```env
   # URL de la API backend
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```
   
   **Nota**: Si estás usando la API de producción, cambia la URL por:
   ```env
   NEXT_PUBLIC_API_URL=https://api-million-htf4bghdfsd5eadt.canadacentral-01.azurewebsites.net/api
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   # o
   yarn dev
   # o
   pnpm dev
   # o
   bun dev
   ```

5. **Abrir en el navegador**
   
   Navega a [http://localhost:3000](http://localhost:3000) para ver la aplicación.

### Scripts Disponibles

```bash
npm run dev      # Ejecutar en modo desarrollo
npm run build    # Construir para producción
npm run start    # Ejecutar versión de producción
npm run lint     # Ejecutar linter
```

## 🛠️ Tecnologías Utilizadas

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Animaciones y UI
![GSAP](https://img.shields.io/badge/GSAP-3.13.0-88CE02?style=for-the-badge&logo=greensock&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.23.12-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Lenis](https://img.shields.io/badge/Lenis-1.3.11-000000?style=for-the-badge)

### Componentes UI
![Radix UI](https://img.shields.io/badge/Radix_UI-1.1.15-161618?style=for-the-badge&logo=radix-ui&logoColor=white)
![Lucide React](https://img.shields.io/badge/Lucide_React-0.542.0-FF6B6B?style=for-the-badge)

### Formularios y Validación
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-7.62.0-EC5990?style=for-the-badge&logo=react-hook-form&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-4.1.5-3E67B1?style=for-the-badge&logo=zod&logoColor=white)

### Notificaciones
![Sonner](https://img.shields.io/badge/Sonner-2.0.7-000000?style=for-the-badge)
![React Hot Toast](https://img.shields.io/badge/React_Hot_Toast-2.6.0-FF6B6B?style=for-the-badge)

### Herramientas de Desarrollo
![ESLint](https://img.shields.io/badge/ESLint-9.0-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![PostCSS](https://img.shields.io/badge/PostCSS-4.0-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white)

## 🏗️ Arquitectura del Proyecto

```
src/
├── app/                    # Páginas de la aplicación (App Router)
│   ├── (landing)/         # Página principal
│   ├── owner/             # Gestión de propietarios
│   ├── properties/        # Listado de propiedades
│   └── property/          # Detalles y creación de propiedades
├── components/            # Componentes reutilizables
│   ├── Property/          # Componentes específicos de propiedades
│   ├── ui/                # Componentes base de UI
│   └── ...                # Otros componentes
├── hooks/                 # Custom hooks
├── services/              # Servicios de API
├── interfaces/            # Tipos TypeScript
└── lib/                   # Utilidades y configuración
```

## ⚙️ Configuración de Variables de Entorno

La aplicación utiliza variables de entorno para configurar la conexión con la API backend.

### Variables Requeridas

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `NEXT_PUBLIC_API_URL` | URL base de la API backend | `http://localhost:3001/api` |

### Configuración para Desarrollo

```env
# .env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Configuración para Producción

```env
# .env
NEXT_PUBLIC_API_URL=https://api-million-htf4bghdfsd5eadt.canadacentral-01.azurewebsites.net/api
```

### Importante

- El archivo `.env` debe estar en la raíz del proyecto
- Las variables que empiezan con `NEXT_PUBLIC_` son accesibles en el cliente
- No incluyas el archivo `.env` en el control de versiones (ya está en `.gitignore`)

## 🔌 API Integration

La aplicación se conecta a una API REST externa para la gestión de datos:

- **Base URL**: Configurable via `NEXT_PUBLIC_API_URL`
- **Endpoints principales**:
  - `GET/POST/PUT/DELETE /Owner` - Gestión de propietarios
  - `GET/POST/PUT/DELETE /Property` - Gestión de propiedades
  - `POST /PropertyImage/upload` - Subida de imágenes
  - `POST/DELETE /PropertyTrace` - Gestión de transacciones

## 🎨 Características de Diseño

- **Diseño Moderno**: Interfaz limpia y minimalista
- **Animaciones Suaves**: Transiciones fluidas con GSAP
- **Scroll Suave**: Implementado con Lenis
- **Responsive Design**: Adaptable a todos los dispositivos
- **Tema Oscuro**: Paleta de colores elegante y profesional

## 📱 Funcionalidades

### Para Usuarios
- ✅ Visualizar propiedades destacadas en la página principal
- ✅ Buscar y filtrar propiedades
- ✅ Ver detalles completos de propiedades
- ✅ Navegación intuitiva y responsive

### Para Administradores
- ✅ Crear y gestionar propietarios
- ✅ Crear propiedades con múltiples imágenes
- ✅ Registrar historial de transacciones
- ✅ Editar y eliminar propiedades
- ✅ Subir y gestionar imágenes

## 🚀 Despliegue

Para desplegar en producción:

```bash
npm run build
npm run start
```

O utiliza plataformas como Vercel, Netlify o cualquier servicio de hosting compatible con Next.js.

