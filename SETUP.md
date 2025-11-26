# 🚀 Guía de Configuración - Agencia Cheo

## Cambios Aplicados

### ✅ Paleta de Colores Corregida
- **#659980** (Verde Claro) - 60% USO PREDOMINANTE
- **#E9A655** (Dorado/Naranja) - 30% uso secundario
- **#BEB5C5** (Lavanda) - 10% uso mínimo (solo detalles)

### ✅ Diseño de Animalitos Mejorado
- ✨ Número GRANDE en el centro (4.5rem → 3.5rem móvil)
- 🎭 Emoji pequeño en esquina superior derecha
- ⭕ Círculo blanco con borde verde predominante
- 💫 Animaciones suaves al hover
- 📱 Responsive mejorado

### ✅ Header Actualizado
- 🎨 Fondo verde principal (#659980) - 60%
- 🟡 Acentos en dorado (#E9A655) - 30%
- 💜 Lavanda solo en detalles mínimos - 10%

---

## 📋 Pasos para Levantar la Aplicación

### 1️⃣ Backend (Strapi)

```bash
cd backend

# Instalar dependencias (si no está hecho)
npm install

# Construir el proyecto
npm run build

# Iniciar en modo desarrollo
npm run develop
```

El backend estará disponible en: **http://localhost:1337**

#### Panel de Administración
1. Abre http://localhost:1337/admin
2. Crea tu cuenta de administrador en el primer acceso
3. Accede al panel

#### Cargar Datos de Prueba Manualmente

**Opción 1: Via Panel Admin**
1. Ve a Content Manager
2. Crea manualmente:
   - Deportes: Fútbol
   - Equipos: Real Madrid, Barcelona, etc.
   - Partidos: Con fecha de mañana
   - Mercados: 1X2 para cada partido

**Opción 2: Via API REST** (recomendado)

```bash
# 1. Crear deporte Fútbol
curl -X POST http://localhost:1337/api/sports \
  -H "Content-Type: application/json" \
  -d '{"data": {"name": "Fútbol", "slug": "futbol", "isActive": true}}'

# 2. Crear equipos (obtén el ID del deporte primero)
curl -X POST http://localhost:1337/api/teams \
  -H "Content-Type: application/json" \
  -d '{"data": {"name": "Real Madrid", "sport": 1, "country": "España", "isActive": true}}'

curl -X POST http://localhost:1337/api/teams \
  -H "Content-Type: application/json" \
  -d '{"data": {"name": "Barcelona", "sport": 1, "country": "España", "isActive": true}}'

# 3. Crear partido (usa IDs de sport y teams)
curl -X POST http://localhost:1337/api/matches \
  -H "Content-Type: application/json" \
  -d '{"data": {"sport": 1, "homeTeam": 1, "awayTeam": 2, "matchDate": "2025-11-27T18:00:00.000Z", "status": "scheduled", "venue": "Santiago Bernabéu"}}'

# 4. Crear mercados (usa ID del partido)
curl -X POST http://localhost:1337/api/markets \
  -H "Content-Type: application/json" \
  -d '{"data": {"match": 1, "marketType": "1X2", "name": "Ganador", "selection": "Local", "odds": "2.10", "isActive": true}}'

curl -X POST http://localhost:1337/api/markets \
  -H "Content-Type: application/json" \
  -d '{"data": {"match": 1, "marketType": "1X2", "name": "Ganador", "selection": "Empate", "odds": "3.20", "isActive": true}}'

curl -X POST http://localhost:1337/api/markets \
  -H "Content-Type: application/json" \
  -d '{"data": {"match": 1, "marketType": "1X2", "name": "Ganador", "selection": "Visitante", "odds": "3.50", "isActive": true}}'
```

#### Habilitar Permisos Públicos
1. En el panel admin, ve a **Settings → Users & Permissions → Roles**
2. Click en **Public**
3. Expande todas las secciones de API
4. Marca todos los checkboxes de permisos
5. Guarda cambios

---

### 2️⃣ Frontend (Angular)

```bash
cd frontend

# Instalar dependencias (si no está hecho)
npm install

# Iniciar servidor de desarrollo
npm start
```

El frontend estará disponible en: **http://localhost:4200**

---

## 🎮 Probar la Aplicación

### Flujo de Parley
1. Ve a **http://localhost:4200/parley**
2. Deberías ver los partidos disponibles
3. Selecciona 2 o más mercados (ejemplo: Real Madrid Local + Barcelona Visitante)
4. Verás el cálculo en tiempo real:
   ```
   Cuotas: 2.10 × 3.50
   Cuota Total: 7.35
   ━━━━━━━━━━━━━━━━
   Bs. 100.00 × 7.35
   🏆 Ganancia Potencial: Bs. 735.00
   ```
5. Ingresa monto y confirma
6. Guarda el código de ticket generado

### Flujo de Animalitos
1. Ve a **http://localhost:4200/animalitos**
2. Selecciona un juego (Lotto Activo, La Granjita, etc.)
3. Selecciona un sorteo abierto
4. Haz click en un animalito (verás el NÚMERO GRANDE)
5. Ingresa monto y confirma
6. Guarda el código de ticket

---

## ⚙️ Configuración de WhatsApp

Edita el archivo:
```
frontend/src/app/components/whatsapp-float/whatsapp-float.component.ts
```

Cambia:
```typescript
whatsappNumber = '584121234567'; // TU NÚMERO REAL
message = '¡Hola! Me gustaría obtener más información.'; // TU MENSAJE
```

---

## 🎨 Verificar Colores

### Header
- Fondo: Verde #659980 ✓
- Texto logo: Blanco ✓
- Acento logo: Dorado #E9A655 ✓

### Animalitos
- Círculo: Blanco con borde verde #659980 ✓
- Número: Verde #659980 (grande y centrado) ✓
- Hover: Dorado #E9A655 ✓
- Emoji: Esquina superior derecha ✓

### Botones
- Principales: Verde #659980 ✓
- Secundarios: Dorado #E9A655 ✓
- Acentos mínimos: Lavanda #BEB5C5 ✓

---

## 🐛 Solución de Problemas

### "No hay partidos disponibles"
✅ Verifica que el backend esté corriendo
✅ Verifica que existan partidos en la BD
✅ Verifica que los partidos tengan fecha de MAÑANA o posterior
✅ Verifica permisos públicos habilitados

### "Cannot GET /api/..."
✅ El backend no está corriendo
✅ Ejecuta `npm run develop` en la carpeta backend

### Los animalitos no se ven bien
✅ Verifica que uses navegador moderno
✅ Prueba con Ctrl+F5 para limpiar cache
✅ El diseño es responsive, prueba en desktop

---

## 📝 Notas Importantes

1. **Base de Datos**: Usa SQLite por defecto (archivo `.tmp/data.db`)
2. **Seed Script**: Tiene problemas con Strapi 5, usar creación manual
3. **Partidos**: Deben tener `matchDate` (no `startTime`)
4. **Mercados**: Deben tener `match` relation correctamente configurada

---

**¡Todo listo para probar!** 🎉
