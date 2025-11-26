#!/bin/bash

# Script de diagnóstico para el Parley
# Uso: bash diagnose-parley.sh

API_URL="http://localhost:1337/api"

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║       🔍 DIAGNÓSTICO DEL PARLEY - Agencia Cheo           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Función para verificar si jq está instalado
check_jq() {
    if ! command -v jq &> /dev/null; then
        echo "⚠️  jq no está instalado. Instalando..."
        echo "   Puedes instalar con: sudo apt-get install jq (Ubuntu/Debian)"
        echo "   o visita: https://stedolan.github.io/jq/download/"
        echo ""
        USE_JQ=false
    else
        USE_JQ=true
    fi
}

check_jq

echo "1️⃣  Verificando Backend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if curl -s "${API_URL}/sports" > /dev/null 2>&1; then
    echo "✅ Backend está corriendo en ${API_URL}"
else
    echo "❌ Backend NO está corriendo"
    echo "   Inicia el backend con: cd backend && npm run develop"
    exit 1
fi
echo ""

echo "2️⃣  Contando Matches en la Base de Datos..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
MATCHES_RESP=$(curl -s "${API_URL}/matches")

if [ "$USE_JQ" = true ]; then
    MATCHES_COUNT=$(echo "$MATCHES_RESP" | jq '.data | length')
    echo "📊 Total de Matches: $MATCHES_COUNT"

    if [ "$MATCHES_COUNT" -eq 0 ]; then
        echo ""
        echo "❌ NO HAY MATCHES EN LA BASE DE DATOS"
        echo "   Ejecuta el seed: curl -X POST ${API_URL}/seed/run"
        exit 1
    fi
else
    echo "$MATCHES_RESP"
fi
echo ""

echo "3️⃣  Verificando Primer Match..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$USE_JQ" = true ]; then
    FIRST_MATCH=$(echo "$MATCHES_RESP" | jq '.data[0]')
    MATCH_ID=$(echo "$FIRST_MATCH" | jq -r '.id')
    MATCH_DATE=$(echo "$FIRST_MATCH" | jq -r '.matchDate')
    MATCH_STATUS=$(echo "$FIRST_MATCH" | jq -r '.status')

    echo "   ID: $MATCH_ID"
    echo "   Fecha: $MATCH_DATE"
    echo "   Status: $MATCH_STATUS"

    # Verificar si la fecha es futura
    MATCH_TIMESTAMP=$(date -d "$MATCH_DATE" +%s 2>/dev/null || echo "0")
    NOW_TIMESTAMP=$(date +%s)

    if [ "$MATCH_TIMESTAMP" -gt "$NOW_TIMESTAMP" ]; then
        echo "   ✅ Match está en el FUTURO"
    else
        echo "   ❌ Match está en el PASADO"
        echo "      Re-ejecuta el seed para crear matches frescos"
    fi

    if [ "$MATCH_STATUS" = "scheduled" ] || [ "$MATCH_STATUS" = "live" ]; then
        echo "   ✅ Status es válido ($MATCH_STATUS)"
    else
        echo "   ❌ Status NO es válido ($MATCH_STATUS)"
        echo "      Debe ser 'scheduled' o 'live'"
    fi
else
    echo "$FIRST_MATCH"
fi
echo ""

echo "4️⃣  Verificando Populate (homeTeam, awayTeam, sport, markets)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
MATCH_POPULATE=$(curl -s "${API_URL}/matches/${MATCH_ID}?populate[homeTeam]=true&populate[awayTeam]=true&populate[sport]=true&populate[markets]=true")

