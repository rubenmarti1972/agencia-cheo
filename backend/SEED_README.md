# 🌱 Seed de Base de Datos - Agencia Cheo

Este documento explica cómo poblar la base de datos con datos de ejemplo para el desarrollo y testing.

## 📋 Contenido

El script de seed crea automáticamente:

### 1. **36 Animalitos** 🐾
Todos los animalitos tradicionales venezolanos (Carnero, Toro, Ciempiés, etc.) con sus números y emojis.

### 2. **Loterías** 🎰
- Lotería del Zulia
- Triple Zulia
- Lotería de Caracas
- Chance Táchira

### 3. **Juegos de Animalitos** 🎮
- Lotto Activo (13:00)
- La Granjita (19:00)
- Animalitos Zulia (16:00)

### 4. **Deportes** ⚽
- Fútbol
- Béisbol
- Baloncesto
- Tenis

### 5. **Datos de Ejemplo**
- Sorteos de animalitos para hoy
- Sorteos de lotería para hoy
- 6 equipos de fútbol
- 2 partidos programados para mañana
- Mercados de apuestas (1X2)

## 🚀 Uso

### Opción 1: Ejecutar directamente con Strapi

1. Asegúrate de que Strapi esté compilado:
```bash
npm run build
```

2. Ejecuta el seed:
```bash
node scripts/seed.js
```

### Opción 2: Desde el código de Strapi

También puedes ejecutar el seed desde dentro de Strapi añadiendo un comando personalizado o ejecutándolo manualmente.

## ⚙️ Configuración Requerida

Antes de ejecutar el seed, asegúrate de:

1. **PostgreSQL está corriendo** en puerto 5432
2. **Base de datos existe**: `agencia_cheo`
3. **Strapi está compilado**: `npm run build`
4. **Variables de entorno configuradas** (si aplica)

## 📊 Estructura de Datos Creados

```
Animalitos (36)
├── 1. Carnero 🐏
├── 2. Toro 🐂
├── 3. Ciempiés 🐛
└── ... hasta 36. Culebra 🐍

Loterías (4)
├── Lotería del Zulia (pago 70x)
├── Triple Zulia (pago 65x)
├── Lotería de Caracas (pago 75x)
└── Chance Táchira (pago 70x)

Juegos de Animalitos (3)
├── Lotto Activo (pago 28x, 13:00)
├── La Granjita (pago 25x, 19:00)
└── Animalitos Zulia (pago 30x, 16:00)

Sorteos de Hoy
├── 3 sorteos de animalitos (abiertos)
└── 4 sorteos de lotería (abiertos)

Deportes (4)
└── Fútbol, Béisbol, Baloncesto, Tenis

Equipos (6)
├── Real Madrid vs Barcelona
├── Manchester United vs Liverpool
└── Bayern Munich, PSG

Partidos (2)
├── Partido 1 (mañana 18:00)
│   └── 3 mercados: Local, Empate, Visitante
└── Partido 2 (mañana 20:00)
    └── 3 mercados: Local, Empate, Visitante
```

## 🔄 Re-ejecutar el Seed

El script es **idempotente**, lo que significa que:
- ✅ Verifica si los datos ya existen antes de crearlos
- ✅ No duplica datos si ya están en la base de datos
- ✅ Puedes ejecutarlo múltiples veces sin problemas

Si quieres **limpiar y volver a crear** todos los datos:

1. Limpia la base de datos manualmente o:
```bash
# Opción 1: Recrear la base de datos
psql -U postgres -h 127.0.0.1 -c "DROP DATABASE agencia_cheo;"
psql -U postgres -h 127.0.0.1 -c "CREATE DATABASE agencia_cheo;"
```

2. Ejecuta Strapi para crear las tablas:
```bash
npm run develop
# Espera a que inicie, luego Ctrl+C
```

3. Ejecuta el seed:
```bash
node scripts/seed.js
```

## 🎯 Uso en Desarrollo

### Para probar apuestas de animalitos:
```bash
# Los sorteos de hoy están abiertos
# Puedes apostar usando el endpoint:
POST /api/animalitos/place-bet
{
  "drawId": 1,
  "animalitoNumber": 5,  # León
  "betAmount": 10
}
```

### Para probar apuestas de lotería:
```bash
POST /api/loterias/place-bet
{
  "drawId": 1,
  "betNumber": "1234",
  "betAmount": 5
}
```

### Para probar parleys:
```bash
POST /api/parley/place-ticket
{
  "marketIds": [1, 2, 3],  # IDs de mercados
  "betAmount": 20
}
```

## 📝 Notas

- Los sorteos se crean con estado `"open"` (abiertos para apuestas)
- Los partidos se programan para **mañana**
- Todos los juegos y loterías están activos por defecto
- Los multiplicadores de pago son realistas según el mercado venezolano

## 🐛 Troubleshooting

### Error: "Cannot find module '../dist/src/index.js'"
**Solución**: Compila Strapi primero con `npm run build`

### Error: "connect ECONNREFUSED 127.0.0.1:5432"
**Solución**: Asegúrate de que PostgreSQL está corriendo

### Error: "Database 'agencia_cheo' does not exist"
**Solución**: Crea la base de datos:
```bash
psql -U postgres -h 127.0.0.1 -c "CREATE DATABASE agencia_cheo;"
```

## 🎉 ¡Listo!

Después de ejecutar el seed, tu base de datos tendrá todos los datos necesarios para:
- ✅ Probar apuestas de animalitos
- ✅ Probar apuestas de lotería
- ✅ Probar parleys deportivos
- ✅ Probar consulta de tickets
- ✅ Probar scraping de resultados

¡Feliz desarrollo! 🚀
