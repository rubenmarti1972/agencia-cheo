# 🎰 Agencia Cheo - Plataforma de Apuestas Venezuela

Plataforma moderna de apuestas para Venezuela con **Angular 20** y **Strapi 5.30.1**. Incluye Loterías, Animalitos y Parley Deportivo.

## 🎨 Diseño

- **Paleta de colores verde 60/30/10** profesional
- Inspirado en [Guacharo Activo](https://www.guacharoactivo.com.ve/) y [Rushbet](https://www.rushbet.co/)
- Diseño responsive y mobile-first
- Animaciones suaves y UX intuitiva

## 🚀 Stack Técnico

### Frontend (Angular 20.3.x)
- **Angular CLI**: 20.3.8
- **TypeScript**: 5.9.3 (modo estricto, sin `any`)
- **RxJS**: 7.8.2
- **Zone.js**: 0.15.1
- Formularios reactivos
- Lazy loading modules
- Standalone components

### Backend (Strapi 5.30.1)
- **Node.js**: 20.19.5
- **TypeScript**: 5.9.3
- **SQLite**: Base de datos por defecto
- Content types personalizados
- Controladores y rutas custom
- Validaciones de negocio

## 📂 Estructura del Proyecto

```
agencia-cheo/
├── frontend/                    # Angular 20 Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/     # Componentes compartidos
│   │   │   │   ├── header/     # Navegación principal
│   │   │   │   └── home/       # Página de inicio
│   │   │   ├── models/         # Interfaces TypeScript
│   │   │   │   ├── strapi.model.ts
│   │   │   │   ├── lottery.model.ts
│   │   │   │   ├── animalitos.model.ts
│   │   │   │   ├── parley.model.ts
│   │   │   │   └── ticket.model.ts
│   │   │   ├── services/       # Servicios Angular
│   │   │   │   ├── api.service.ts
│   │   │   │   ├── lottery.service.ts
│   │   │   │   ├── animalitos.service.ts
│   │   │   │   ├── parley.service.ts
│   │   │   │   └── ticket.service.ts
│   │   │   ├── modules/        # Módulos lazy-loaded
│   │   │   │   ├── loterias/
│   │   │   │   ├── animalitos/
│   │   │   │   ├── parley/
│   │   │   │   ├── ticket/
│   │   │   │   └── resultados/
│   │   │   ├── app.config.ts
│   │   │   ├── app.routes.ts
│   │   │   └── app.ts
│   │   └── styles.scss         # Estilos globales + sistema de diseño
│   └── package.json
│
└── backend/                     # Strapi 5.30.1 Application
    ├── src/
    │   ├── api/
    │   │   ├── lottery/         # Loterías venezolanas
    │   │   ├── lottery-draw/    # Sorteos de loterías
    │   │   ├── lottery-bet/     # Apuestas de loterías
    │   │   ├── animalito/       # Catálogo de animalitos (1-36)
    │   │   ├── animalitos-game/ # Juegos de animalitos
    │   │   ├── animalitos-draw/ # Sorteos de animalitos
    │   │   ├── animalitos-bet/  # Apuestas de animalitos
    │   │   ├── sport/           # Deportes
    │   │   ├── team/            # Equipos
    │   │   ├── match/           # Partidos
    │   │   ├── market/          # Mercados de apuesta
    │   │   ├── parley-ticket/   # Tickets de parley
    │   │   ├── parley-leg/      # Selecciones del parley
    │   │   └── ticket/          # Búsqueda unificada de tickets
    │   ├── index.ts
    │   └── extensions/
    ├── config/
    │   ├── server.ts
    │   ├── database.ts
    │   └── admin.ts
    ├── database/                # SQLite DB
    ├── .env
    ├── package.json
    └── tsconfig.json
```

## 🎯 Funcionalidades

### 1. Loterías Venezolanas 🎟️
- **Content Types**: `lottery`, `lottery-draw`, `lottery-bet`
- Loterías configurables (Zulia, Triple Zulia, etc.)
- Sorteos con fecha y hora programada
- Apuestas a números (2-4 dígitos)
- Factor de pago configurable (70x típicamente)
- Cierre automático de apuestas antes del sorteo
- Estados: `open`, `closed`, `result_published`
- **Endpoint**: `POST /api/loterias/place-bet`

### 2. Animalitos 🐘
- **Content Types**: `animalito`, `animalitos-game`, `animalitos-draw`, `animalitos-bet`
- Catálogo fijo de 36 animalitos (Delfín, Elefante, etc.)
- Múltiples juegos por día (9am, 12pm, 4pm, 7pm)
- Sorteos diarios por juego
- Factor de pago configurable (30x típicamente)
- Estados: `open`, `closed`, `result_published`
- **Endpoint**: `POST /api/animalitos/place-bet`

### 3. Parley Deportivo ⚽
- **Content Types**: `sport`, `team`, `match`, `market`, `parley-ticket`, `parley-leg`
- Múltiples deportes (Béisbol, Fútbol, NBA, etc.)
- Equipos por deporte
- Partidos programados y en vivo
- Mercados variados:
  - Moneyline (victoria local/visitante)
  - Spread (hándicap)
  - Over/Under (altas/bajas)
  - Both Teams Score
  - Correct Score
- Parley con múltiples selecciones
- Cálculo automático de cuota total (producto de odds)
- Validación de selecciones (no duplicar partidos)
- **Endpoint**: `POST /api/parley/place-ticket`

### 4. Consulta de Tickets 🔍
- **Endpoint unificado**: `GET /api/ticket/:ticketCode`
- Busca en lottery-bet, animalitos-bet y parley-ticket
- Muestra estado: `pending`, `won`, `lost`, `void`
- Muestra ganancia potencial y pagada
- **Componente funcional implementado**

## 🎨 Sistema de Diseño

### Paleta de Colores (60/30/10)

```scss
// Verde Principal (60%)
--color-primary: #0D9F6E
--color-primary-light: #10B981
--color-primary-dark: #059669

// Verde Secundario (30%)
--color-secondary: #1B5E3F
--color-secondary-light: #236B4A
--color-secondary-dark: #134534

// Verde Acento (10%)
--color-accent: #4ADE80
--color-accent-light: #6EE7A0
--color-accent-dark: #22C55E
```

### Componentes UI Globales
- Botones: `.btn`, `.btn-primary`, `.btn-accent`, `.btn-outline`
- Cards: `.card`, `.card-highlight`
- Badges: `.badge`, `.badge-success`, `.badge-error`
- Formularios: estilizados globalmente
- Utilidades: spacing, typography, layout

## 🔧 Instalación y Configuración

### Requisitos Previos
- Node.js 20.19.5
- npm 6+

### 1. Instalar Frontend

```bash
cd frontend
npm install
```

### 2. Instalar Backend

```bash
cd backend
npm install
```

### 3. Configurar Backend

Edita `backend/.env`:

```env
HOST=0.0.0.0
PORT=1337

APP_KEYS=your-app-key-1,your-app-key-2
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret

DATABASE_FILENAME=data.db
```

### 4. Ejecutar Backend

```bash
cd backend
npm run develop
```

Strapi estará disponible en: http://localhost:1337

**Panel de administración**: http://localhost:1337/admin

### 5. Ejecutar Frontend

```bash
cd frontend
npm start
```

Angular estará disponible en: http://localhost:4200

## 📡 API Endpoints

### Loterías
- `GET /api/lotteries` - Listar loterías
- `GET /api/lottery-draws` - Listar sorteos
- `POST /api/loterias/place-bet` - Realizar apuesta

### Animalitos
- `GET /api/animalitos` - Catálogo de animalitos
- `GET /api/animalitos-games` - Juegos disponibles
- `POST /api/animalitos/place-bet` - Realizar apuesta

### Parley
- `GET /api/sports` - Listar deportes
- `GET /api/matches` - Listar partidos
- `GET /api/markets` - Listar mercados
- `POST /api/parley/place-ticket` - Crear ticket parley

### Tickets
- `GET /api/ticket/:ticketCode` - Consultar ticket (unificado)

## 🔒 Validaciones de Negocio

### Backend (Strapi)
1. **Loterías**:
   - Lotería debe estar activa
   - Sorteo debe estar en estado `open`
   - No debe haber pasado la hora de cierre
   - Monto entre mínimo y máximo configurado

2. **Animalitos**:
   - Juego debe estar activo
   - Animalito debe estar entre 1 y 36
   - No debe haber pasado la hora de cierre
   - Monto entre mínimo y máximo configurado

3. **Parley**:
   - Mínimo 2 selecciones
   - Todos los mercados deben estar activos
   - Partidos deben estar en `scheduled` o `live`
   - No se permiten múltiples selecciones del mismo partido

### Frontend (Angular)
- Validaciones de formularios reactivos
- Tipos estrictos (sin `any`)
- Manejo de errores HTTP
- Estados de carga (loading)

## 📊 Modelos de Datos

Todos los modelos están completamente tipados en TypeScript:

- `frontend/src/app/models/strapi.model.ts` - Tipos genéricos de Strapi
- `frontend/src/app/models/lottery.model.ts` - Loterías
- `frontend/src/app/models/animalitos.model.ts` - Animalitos
- `frontend/src/app/models/parley.model.ts` - Parley
- `frontend/src/app/models/ticket.model.ts` - Tickets

## 🚧 Estado del Proyecto

### ✅ Completado
- [x] Configuración del proyecto (frontend + backend)
- [x] Sistema de diseño completo (paleta verde 60/30/10)
- [x] Backend Strapi 5.30.1 configurado
- [x] Todos los content types creados (13 tipos)
- [x] Controladores y rutas custom
- [x] Interfaces TypeScript completas
- [x] Servicios Angular (5 servicios)
- [x] Layout principal con navegación
- [x] Routing con lazy loading
- [x] Módulo de consulta de tickets (funcional)

### 🚧 En Progreso
- [ ] Componentes de Loterías (placeholder creado)
- [ ] Componentes de Animalitos (placeholder creado)
- [ ] Componentes de Parley (placeholder creado)
- [ ] Componentes de Resultados (placeholder creado)

### 📋 Pendiente
- [ ] Formularios completos de apuesta
- [ ] Integración completa con backend
- [ ] Manejo de estados de ticket
- [ ] Sistema de autenticación/usuarios
- [ ] Panel de administración personalizado
- [ ] Reportes y estadísticas
- [ ] Notificaciones en tiempo real
- [ ] Tests unitarios y E2E

## 💡 Próximos Pasos

1. **Implementar formularios de apuesta**:
   - Formulario de lotería con validaciones
   - Selector de animalitos visual
   - Constructor de parley multi-selección

2. **Integración con backend**:
   - Conectar servicios con Strapi
   - Manejo de respuestas
   - Actualización de estados

3. **Mejorar UX**:
   - Loader states
   - Mensajes de éxito/error
   - Confirmaciones de apuesta

4. **Panel de administración**:
   - Publicar resultados
   - Gestionar sorteos
   - Ver apuestas por fecha

## 📝 Convenciones de Código

### TypeScript
- **Modo estricto**: `strict: true`
- **Sin `any`**: Usar tipos específicos siempre
- **Interfaces**: PascalCase (ej: `LotteryBet`)
- **Servicios**: Suffix `Service` (ej: `LotteryService`)

### Angular
- **Componentes**: Standalone components
- **Lazy loading**: Para todos los módulos
- **Inject function**: Preferido sobre constructor injection
- **Signals**: Para estado reactivo

### Strapi
- **Content types**: kebab-case (ej: `lottery-bet`)
- **Relaciones**: Siempre definir `inversedBy`
- **Validaciones**: En controladores custom
- **No usar `any`**: Tipos explícitos

## 🤝 Contribuir

Para contribuir al proyecto:

1. Crea un branch desde `main`
2. Implementa tu funcionalidad
3. Sigue las convenciones de código
4. No uses `any` en TypeScript
5. Crea un pull request

## 📄 Licencia

Este proyecto es privado y confidencial.

## 👥 Equipo

- **Diseñador Gráfico Senior**: Diseño UI/UX profesional
- **Desarrollador Angular Senior**: Frontend Angular 20
- **Desarrollador Backend**: Strapi 5.30.1

---

**¡Listo para ganar! 🎰💰**

Para cualquier duda, revisa la documentación de:
- [Angular 20](https://angular.dev/)
- [Strapi 5](https://docs.strapi.io/)
- [RxJS 7](https://rxjs.dev/)