if [ "$USE_JQ" = true ]; then
    HOME_TEAM=$(echo "$MATCH_POPULATE" | jq -r '.data.homeTeam.name // "NO TIENE"')
    AWAY_TEAM=$(echo "$MATCH_POPULATE" | jq -r '.data.awayTeam.name // "NO TIENE"')
    SPORT=$(echo "$MATCH_POPULATE" | jq -r '.data.sport.name // "NO TIENE"')
    MARKETS_COUNT=$(echo "$MATCH_POPULATE" | jq '.data.markets | length')

    echo "   homeTeam: $HOME_TEAM"
    echo "   awayTeam: $AWAY_TEAM"
    echo "   sport: $SPORT"
    echo "   markets: $MARKETS_COUNT"

    if [ "$HOME_TEAM" != "NO TIENE" ] && [ "$AWAY_TEAM" != "NO TIENE" ]; then
        echo "   ✅ Teams están populated"
    else
        echo "   ❌ Teams NO están populated"
    fi

    if [ "$MARKETS_COUNT" -gt 0 ]; then
        echo "   ✅ Tiene markets asociados"
    else
        echo "   ❌ NO tiene markets"
    fi
else
    echo "$MATCH_POPULATE"
fi
echo ""

echo "5️⃣  Probando Query del Parley (con filtros)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
NOW_ISO=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")
echo "   Fecha actual (ISO): $NOW_ISO"

UPCOMING_URL="${API_URL}/matches?filters[status][\$in][0]=scheduled&filters[status][\$in][1]=live&filters[matchDate][\$gte]=${NOW_ISO}&populate[homeTeam]=true&populate[awayTeam]=true&populate[sport]=true&populate[markets]=true"

UPCOMING_RESP=$(curl -s "$UPCOMING_URL")

if [ "$USE_JQ" = true ]; then
    UPCOMING_COUNT=$(echo "$UPCOMING_RESP" | jq '.data | length')
    echo "   Matches encontrados con filtros: $UPCOMING_COUNT"

    if [ "$UPCOMING_COUNT" -gt 0 ]; then
        echo "   ✅ El query encuentra matches"
        echo ""
        echo "   Matches que se mostrarían en el Parley:"
        echo "$UPCOMING_RESP" | jq -r '.data[] | "      - \(.homeTeam.name) vs \(.awayTeam.name) | \(.matchDate) | Markets: \(.markets | length)"'
    else
        echo "   ❌ El query NO encuentra matches"
        echo ""
        echo "   Posibles causas:"
        echo "   • Los matches tienen fecha en el pasado"
        echo "   • Los matches no tienen status 'scheduled' o 'live'"
        echo "   • Hay un problema con el populate"
    fi
else
    echo "$UPCOMING_RESP"
fi
echo ""

echo "6️⃣  Verificando Markets..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
MARKETS_RESP=$(curl -s "${API_URL}/markets")

if [ "$USE_JQ" = true ]; then
    MARKETS_COUNT=$(echo "$MARKETS_RESP" | jq '.data | length')
    ACTIVE_MARKETS=$(echo "$MARKETS_RESP" | jq '[.data[] | select(.isActive == true)] | length')

    echo "   Total Markets: $MARKETS_COUNT"
    echo "   Markets Activos: $ACTIVE_MARKETS"

    if [ "$ACTIVE_MARKETS" -gt 0 ]; then
        echo "   ✅ Hay markets activos"
    else
        echo "   ❌ NO hay markets activos"
        echo "      Verifica que isActive sea true en los markets"
    fi
else
    echo "$MARKETS_RESP"
fi
echo ""

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                    📋 RESUMEN                             ║"
echo "╚═══════════════════════════════════════════════════════════╝"

if [ "$USE_JQ" = true ]; then
    if [ "$UPCOMING_COUNT" -gt 0 ]; then
        echo ""
        echo "✅ TODO ESTÁ BIEN - El parley debería funcionar"
        echo ""
        echo "Si aún ves 'No hay partidos disponibles':"
        echo "   1. Verifica que el frontend esté apuntando a http://localhost:1337/api"
        echo "   2. Abre la consola del navegador (F12) y busca errores"
        echo "   3. Abre test-api.html en el navegador para más detalles"
    else
        echo ""
        echo "❌ PROBLEMA ENCONTRADO"
        echo ""
        echo "Solución rápida:"
        echo "   curl -X POST ${API_URL}/seed/run"
        echo ""
        echo "Esto creará partidos frescos con fecha futura"
    fi
else
    echo "Instala jq para un mejor diagnóstico: sudo apt-get install jq"
fi

echo ""
echo "Para más información, revisa: DIAGNOSTICO_PARLEY.md"
echo ""
