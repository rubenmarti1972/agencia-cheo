# Guía de Pruebas del Parley - Correcciones Aplicadas

## Problemas Identificados y Corregidos

### 1. Campo `startTime` vs `matchDate` en Scripts de Seed

**Problema:**
Los scripts de seed estaban creando partidos con el campo `startTime`, pero el schema de Strapi define el campo como `matchDate`.

**Archivos Corregidos:**
- `/backend/scripts/seed_enhanced.js` - Línea 221
- `/backend/src/seed.ts` - Líneas 275 y 282

**Cambio Realizado:**
```javascript
// ANTES
startTime: matchDateTime.toISOString()

// DESPUÉS
matchDate: matchDateTime.toISOString()
```

### 2. Filtro de Fecha Incorrecto en el Servicio de Parley

**Problema:**
El servicio de parley estaba comparando solo la fecha (formato: `2025-11-26`) con un campo `datetime` completo. Strapi requiere un formato ISO completo para comparaciones correctas con campos `datetime`.

**Archivo Corregido:**
- `/frontend/src/app/services/parley.service.ts` - Líneas 112-119

**Cambio Realizado:**
```typescript
// ANTES
const today = new Date().toISOString().split('T')[0]; // Solo fecha: "2025-11-26"
const query = `filters[matchDate][$gte]=${today}` + ...

// DESPUÉS
const now = new Date();
const nowISO = now.toISOString(); // Fecha completa: "2025-11-26T16:00:00.000Z"
const query = `filters[matchDate][$gte]=${nowISO}` + ...
```

## Cómo Probar el Parley

### Prerequisitos

1. **PostgreSQL debe estar corriendo**
   ```bash
   # Verificar si PostgreSQL está corriendo
   pg_isready

   # O iniciar con Docker
   docker run -d \
     --name postgres-agencia \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=agencia_cheo \
     -p 5432:5432 \
     postgres:15
   ```

2. **Variables de Entorno (Opcional)**
   Crear `/backend/.env` si necesitas configuración personalizada:
   ```env
   DATABASE_HOST=127.0.0.1
   DATABASE_PORT=5432
   DATABASE_NAME=agencia_cheo
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=postgres
   ```

### Paso 1: Iniciar el Backend

```bash
cd backend
npm install  # Si aún no lo has hecho
npm run develop
```

Espera a que veas:
```
[INFO] ⏳ Server listening on http://localhost:1337
[INFO] ✨ Strapi is running!
```

### Paso 2: Ejecutar el Seed para Crear Datos de Prueba

Opción A - Via API (Recomendado):
```bash
curl -X POST http://localhost:1337/api/seed/run
```

Opción B - Via Script:
```bash
cd backend
node scripts/seed_enhanced.js
```

El seed creará:
- 18 equipos de Champions League
- 6 partidos para mañana con múltiples mercados
- Mercados activos: 1X2, Over/Under, Both Teams Score, Handicap, Córners, Resultado Correcto
- 1 ticket de parley de ejemplo

### Paso 3: Verificar que los Datos se Crearon

```bash
# Verificar partidos
curl "http://localhost:1337/api/matches?populate=*"

# Verificar mercados
curl "http://localhost:1337/api/markets?populate=*"
```

### Paso 4: Iniciar el Frontend

```bash
cd frontend
npm install  # Si aún no lo has hecho
npm start
```

### Paso 5: Probar el Parley

1. Navega a `http://localhost:4200/parley`
2. Deberías ver 6 partidos de Champions League listados
3. Cada partido debe mostrar sus mercados activos
4. Selecciona al menos 2 mercados de diferentes partidos
5. Ingresa un monto de apuesta
6. Haz clic en "Realizar Apuesta"
7. Deberías recibir un ticket con:
   - Código único del ticket
   - Cuotas totales calculadas
   - Ganancia potencial
   - Lista de selecciones

## Ejemplo de Prueba Completa

