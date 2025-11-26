# 🧪 Guía de Testing - Agencia Cheo

## 🚀 Inicio Rápido

### 1. Iniciar el Backend

```bash
cd backend
npm run develop
```

El backend estará disponible en: `http://localhost:1337`

### 2. Ejecutar el Script de Seed

**IMPORTANTE**: El script de seed crea datos de prueba para todas las funcionalidades.

```bash
cd backend
node scripts/seed.js
```

**¿Qué crea el seed?**
- ✅ 36 Animalitos con emojis
- ✅ 4 Loterías (Zulia, Triple Zulia, Caracas, Táchira)
- ✅ 3 Juegos de Animalitos (Lotto Activo, La Granjita, Animalitos Zulia)
- ✅ 4 Deportes (Fútbol, Béisbol, Baloncesto, Tenis)
- ✅ 6 Equipos de fútbol (Real Madrid, Barcelona, etc.)
- ✅ **3 Partidos de mañana** con fecha futura
- ✅ **9 Mercados de apuestas** (3 por cada partido: Local, Empate, Visitante)
- ✅ Sorteos de hoy para loterías y animalitos

### 3. Iniciar el Frontend

```bash
cd frontend
npm start
```

El frontend estará disponible en: `http://localhost:4200`

---

## ⚽ Probar el PARLEY

### Pre-requisitos
1. Backend corriendo en `http://localhost:1337`
2. Seed ejecutado exitosamente
3. Frontend corriendo en `http://localhost:4200`

### Pasos para Probar

1. **Navegar a Parley**
   - Ir a `http://localhost:4200/parley`
   - O hacer clic en "Parley Deportivo" en el menú

2. **Verificar que Carga Partidos**
   - Deberías ver **3 partidos** de mañana
   - Cada partido muestra:
     - Deporte (badge azul)
     - Equipos local vs visitante
     - Fecha y hora
     - **3 mercados** (Local, Empate, Visitante) con sus cuotas

3. **Seleccionar Mercados**
   - Haz clic en **al menos 2 mercados** de partidos diferentes
   - Los mercados seleccionados se muestran en el panel lateral "Mi Parley"
   - Se calcula automáticamente:
     - **Total Odds** (multiplicación de todas las cuotas)
     - **Ganancia Potencial** (monto × totalOdds)

4. **Completar el Formulario**
   - **Monto a Apostar** (requerido, mínimo Bs. 1)
   - Nombre (opcional)
   - Teléfono (opcional)

5. **Confirmar el Parley**
   - Clic en botón dorado "✅ Confirmar Parley"
   - Deberías ver:
     - ✅ Mensaje de éxito
     - Código del ticket (formato: PAR-XXXXXXXX)
     - Resumen de la apuesta
     - Total Odds y Ganancia Potencial

---

## 🐾 Probar ANIMALITOS

1. **Navegar a Animalitos**
   - Ir a `http://localhost:4200/animalitos`

2. **Seleccionar Juego**
   - Verás 3 juegos: Lotto Activo, La Granjita, Animalitos Zulia
   - Clic en botón dorado "🎮 Jugar"

3. **Seleccionar Sorteo**
   - Verás sorteo de hoy con estado "Abierto"
   - Clic en "Seleccionar"

4. **Seleccionar Animalito**
   - Verás los 36 animalitos en círculos dobles
   - Hover para animación
   - Clic en el animalito deseado

5. **Confirmar Apuesta**
   - Ingresar monto
   - Clic en botón dorado "✅ Confirmar Apuesta"

---

## 🎰 Probar LOTERÍAS

1. **Navegar a Loterías**
   - Ir a `http://localhost:4200/loterias`

2. **Seleccionar Lotería**
   - Verás 4 loterías disponibles
   - Clic en la lotería deseada

3. **Seleccionar Sorteo**
   - Verás sorteo de hoy
   - Clic en botón dorado "💰 Apostar"

4. **Ingresar Número**
   - Escribe un número de 2 dígitos (00-99)
   - Ingresar monto
   - Clic en botón dorado "✅ Confirmar Apuesta"

---

## 🔍 Consultar Tickets

1. **Navegar a Consultar Ticket**
   - Ir a `http://localhost:4200/consultar-ticket`

2. **Ingresar Código**
   - Pega el código del ticket que creaste
   - Ejemplos:
     - `PAR-XXXXXXXX` (Parley)
     - `LOT-XXXXXXXX` (Lotería)
     - `ANI-XXXXXXXX` (Animalitos)

3. **Ver Detalles**
   - Estado del ticket
   - Detalles de la apuesta
   - Ganancia potencial

---

## 🛠️ Troubleshooting

### El Parley dice "No hay partidos disponibles"

**Causa**: El seed no se ejecutó correctamente o los partidos están en el pasado.

**Solución**:
```bash
cd backend
node scripts/seed.js
```

El script elimina partidos viejos y crea 3 partidos con fecha de **mañana**.

### El Parley no muestra mercados

**Causa**: Los mercados no están poblados en la query.

**Solución**: El código ya está corregido en `parley.service.ts:121`:
```typescript
`&populate[markets][filters][isActive]=true` +
```

### Los Animalitos no cargan

**Verifica**:
1. Backend corriendo
2. Seed ejecutado
3. Console del navegador para errores

### Error de CORS

**Solución**: Verifica que el backend esté en `http://localhost:1337` y el frontend en `http://localhost:4200`.

---

## 📊 Verificar la Base de Datos

### Ver todos los partidos:
```
GET http://localhost:1337/api/matches?populate[homeTeam]=true&populate[awayTeam]=true&populate[markets]=true
```

### Ver todos los mercados:
```
GET http://localhost:1337/api/markets?populate[match][populate][homeTeam]=true&populate[match][populate][awayTeam]=true
```

### Ver animalitos:
```
GET http://localhost:1337/api/animalitos
```

---

## ✅ Checklist de Testing

- [ ] Backend corriendo
- [ ] Seed ejecutado sin errores
- [ ] Frontend corriendo
- [ ] Parley muestra 3 partidos
- [ ] Parley muestra mercados en cada partido
- [ ] Puede seleccionar múltiples mercados
- [ ] Total Odds se calcula correctamente
- [ ] Puede crear ticket de Parley
- [ ] Recibe código de ticket PAR-XXXXXXXX
- [ ] Animalitos muestra los 36 animales
- [ ] Loterías funcionan correctamente
- [ ] Puede consultar tickets creados

---

## 🎨 Nueva Paleta de Colores

- **Primary (Azul)** #1E40AF - 60% - Navegación y acciones estándar
- **Secondary (Dorado)** #F59E0B - 30% - Apuestas y acciones de dinero
- **Accent (Verde)** #10B981 - 10% - Éxito y confirmaciones

**Botones**:
- `btn-primary` (azul) - Navegación, selecciones
- `btn-secondary` (dorado) - Apostar, Jugar, Confirmar apuestas
- `btn-accent` (verde) - SOLO para mensajes de éxito

---

## 📝 Notas

- Los partidos se crean con fecha de **mañana** para que siempre estén disponibles
- Los sorteos de loterías y animalitos se crean para **hoy**
- El seed es idempotente: puede ejecutarse múltiples veces
- Los permisos públicos se activan automáticamente para testing
