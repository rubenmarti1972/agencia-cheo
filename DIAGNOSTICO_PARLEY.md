# 🔍 Diagnóstico del Problema del Parley

## Síntomas
- **Mensaje:** "No hay partidos disponibles"
- **En Strapi CMS:** Hay markets, hay 2 partidos (matches)
- **Parley Leg:** Vacío (esto es normal - se crea cuando se apuesta)

## Puntos de Revisión

### 1. ¿Los Matches tienen la fecha correcta?

El problema más común es que los partidos se crean para "mañana" pero:
- **Problema potencial:** Si el script de seed se ejecutó hace varios días, los partidos ya están en el pasado
- **Solución:** Re-ejecutar el seed para crear partidos frescos

**Verificación:**
```bash
# Ver las fechas de los partidos directamente
curl http://localhost:1337/api/matches | jq '.data[] | {id, matchDate, status}'
```

### 2. ¿Los Matches tienen status correcto?

El query filtra por `status IN ('scheduled', 'live')`.

**Verificar:**
- Los partidos deben tener `status: "scheduled"` o `status: "live"`
- NO deben ser `"finished"` o `"cancelled"`

### 3. ¿El populate funciona correctamente?

El componente necesita que cada match tenga:
- `homeTeam` (populated)
- `awayTeam` (populated)
- `sport` (populated)
- `markets` (populated)

**Verificación:**
```bash
# Ver un match completo con populate
curl "http://localhost:1337/api/matches/1?populate[homeTeam]=true&populate[awayTeam]=true&populate[sport]=true&populate[markets]=true" | jq
```

### 4. ¿Los Markets están activos?

El componente filtra markets con `isActive: true`.

**Verificación:**
```bash
# Ver markets del primer partido
curl "http://localhost:1337/api/markets?filters[match][id]=1&filters[isActive]=true" | jq '.data | length'
```

## Herramienta de Diagnóstico

He creado un archivo `frontend/test-api.html` que puedes abrir en tu navegador para probar la API:

1. Abre `frontend/test-api.html` en Chrome/Firefox
2. Haz clic en "Diagnosticar"
3. Te mostrará exactamente qué está fallando

## Soluciones Rápidas

### Solución 1: Re-crear los Partidos

Los partidos se crean para "mañana" (tomorrow). Si el seed se corrió hace días, están en el pasado.

```bash
# Re-ejecutar el seed
curl -X POST http://localhost:1337/api/seed/run
```

### Solución 2: Verificar Manualmente en Strapi

1. Abre http://localhost:1337/admin
2. Ve a "Matches"
3. Verifica:
   - ✅ ¿Tiene `homeTeam`?
   - ✅ ¿Tiene `awayTeam`?
   - ✅ ¿Tiene `sport`?
   - ✅ ¿`matchDate` es futuro?
   - ✅ ¿`status` es "scheduled"?

4. Ve a "Markets"
5. Verifica:
   - ✅ ¿Tienen `match` asociado?
   - ✅ ¿`isActive` es true?

### Solución 3: Crear Matches Manualmente para Prueba

Si el seed no funciona, crea manualmente:

1. En Strapi Admin → Sports → Crea "Fútbol"
2. En Teams → Crea "Real Madrid" y "Barcelona"
3. En Matches → Crea nuevo match:
   - homeTeam: Real Madrid
   - awayTeam: Barcelona
   - sport: Fútbol
   - matchDate: **MAÑANA** (fecha futura)
   - status: scheduled
4. En Markets → Crea mercados para ese match:
   - match: El match que creaste
   - marketType: moneyline
   - name: "Ganador del Partido"
   - selection: "Real Madrid"
   - odds: 2.5
   - isActive: **true** ✅

## Query Exacto que usa el Parley

```javascript
const now = new Date();
const nowISO = now.toISOString(); // "2025-11-26T20:30:00.000Z"

const query =
  `filters[status][$in][0]=scheduled` +
  `&filters[status][$in][1]=live` +
  `&filters[matchDate][$gte]=${nowISO}` +  // ⚠️ Debe ser fecha FUTURA
  `&populate[homeTeam]=true` +
  `&populate[awayTeam]=true` +
  `&populate[sport]=true` +
  `&populate[markets]=true` +
  `&sort=matchDate:asc` +
  `&pagination[limit]=20`;

// URL final
`http://localhost:1337/api/matches?${query}`
```

## Checklist de Debugging

- [ ] Backend está corriendo (`curl http://localhost:1337/api/sports`)
- [ ] Hay matches en la DB (`curl http://localhost:1337/api/matches`)
- [ ] Los matches tienen fecha FUTURA
- [ ] Los matches tienen status `scheduled` o `live`
- [ ] Los matches tienen homeTeam y awayTeam
- [ ] Los markets existen y tienen `isActive: true`
- [ ] Los markets están asociados a un match
- [ ] El frontend apunta a `http://localhost:1337/api`

## Comando de Verificación Rápida

```bash
# Este comando te dice todo:
echo "=== BACKEND STATUS ==="
curl -s http://localhost:1337/api/sports > /dev/null && echo "✅ Backend UP" || echo "❌ Backend DOWN"

echo -e "\n=== MATCHES COUNT ==="
curl -s http://localhost:1337/api/matches | jq '.data | length'

echo -e "\n=== FIRST MATCH ==="
curl -s http://localhost:1337/api/matches | jq '.data[0] | {id, matchDate, status}'

echo -e "\n=== MATCH WITH POPULATE ==="
MATCH_ID=$(curl -s http://localhost:1337/api/matches | jq -r '.data[0].id')
curl -s "http://localhost:1337/api/matches/${MATCH_ID}?populate=*" | jq '{
  id: .data.id,
  matchDate: .data.matchDate,
  status: .data.status,
  homeTeam: .data.homeTeam.name,
  awayTeam: .data.awayTeam.name,
  sport: .data.sport.name,
  marketsCount: (.data.markets | length)
}'

echo -e "\n=== MARKETS COUNT ==="
curl -s http://localhost:1337/api/markets | jq '.data | length'

echo -e "\n=== UPCOMING MATCHES QUERY ==="
NOW_ISO=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")
curl -s "http://localhost:1337/api/matches?filters[status][\$in][0]=scheduled&filters[matchDate][\$gte]=${NOW_ISO}" | jq '.data | length'
```

## Próximos Pasos

1. **Ejecuta el test-api.html** en tu navegador
2. **Mira el diagnóstico** que te da
3. **Re-ejecuta el seed** si las fechas están en el pasado
4. **Verifica en Strapi Admin** que todo esté correcto
