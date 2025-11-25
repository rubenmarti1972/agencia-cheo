# 🎰 Sistema de Scraping Automático - Quick Start

Sistema completo de scraping, actualización de tickets y procesamiento de pagos para agencia de apuestas.

## ✨ Características

- ✅ **Scraping automático** de animalitos y loterías (3 fuentes con fallback)
- ✅ **Actualización automática** de tickets (won/lost)
- ✅ **Cálculo de pagos** automático
- ✅ **Cron jobs** configurados (cada 5 min + horarios específicos)
- ✅ **APIs REST** para consultar resultados y tickets
- ✅ **TypeScript estricto** (sin `any`)
- ✅ **Económico** ($5-7/mes en Render.com)

---

## 🚀 Instalación Rápida

```bash
# 1. Instalar dependencias
npm install

# 2. Instalar navegador de Playwright
npx playwright install chromium

# 3. Configurar .env
cp .env.example .env
# Editar .env con tus valores

# 4. Activar cron en desarrollo (opcional)
export ENABLE_CRON=true

# 5. Iniciar Strapi
npm run develop
```

---

## 📡 APIs Disponibles

### Consultar Resultados del Día
```bash
curl http://localhost:1337/api/results/today
```

**Respuesta:**
```json
{
  "date": "2025-11-25",
  "animalitos": [
    { "game": "Animalitos 12pm", "winner": 9, "time": "..." }
  ],
  "loterias": [
    { "name": "Lotería del Zulia", "winner": "452", "time": "..." }
  ]
}
```

### Ejecutar Scraping Manual
```bash
curl -X POST http://localhost:1337/api/results/scrape
```

### Consultar Ticket
```bash
curl http://localhost:1337/api/ticket/LOT-1732534567-A1B2C3D4
```

**Respuesta:**
```json
{
  "type": "lottery",
  "ticketCode": "LOT-1732534567-A1B2C3D4",
  "status": "won",
  "amount": 5,
  "potentialWin": 150,
  "payout": 150,
  "details": { ... }
}
```

### Ver Estado de Cron Jobs
```bash
curl http://localhost:1337/api/results/cron-status
```

---

## 🧪 Testing

```bash
# Test básico de scraping
node scripts/test-scraping.js

# Probar scraping real via API
curl -X POST http://localhost:1337/api/results/scrape

# Ver estado de cron jobs
curl http://localhost:1337/api/results/cron-status
```

---

## 📂 Estructura de Archivos

```
backend/src/
├── scrapers/              # Scrapers con reintentos y fallback
│   ├── base.scraper.ts
│   ├── animalitos.scraper.ts
│   └── lottery.scraper.ts
│
├── services/              # Lógica de negocio
│   ├── results.service.ts      # Orquesta scraping + BD
│   └── tickets-updater.service.ts  # Actualiza tickets
│
├── cron/                  # Cron jobs (8 jobs programados)
│   ├── jobs.ts
│   └── scheduler.ts
│
├── api/
│   ├── results/           # API de resultados
│   └── ticket/            # API de consulta de tickets
│
└── utils/
    └── logger.ts          # Logger centralizado
```

---

## ⏰ Programación de Cron Jobs

| Job | Horario | Función |
|-----|---------|---------|
| **Main** | Cada 5 min | Revisa todos los resultados |
| **Animalitos 9am** | 9:05 AM | Scraping post-sorteo |
| **Animalitos 12pm** | 12:05 PM | Scraping post-sorteo |
| **Animalitos 4pm** | 4:05 PM | Scraping post-sorteo |
| **Animalitos 7pm** | 7:05 PM | Scraping post-sorteo |
| **Lotería 1pm** | 1:10 PM | Scraping loterías |
| **Lotería 4pm** | 4:10 PM | Scraping loterías |
| **Lotería 7pm** | 7:10 PM | Scraping loterías |

*Timezone: America/Caracas (VET)*

---

## 🚀 Deployment en Producción

### Render.com (~$7/mes)

1. **Crear cuenta:** [render.com](https://render.com)

2. **Nuevo Web Service:**
   - Repository: Tu repo de GitHub
   - Build Command:
     ```bash
     npm install && npx playwright install --with-deps chromium && npm run build
     ```
   - Start Command:
     ```bash
     npm run start
     ```

3. **Variables de entorno:**
   ```
   NODE_ENV=production
   ENABLE_CRON=true
   (+ todas las de .env)
   ```

4. **Deploy:** Push a GitHub → Auto-deploy

---

## 🔄 Flujo de Actualización Automática

```
1. Cron Job se ejecuta (ej: 12:05 PM)
           ↓
2. Scraper intenta 3 fuentes con reintentos
           ↓
3. Valida datos (rango 1-36, formato correcto)
           ↓
4. Busca sorteo abierto en BD
           ↓
5. Actualiza sorteo con resultado
           ↓
6. Busca todas las apuestas pendientes
           ↓
7. Compara: if (bet.number === winner) → won
           ↓
8. Calcula: paidAmount = potentialWin
           ↓
9. Guarda cambios en BD
           ↓
10. Logger reporta: wonCount, lostCount, totalPayout
```

---

## 📝 Variables de Entorno

```bash
# Strapi básico
HOST=0.0.0.0
PORT=1337
APP_KEYS=<generar-con-crypto>
API_TOKEN_SALT=<generar>
ADMIN_JWT_SECRET=<generar>
TRANSFER_TOKEN_SALT=<generar>
JWT_SECRET=<generar>

# Database (PostgreSQL)
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=agencia_cheo
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_SSL=false

# Cron
NODE_ENV=production  # Auto-activa cron
ENABLE_CRON=true     # Para desarrollo
```

### Generar Secrets
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🐛 Troubleshooting

### Cron jobs no ejecutan
```bash
# Verificar que estén activados
export ENABLE_CRON=true
# O en producción
NODE_ENV=production
```

### Scraping falla
```bash
# Test manual
curl -X POST http://localhost:1337/api/results/scrape

# Ver logs
npm run develop
# Buscar líneas con [ERROR] [AnimalitosScraper] o [LotteryScraper]
```

### Tickets no actualizan
```bash
# Verificar que el sorteo existe y está abierto/cerrado
# Verificar que las apuestas tienen status=pending
# Verificar que el resultado fue guardado correctamente
```

---

## 📚 Documentación Completa

Ver `SCRAPING_SYSTEM.md` para:
- Arquitectura detallada
- Guías de deployment
- Mantenimiento y monitoreo
- Agregar nuevas fuentes
- Mejoras futuras

---

## ✅ Checklist de Producción

- [ ] `npm install` ejecutado
- [ ] Playwright instalado (`npx playwright install chromium`)
- [ ] Variables de entorno configuradas
- [ ] `NODE_ENV=production` establecido
- [ ] Primera prueba de scraping exitosa
- [ ] Cron jobs verificados
- [ ] Base de datos persistente (PostgreSQL recomendado)
- [ ] Backup configurado

---

## 💰 Costos de Operación

- **Render.com Basic:** $7/mes
- **PostgreSQL Render:** Gratis
- **Bandwidth:** Incluido
- **Playwright:** Gratis

**Total: ~$7/mes** 🎉

---

## 🎯 Próximos Pasos

1. ✅ Instalar y configurar
2. ✅ Probar scraping manual
3. ✅ Verificar actualización de tickets
4. ✅ Deploy a Render
5. ✅ Monitorear logs primeras 24h
6. ✅ Agregar más fuentes de scraping si es necesario

---

**Sistema 100% funcional y listo para producción** 🚀

Costo mínimo | Mantenimiento mínimo | Máxima eficiencia