### 1. Crear un Parley via API (Sin Frontend)

```bash
# Primero, obtener IDs de mercados disponibles
curl "http://localhost:1337/api/markets?populate[match][populate][0]=homeTeam&populate[match][populate][1]=awayTeam&filters[isActive]=true&pagination[limit]=10" | jq '.data[0:4] | map(.id)'

# Luego, crear un ticket (reemplaza [1,2,3,4] con los IDs reales)
curl -X POST http://localhost:1337/api/parley/place-ticket \
  -H "Content-Type: application/json" \
  -d '{
    "marketIds": [1, 2, 3, 4],
    "betAmount": 100,
    "userName": "Usuario de Prueba",
    "userPhone": "+58 412 1234567"
  }'
```

### 2. Verificar Respuesta Esperada

```json
{
  "data": {
    "ticketCode": "PAR-1732637520000-A1B2C3D4",
    "ticket": {
      "id": 1,
      "ticketCode": "PAR-1732637520000-A1B2C3D4",
      "betAmount": 100,
      "totalOdds": 24.15,
      "potentialWin": 2415,
      "status": "pending",
      "userName": "Usuario de Prueba",
      "userPhone": "+58 412 1234567",
      "legs": [
        {
          "market": {
            "name": "Ganador del Partido",
            "selection": "MCI (Local)",
            "odds": 1.75
          }
        }
        // ... más legs
      ]
    }
  }
}
```

## Validaciones que se Realizan

El backend valida automáticamente:

1. ✅ Mínimo 2 mercados seleccionados
2. ✅ Todos los mercados existen y están activos
3. ✅ Los partidos no están finalizados ni cancelados
4. ✅ No se seleccionan múltiples mercados del mismo partido
5. ✅ El monto de apuesta es mayor a 0

## Troubleshooting

### "No hay partidos disponibles"

**Causa:** Los partidos no tienen la fecha correcta o el filtro de fecha no funciona.

**Solución:**
1. Verifica que los cambios en `parley.service.ts` estén aplicados
2. Ejecuta el seed nuevamente para crear partidos para mañana
3. Verifica la fecha de los partidos en la base de datos:
   ```sql
   SELECT id, "matchDate", status FROM matches;
   ```

### Error: "Match not found for market"

**Causa:** Los mercados no están asociados correctamente a partidos.

**Solución:**
1. Elimina todos los mercados y partidos
2. Ejecuta el seed nuevamente
3. Verifica que el populate funcione:
   ```bash
   curl "http://localhost:1337/api/markets/1?populate[match][populate][0]=homeTeam&populate[match][populate][1]=awayTeam"
   ```

### Backend no inicia - "ECONNREFUSED 127.0.0.1:5432"

**Causa:** PostgreSQL no está corriendo.

**Solución:**
```bash
# Iniciar PostgreSQL con Docker
docker run -d \
  --name postgres-agencia \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=agencia_cheo \
  -p 5432:5432 \
  postgres:15
```

## Resultados Esperados

Después de aplicar estas correcciones:

1. ✅ El endpoint `/api/matches` devuelve partidos futuros correctamente
2. ✅ El componente de parley muestra los partidos disponibles
3. ✅ Los usuarios pueden seleccionar mercados y crear tickets
4. ✅ Los tickets se crean con las cuotas y ganancias calculadas correctamente

## Nota sobre el Logo

El archivo `/frontend/src/assets/logo-agencia.png` mencionado no existe en el repositorio actual. Si necesitas un logo, deberás:

1. Crear o proporcionar el archivo de imagen
2. Colocarlo en `/frontend/src/assets/`
3. Referenciarlo en los componentes que lo necesiten

## Próximos Pasos

1. Ejecutar tests automatizados si existen
2. Probar con múltiples combinaciones de mercados
3. Verificar el cálculo de cuotas con diferentes odds
4. Probar casos edge: partidos en vivo, partidos cancelados, etc.
