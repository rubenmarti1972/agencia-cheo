# 🎰 Sistema de Scraping y Actualización Automática de Resultados

Sistema completo para obtener resultados de animalitos y loterías automáticamente, actualizar tickets y procesar pagos sin proveedores caros.

## 📋 Tabla de Contenidos

- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Componentes Principales](#componentes-principales)
- [APIs Disponibles](#apis-disponibles)
- [Configuración](#configuración)
- [Deployment en Producción](#deployment-en-producción)
- [Testing](#testing)
- [Mantenimiento](#mantenimiento)

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                      CRON SCHEDULER                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ 9:05 AM  │ │ 12:05 PM │ │ 4:05 PM  │ │ 7:05 PM  │      │
│  └─────┬────┘ └─────┬────┘ └─────┬────┘ └─────┬────┘      │
│        │            │            │            │             │
│        └────────────┴────────────┴────────────┘             │
│                           ↓                                  │
│                    RESULTS SERVICE                          │
│                           ↓                                  │
│        ┌──────────────────┴───────────────────┐            │
│        ↓                                       ↓            │
│   SCRAPERS                            STRAPI DATABASE       │
│  ┌─────────┐                          ┌──────────────┐     │
│  │Animalitos│ → [Playwright] → Parse → │ Update Draws │     │
│  │ Lottery  │                          └──────┬───────┘     │
│  └─────────┘                                  ↓             │
│                                    TICKETS UPDATER          │
│                                         ↓                    │
│                           ┌─────────────┴─────────────┐    │
│                           ↓                            ↓    │
│                   Mark Won/Lost            Calculate Payout │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Componentes Principales

### 1. **Scrapers** (`src/scrapers/`)

#### BaseScraper
Clase abstracta con funcionalidades comunes:
- ✅ Reintentos automáticos (3 intentos por defecto)
- ✅ Timeouts configurables (15 segundos)
- ✅ Fallback a múltiples fuentes
- ✅ Limpieza automática de recursos
- ✅ Validación de datos

#### AnimalitosScraper
Scraper especializado para animalitos:
```typescript
const result = await scrapeAnimalitos();
// Resultado:
{
  success: true,
  data: [
    {
      gameName: "Animalitos 12pm",
      winningNumber: 9, // 1-36
      drawDate: "2025-11-25",
      scheduledTime: "12:00:00"
    }
  ]
}
```

**Fuentes configuradas:**
- guacharoactivo.com.ve
- triplescandela.com
- triplesleones.com

**Características:**
- Normaliza nombres de juegos
- Valida rango 1-36
- Infiere horarios si no están disponibles

#### LotteryScraper
Scraper para loterías venezolanas:
```typescript
const result = await scrapeLotteries();
// Resultado:
{
  success: true,
  data: [
    {
      lotteryName: "Lotería del Zulia",
      winningNumber: "452",
      drawDate: "2025-11-25",
      drawTime: "13:00:00"
    }
  ]
}
```

**Fuentes configuradas:**
- guacharoactivo.com.ve
- triplescandela.com
- lagranjitaanimalitos.com

---

### 2. **Services** (`src/services/`)

#### ResultsService
Orquesta el proceso completo de scraping → guardar → actualizar:

```typescript
// Procesar todos los resultados
const result = await resultsService.processAllResults();

// Solo animalitos
await resultsService.processAnimalitoResults();

// Solo loterías
await resultsService.processLotteryResults();
```

**Flujo:**
1. Ejecuta scraping con fallback
2. Busca sorteo correspondiente en BD
3. Verifica que no esté ya procesado
4. Actualiza sorteo con resultado
5. Llama a TicketsUpdater

#### TicketsUpdaterService
Actualiza tickets después de publicar resultados:

```typescript
// Actualizar tickets de lotería
const result = await ticketsUpdater.updateLotteryTickets(drawId, "452");
// Retorna: { updated: 15, won: 3, lost: 12, totalPayout: 2700 }

// Actualizar tickets de animalitos
await ticketsUpdater.updateAnimalitosTickets(drawId, 9);

// Actualizar parleys después de un partido
await ticketsUpdater.updateParleyTicketsForMatch(matchId);
```

**Lógica de pagos:**
- Ganó: `paidAmount = potentialWin`
- Perdió: `paidAmount = 0`
- Parley: Gana solo si TODOS los legs ganan

---

### 3. **Cron Jobs** (`src/cron/`)

#### Programación de Jobs

**Job Principal (cada 5 minutos):**
```
Cron: */5 * * * *
Función: Revisa si hay nuevos resultados disponibles
```

**Jobs de Animalitos:**
```
09:05 AM → Revisa Animalitos 9am
12:05 PM → Revisa Animalitos 12pm
04:05 PM → Revisa Animalitos 4pm
07:05 PM → Revisa Animalitos 7pm
```

**Jobs de Loterías:**
```
01:10 PM → Revisa Loterías 1pm
04:10 PM → Revisa Loterías 4pm
07:10 PM → Revisa Loterías 7pm
```

**Timezone:** `America/Caracas` (VET)

#### Control de Cron Jobs

```bash
# Activar en desarrollo
export ENABLE_CRON=true

# En producción se activan automáticamente
NODE_ENV=production
```

---

## 🌐 APIs Disponibles

### 1. API de Resultados

#### GET `/api/results/today`
Retorna todos los resultados del día actual.

**Respuesta:**
```json
{
  "date": "2025-11-25",
  "animalitos": [
    {
      "game": "Animalitos 12pm",
      "winner": 9,
      "time": "2025-11-25T12:05:00.000Z"
    }
  ],
  "loterias": [
    {
      "name": "Lotería del Zulia",
      "winner": "452",
      "time": "2025-11-25T13:00:00"
    }
  ]
}
```

#### GET `/api/results/date/:date`
Resultados de una fecha específica.

**Ejemplo:**
```bash
curl http://localhost:1337/api/results/date/2025-11-20
```

#### POST `/api/results/scrape`
Ejecuta el scraping manualmente (útil para testing).

**Respuesta:**
```json
{
  "success": true,
  "animalitos": { "processed": 4, "updated": 2 },
  "lotteries": { "processed": 3, "updated": 1 },
  "errors": []
}
```

#### GET `/api/results/cron-status`
Estado de los cron jobs.

**Respuesta:**
```json
{
  "jobs": [
    { "name": "main-results-check", "running": true },
    { "name": "animalitos-9am", "running": true },
    { "name": "animalitos-12pm", "running": true }
  ],
  "total": 8,
  "running": 8
}
```

---

### 2. API de Consulta de Tickets

#### GET `/api/ticket/:ticketCode`
Busca un ticket en todas las tablas (lottery-bet, animalitos-bet, parley-ticket).

**Ejemplos:**

**Ticket de Lotería:**
```bash
curl http://localhost:1337/api/ticket/LOT-1732534567-A1B2C3D4
```

```json
{
  "type": "lottery",
  "ticketCode": "LOT-1732534567-A1B2C3D4",
  "status": "won",
  "amount": 5,
  "potentialWin": 150,
  "payout": 150,
  "details": {
    "betNumber": "452",
    "lottery": "Lotería del Zulia",
    "drawDate": "2025-11-25",
    "drawTime": "13:00:00",
    "winningNumber": "452"
  }
}
```

**Ticket de Animalitos:**
```json
{
  "type": "animalitos",
  "ticketCode": "ANI-1732534567-X1Y2Z3",
  "status": "lost",
  "amount": 3,
  "potentialWin": 90,
  "payout": 0,
  "details": {
    "animalito": {
      "number": 15,
      "name": "ZORRO"
    },
    "game": "Animalitos 12pm",
    "drawDate": "2025-11-25",
    "winningAnimalNumber": 9
  }
}
```

**Ticket de Parley:**
```json
{
  "type": "parley",
  "ticketCode": "PARLEY-1732534567-P1Q2R3",
  "status": "pending",
  "amount": 10,
  "potentialWin": 85,
  "payout": 0,
  "details": {
    "totalOdds": 8.5,
    "legs": [
      {
        "match": "Arsenal vs Chelsea",
        "market": "Moneyline",
        "selection": "Arsenal",
        "odds": 1.7,
        "status": "won"
      },
      {
        "match": "Barcelona vs Real Madrid",
        "market": "Over/Under 2.5",
        "selection": "Over",
        "odds": 2.0,
        "status": "pending"
      }
    ]
  }
}
```

---

## ⚙️ Configuración

### 1. Variables de Entorno

Crear `.env` en `/backend/`:

```bash
# Strapi
HOST=0.0.0.0
PORT=1337
APP_KEYS=<generar-claves>
API_TOKEN_SALT=<generar-salt>
ADMIN_JWT_SECRET=<generar-secret>
TRANSFER_TOKEN_SALT=<generar-salt>
JWT_SECRET=<generar-secret>

# Database
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Cron Jobs
NODE_ENV=production  # Activa cron automáticamente
ENABLE_CRON=true     # Para activar en desarrollo

# Playwright (opcional)
PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
```

### 2. Generar Secrets

```bash
# Generar claves aleatorias
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🚀 Deployment en Producción (Económico)

### Opción 1: Render.com (Recomendado)

**Costo: ~$7/mes (plan básico)**

1. **Crear cuenta en Render.com**

2. **Nuevo Web Service:**
   - Build Command: `npm install && npx playwright install --with-deps chromium && npm run build`
   - Start Command: `npm run start`
   - Environment: Node 20.19.5

3. **Variables de entorno:** (configurar en Render dashboard)
   ```
   NODE_ENV=production
   ENABLE_CRON=true
   (+ todas las variables de .env)
   ```

4. **Agregar buildpack para Playwright:**
   En `render.yaml`:
   ```yaml
   services:
     - type: web
       name: agencia-apuestas
       env: node
       buildCommand: npm install && npx playwright install --with-deps chromium && npm run build
       startCommand: npm run start
       envVars:
         - key: NODE_ENV
           value: production
   ```

5. **Persistence:**
   - Para SQLite: Usar volumen persistente de Render
   - Mejor: Migrar a PostgreSQL (plan gratuito disponible)

---

### Opción 2: Railway.app

**Costo: $5/mes (500 horas)**

1. **Conectar repo de GitHub**
2. **Auto-detecta Node.js**
3. **Agregar variables de entorno**
4. **Deploy automático**

---

### Opción 3: Fly.io

**Costo: Plan gratuito disponible (2GB RAM)**

1. **Instalar flyctl:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Crear app:**
   ```bash
   fly launch
   ```

3. **Configurar `fly.toml`:**
   ```toml
   app = "agencia-apuestas"

   [build]
     builder = "heroku/buildpacks:20"

   [env]
     NODE_ENV = "production"
     PORT = "1337"

   [[services]]
     internal_port = 1337
     protocol = "tcp"

     [[services.ports]]
       port = 80
   ```

4. **Deploy:**
   ```bash
   fly deploy
   ```

---

## 🧪 Testing

### 1. Testing Local

```bash
# Instalar dependencias
cd backend
npm install

# Instalar navegadores de Playwright
npx playwright install chromium

# Activar cron en desarrollo
export ENABLE_CRON=true

# Iniciar Strapi
npm run develop
```

### 2. Testing de Scrapers

```bash
# Ejecutar scraping manual desde la API
curl -X POST http://localhost:1337/api/results/scrape
```

### 3. Verificar Cron Jobs

```bash
# Ver estado de jobs
curl http://localhost:1337/api/results/cron-status
```

### 4. Simular Actualización de Tickets

**Crear sorteo de prueba y apuestas:**

```javascript
// Crear en Strapi Admin o via script
// 1. Crear sorteo abierto
// 2. Crear apuestas pendientes
// 3. Ejecutar scraping o actualizar manualmente
```

---

## 🔧 Mantenimiento

### Logs del Sistema

Los logs se imprimen en consola con formato:
```
[2025-11-25T12:05:34.123Z] [INFO] [AnimalitosScraper] Scraping exitoso
[2025-11-25T12:05:35.456Z] [INFO] [TicketsUpdater] Actualizando 15 tickets
[2025-11-25T12:05:36.789Z] [ERROR] [LotteryScraper] Error: Timeout
```

### Monitoreo de Cron Jobs

```bash
# Ver logs en Render/Railway/Fly
render logs --tail

# O verificar estado via API
curl https://tu-app.onrender.com/api/results/cron-status
```

### Actualizar Fuentes de Scraping

Si una fuente cambia su estructura HTML:

1. Editar `src/scrapers/animalitos.scraper.ts` o `lottery.scraper.ts`
2. Actualizar selectores en método `scrapeData()`
3. Probar localmente
4. Deploy

**Ejemplo:**
```typescript
// Antes
const numberEl = row.querySelector('.numero-ganador');

// Después (sitio cambió la clase)
const numberEl = row.querySelector('.winner-number, .numero-ganador');
```

### Agregar Nueva Fuente

En `animalitos.scraper.ts`:
```typescript
async scrapeAnimalitoResults() {
  const sources = [
    'https://guacharoactivo.com.ve/resultados',
    'https://triplescandela.com/resultados',
    'https://nuevafuente.com/resultados' // ← Agregar aquí
  ];

  return await this.scrapeWithFallback(sources);
}
```

---

## 📊 Estructura de Archivos

```
backend/
├── src/
│   ├── api/
│   │   ├── results/              ← API de resultados
│   │   │   ├── controllers/
│   │   │   │   └── results.ts
│   │   │   └── routes/
│   │   │       └── results.ts
│   │   └── ticket/               ← API de consulta de tickets
│   │       ├── controllers/
│   │       │   └── ticket.ts
│   │       └── routes/
│   │           └── ticket.ts
│   ├── scrapers/                 ← Scrapers de resultados
│   │   ├── base.scraper.ts       ← Clase base con reintentos
│   │   ├── animalitos.scraper.ts ← Scraper de animalitos
│   │   ├── lottery.scraper.ts    ← Scraper de loterías
│   │   └── index.ts
│   ├── services/                 ← Lógica de negocio
│   │   ├── results.service.ts    ← Orquesta scraping + BD
│   │   ├── tickets-updater.service.ts ← Actualiza tickets
│   │   └── index.ts
│   ├── cron/                     ← Cron jobs
│   │   ├── jobs.ts               ← Definición de jobs
│   │   └── scheduler.ts          ← Lifecycle management
│   ├── utils/
│   │   └── logger.ts             ← Logger centralizado
│   └── index.ts                  ← Bootstrap de Strapi
└── SCRAPING_SYSTEM.md            ← Esta documentación
```

---

## 🎯 Mejoras Futuras

1. **Notificaciones:**
   - Webhook cuando hay un ticket ganador grande
   - Email a administradores si scraping falla N veces

2. **Dashboard:**
   - Panel de admin para ver estado de scraping
   - Métricas de tickets ganadores/perdedores

3. **Caché:**
   - Redis para cachear resultados
   - Reducir carga en BD

4. **Múltiples Agencias:**
   - Multi-tenancy
   - Cada agencia con su configuración de cron

5. **Machine Learning:**
   - Detectar patrones de scraping fallidos
   - Auto-ajustar selectores si estructura HTML cambia

---

## 📞 Soporte

**Logs detallados:** Todos los eventos críticos se loguean con módulo, timestamp y datos.

**Testing de scraping:** Usar `POST /api/results/scrape` para probar sin esperar cron.

**Verificación de actualización:** Revisar campo `updatedAt` de sorteos y apuestas.

---

## ✅ Checklist de Deployment

- [ ] Variables de entorno configuradas
- [ ] Playwright instalado (`npx playwright install chromium`)
- [ ] NODE_ENV=production
- [ ] ENABLE_CRON=true
- [ ] Base de datos persistente configurada
- [ ] Primera ejecución manual de scraping exitosa
- [ ] Cron jobs verificados con `/api/results/cron-status`
- [ ] Logs monitoreados (primeras 24 horas)
- [ ] Backup de BD configurado

---

**Sistema listo para producción** 🚀

Costo total estimado: **$5-7/mes** (Render/Railway + PostgreSQL gratis)

Mantenimiento: **Mínimo** (todo es automático)

Escalabilidad: **Alta** (agregar fuentes o juegos es trivial)
