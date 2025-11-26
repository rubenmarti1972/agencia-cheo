/**
 * Script de seed mejorado con casos de prueba completos para Parley
 * Incluye partidos de Champions League con múltiples mercados de apuestas
 *
 * Uso: node scripts/seed_enhanced.js
 */

const path = require('path');

// Datos de los 36 animalitos
const ANIMALITOS_DATA = [
  { number: 1, name: 'Carnero', emoji: '🐏' },
  { number: 2, name: 'Toro', emoji: '🐂' },
  { number: 3, name: 'Ciempiés', emoji: '🐛' },
  { number: 4, name: 'Alacrán', emoji: '🦂' },
  { number: 5, name: 'León', emoji: '🦁' },
  { number: 6, name: 'Rana', emoji: '🐸' },
  { number: 7, name: 'Perico', emoji: '🦜' },
  { number: 8, name: 'Ratón', emoji: '🐭' },
  { number: 9, name: 'Águila', emoji: '🦅' },
  { number: 10, name: 'Tigre', emoji: '🐯' },
  { number: 11, name: 'Gato', emoji: '🐱' },
  { number: 12, name: 'Caballo', emoji: '🐴' },
  { number: 13, name: 'Mono', emoji: '🐵' },
  { number: 14, name: 'Paloma', emoji: '🕊️' },
  { number: 15, name: 'Zorro', emoji: '🦊' },
  { number: 16, name: 'Oso', emoji: '🐻' },
  { number: 17, name: 'Pavo', emoji: '🦃' },
  { number: 18, name: 'Burro', emoji: '🫏' },
  { number: 19, name: 'Chivo', emoji: '🐐' },
  { number: 20, name: 'Cochino', emoji: '🐷' },
  { number: 21, name: 'Gallo', emoji: '🐓' },
  { number: 22, name: 'Camello', emoji: '🐫' },
  { number: 23, name: 'Cebra', emoji: '🦓' },
  { number: 24, name: 'Iguana', emoji: '🦎' },
  { number: 25, name: 'Gallina', emoji: '🐔' },
  { number: 26, name: 'Vaca', emoji: '🐄' },
  { number: 27, name: 'Perro', emoji: '🐕' },
  { number: 28, name: 'Zamuro', emoji: '🦅' },
  { number: 29, name: 'Elefante', emoji: '🐘' },
  { number: 30, name: 'Caimán', emoji: '🐊' },
  { number: 31, name: 'Lapa', emoji: '🐚' },
  { number: 32, name: 'Ardilla', emoji: '🐿️' },
  { number: 33, name: 'Pescado', emoji: '🐟' },
  { number: 34, name: 'Venado', emoji: '🦌' },
  { number: 35, name: 'Jirafa', emoji: '🦒' },
  { number: 36, name: 'Culebra', emoji: '🐍' }
];

// Loterías venezolanas
const LOTTERIES_DATA = [
  {
    name: 'Zulia',
    description: 'Lotería tradicional del estado Zulia',
    isActive: true,
    minBetAmount: 1.0,
    maxBetAmount: 500.0,
    payoutMultiplier: 70.0
  },
  {
    name: 'Triple Zulia',
    description: 'Triple sorteo diario del Zulia',
    isActive: true,
    minBetAmount: 0.5,
    maxBetAmount: 300.0,
    payoutMultiplier: 65.0
  },
  {
    name: 'Caracas',
    description: 'Lotería de la capital',
    isActive: true,
    minBetAmount: 1.0,
    maxBetAmount: 1000.0,
    payoutMultiplier: 75.0
  },
  {
    name: 'Táchira',
    description: 'Lotería del estado Táchira',
    isActive: true,
    minBetAmount: 0.5,
    maxBetAmount: 400.0,
    payoutMultiplier: 70.0
  }
];

// Juegos de animalitos
const ANIMALITOS_GAMES_DATA = [
  {
    name: 'Lotto Activo',
    description: 'Sorteo de animalitos más popular de Venezuela',
    isActive: true,
    minBetAmount: 1.0,
    maxBetAmount: 500.0,
    payoutMultiplier: 28.0,
    scheduledTime: '13:00:00',
    closeMinutesBefore: 5
  },
  {
    name: 'La Granjita',
    description: 'Sorteo de animalitos nocturno',
    isActive: true,
    minBetAmount: 0.5,
    maxBetAmount: 300.0,
    payoutMultiplier: 25.0,
    scheduledTime: '19:00:00',
    closeMinutesBefore: 5
  },
  {
    name: 'Animalitos Zulia',
    description: 'Sorteo regional del Zulia',
    isActive: true,
    minBetAmount: 1.0,
    maxBetAmount: 400.0,
    payoutMultiplier: 30.0,
    scheduledTime: '16:00:00',
    closeMinutesBefore: 5
  }
];

// Deportes
const SPORTS_DATA = [
  { name: 'Fútbol', slug: 'futbol', isActive: true },
  { name: 'Béisbol', slug: 'beisbol', isActive: true },
  { name: 'Baloncesto', slug: 'baloncesto', isActive: true },
  { name: 'Tenis', slug: 'tenis', isActive: true }
];

// Equipos de Champions League con logos
const CHAMPIONS_TEAMS = [
  // Liga Española
  { name: 'Real Madrid', shortName: 'RMA', country: 'España', league: 'La Liga', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg' },
  { name: 'Barcelona', shortName: 'BAR', country: 'España', league: 'La Liga', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg' },
  { name: 'Atlético Madrid', shortName: 'ATM', country: 'España', league: 'La Liga', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg' },

  // Liga Inglesa
  { name: 'Manchester City', shortName: 'MCI', country: 'Inglaterra', league: 'Premier League', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg' },
  { name: 'Arsenal', shortName: 'ARS', country: 'Inglaterra', league: 'Premier League', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg' },
  { name: 'Liverpool', shortName: 'LIV', country: 'Inglaterra', league: 'Premier League', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg' },
  { name: 'Manchester United', shortName: 'MUN', country: 'Inglaterra', league: 'Premier League', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg' },

  // Liga Alemana
  { name: 'Bayern Munich', shortName: 'BAY', country: 'Alemania', league: 'Bundesliga', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg' },
  { name: 'Borussia Dortmund', shortName: 'DOR', country: 'Alemania', league: 'Bundesliga', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg' },
  { name: 'RB Leipzig', shortName: 'RBL', country: 'Alemania', league: 'Bundesliga', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/0/04/RB_Leipzig_2014_logo.svg' },

  // Liga Italiana
  { name: 'Inter de Milán', shortName: 'INT', country: 'Italia', league: 'Serie A', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg' },
  { name: 'AC Milan', shortName: 'MIL', country: 'Italia', league: 'Serie A', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg' },
  { name: 'Juventus', shortName: 'JUV', country: 'Italia', league: 'Serie A', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Juventus_FC_-_pictogram_black_%28Italy%2C_2017%29.svg' },

  // Liga Francesa
  { name: 'PSG', shortName: 'PSG', country: 'Francia', league: 'Ligue 1', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg' },
  { name: 'AS Monaco', shortName: 'MON', country: 'Francia', league: 'Ligue 1', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Logo_AS_Monaco_FC_%282023%29.svg' },

  // Otras ligas
  { name: 'Benfica', shortName: 'BEN', country: 'Portugal', league: 'Liga Portugal', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a2/SL_Benfica_logo.svg' },
  { name: 'FC Porto', shortName: 'POR', country: 'Portugal', league: 'Liga Portugal', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f1/FC_Porto.svg' },
  { name: 'Ajax', shortName: 'AJA', country: 'Holanda', league: 'Eredivisie', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/7/79/Ajax_Amsterdam.svg' }
];

/**
 * Genera partidos de Champions League para mañana (27 de noviembre de 2025)
 */
function generateChampionsMatches(tomorrow, teams) {
  const matches = [
    {
      homeTeamName: 'Manchester City',
      awayTeamName: 'Juventus',
      time: '15:45',
      venue: 'Etihad Stadium',
      competition: 'UEFA Champions League - Fase de Grupos'
    },
    {
      homeTeamName: 'PSG',
      awayTeamName: 'Bayern Munich',
      time: '18:00',
      venue: 'Parc des Princes',
      competition: 'UEFA Champions League - Fase de Grupos'
    },
    {
      homeTeamName: 'Real Madrid',
      awayTeamName: 'Liverpool',
      time: '18:00',
      venue: 'Santiago Bernabéu',
      competition: 'UEFA Champions League - Fase de Grupos'
    },
    {
      homeTeamName: 'Inter de Milán',
      awayTeamName: 'RB Leipzig',
      time: '15:45',
      venue: 'San Siro',
      competition: 'UEFA Champions League - Fase de Grupos'
    },
    {
      homeTeamName: 'Arsenal',
      awayTeamName: 'AS Monaco',
      time: '18:00',
      venue: 'Emirates Stadium',
      competition: 'UEFA Champions League - Fase de Grupos'
    },
    {
      homeTeamName: 'Borussia Dortmund',
      awayTeamName: 'Barcelona',
      time: '18:00',
      venue: 'Signal Iduna Park',
      competition: 'UEFA Champions League - Fase de Grupos'
    }
  ];

  return matches.map(match => {
    const homeTeam = teams.find(t => t.name === match.homeTeamName);
    const awayTeam = teams.find(t => t.name === match.awayTeamName);

    const [hours, minutes] = match.time.split(':');
    const matchDateTime = new Date(tomorrow);
    matchDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    return {
      homeTeam: homeTeam.id,
      awayTeam: awayTeam.id,
      matchDate: matchDateTime.toISOString(),
      status: 'scheduled',
      venue: match.venue,
      competition: match.competition,
      homeTeamObj: homeTeam,
      awayTeamObj: awayTeam
    };
  });
}

/**
 * Genera mercados de apuestas para un partido
 * Incluye: 1X2, Over/Under, Both Teams Score, Handicap, Total Corners
 */
function generateMarketsForMatch(match) {
  const markets = [];

  // MERCADO MONEYLINE (Ganador del partido)
  markets.push(
    {
      marketType: 'moneyline',
      name: 'Ganador del Partido',
      selection: `${match.homeTeamObj.shortName} (Local)`,
      odds: (Math.random() * (2.5 - 1.5) + 1.5).toFixed(2),
      isActive: true,
      result: 'pending'
    },
    {
      marketType: 'moneyline',
      name: 'Ganador del Partido',
      selection: 'Empate',
      odds: (Math.random() * (3.8 - 3.0) + 3.0).toFixed(2),
      isActive: true,
      result: 'pending'
    },
    {
      marketType: 'moneyline',
      name: 'Ganador del Partido',
      selection: `${match.awayTeamObj.shortName} (Visitante)`,
      odds: (Math.random() * (3.5 - 2.0) + 2.0).toFixed(2),
      isActive: true,
      result: 'pending'
    }
  );

  // MERCADO OVER/UNDER 2.5 GOLES
  markets.push(
    {
      marketType: 'over_under',
      name: 'Total de Goles',
      selection: 'Más de 2.5 goles',
      odds: (Math.random() * (2.0 - 1.6) + 1.6).toFixed(2),
      line: '2.5',
      isActive: true,
      result: 'pending'
    },
    {
      marketType: 'over_under',
      name: 'Total de Goles',
      selection: 'Menos de 2.5 goles',
      odds: (Math.random() * (2.2 - 1.7) + 1.7).toFixed(2),
      line: '2.5',
      isActive: true,
      result: 'pending'
    }
  );

  // MERCADO BOTH TEAMS TO SCORE
  markets.push(
    {
      marketType: 'both_teams_score',
      name: 'Ambos Equipos Anotan',
      selection: 'Sí',
      odds: (Math.random() * (2.1 - 1.6) + 1.6).toFixed(2),
      isActive: true,
      result: 'pending'
    },
    {
      marketType: 'both_teams_score',
      name: 'Ambos Equipos Anotan',
      selection: 'No',
      odds: (Math.random() * (2.3 - 1.8) + 1.8).toFixed(2),
      isActive: true,
      result: 'pending'
    }
  );

  // MERCADO HANDICAP ASIÁTICO
  const handicap = Math.random() > 0.5 ? '-0.5' : '+0.5';
  markets.push(
    {
      marketType: 'handicap',
      name: 'Handicap Asiático',
      selection: `${match.homeTeamObj.shortName} (${handicap})`,
      odds: (Math.random() * (2.2 - 1.7) + 1.7).toFixed(2),
      line: handicap,
      isActive: true,
      result: 'pending'
    }
  );

  // MERCADO TOTAL DE CÓRNERES
  markets.push(
    {
      marketType: 'corners',
      name: 'Total de Córneres',
      selection: 'Más de 9.5 córneres',
      odds: (Math.random() * (2.0 - 1.7) + 1.7).toFixed(2),
      line: '9.5',
      isActive: true,
      result: 'pending'
    },
    {
      marketType: 'corners',
      name: 'Total de Córneres',
      selection: 'Menos de 9.5 córneres',
      odds: (Math.random() * (2.0 - 1.7) + 1.7).toFixed(2),
      line: '9.5',
      isActive: true,
      result: 'pending'
    }
  );

  // MERCADO RESULTADO CORRECTO (algunos resultados populares)
  markets.push(
    {
      marketType: 'correct_score',
      name: 'Resultado Correcto',
      selection: '1-0',
      odds: '7.50',
      isActive: true,
      result: 'pending'
    },
    {
      marketType: 'correct_score',
      name: 'Resultado Correcto',
      selection: '2-1',
      odds: '8.50',
      isActive: true,
      result: 'pending'
    },
    {
      marketType: 'correct_score',
      name: 'Resultado Correcto',
      selection: '1-1',
      odds: '6.50',
      isActive: true,
      result: 'pending'
    },
    {
      marketType: 'correct_score',
      name: 'Resultado Correcto',
      selection: '0-0',
      odds: '9.00',
      isActive: true,
      result: 'pending'
    }
  );

  return markets;
}

async function seed({ strapi }) {
  console.log('🌱 Iniciando seed mejorado con datos completos de Champions League...\n');

  try {
    console.log('📊 Verificando datos existentes...\n');

    // 1. Crear animalitos
    console.log('🐾 Creando animalitos...');
    const existingAnimalitos = await strapi.db.query('api::animalito.animalito').findMany();

    if (existingAnimalitos.length === 0) {
      for (const animalito of ANIMALITOS_DATA) {
        await strapi.db.query('api::animalito.animalito').create({
          data: animalito
        });
      }
      console.log(`✅ ${ANIMALITOS_DATA.length} animalitos creados`);
    } else {
      console.log(`ℹ️  Ya existen ${existingAnimalitos.length} animalitos, omitiendo...`);
    }

    // 2. Crear loterías
    console.log('\n🎰 Creando loterías...');
    const existingLotteries = await strapi.db.query('api::lottery.lottery').findMany();

    if (existingLotteries.length === 0) {
      for (const lottery of LOTTERIES_DATA) {
        await strapi.db.query('api::lottery.lottery').create({
          data: lottery
        });
      }
      console.log(`✅ ${LOTTERIES_DATA.length} loterías creadas`);
    } else {
      console.log(`ℹ️  Ya existen ${existingLotteries.length} loterías, omitiendo...`);
    }

    // 3. Crear juegos de animalitos
    console.log('\n🎮 Creando juegos de animalitos...');
    const existingGames = await strapi.db.query('api::animalitos-game.animalitos-game').findMany();

    if (existingGames.length === 0) {
      for (const game of ANIMALITOS_GAMES_DATA) {
        await strapi.db.query('api::animalitos-game.animalitos-game').create({
          data: game
        });
      }
      console.log(`✅ ${ANIMALITOS_GAMES_DATA.length} juegos de animalitos creados`);
    } else {
      console.log(`ℹ️  Ya existen ${existingGames.length} juegos, omitiendo...`);
    }

    // 4. Crear deportes
    console.log('\n⚽ Creando deportes...');
    let sports = await strapi.db.query('api::sport.sport').findMany();

    if (sports.length === 0) {
      for (const sport of SPORTS_DATA) {
        await strapi.db.query('api::sport.sport').create({
          data: sport
        });
      }
      sports = await strapi.db.query('api::sport.sport').findMany();
      console.log(`✅ ${SPORTS_DATA.length} deportes creados`);
    } else {
      console.log(`ℹ️  Ya existen ${sports.length} deportes, omitiendo...`);
    }

    const futbol = sports.find(s => s.name === 'Fútbol');

    // 5. Crear equipos de Champions League
    console.log('\n🏆 Creando equipos de Champions League...');
    let teams = await strapi.db.query('api::team.team').findMany();

    if (teams.length < CHAMPIONS_TEAMS.length && futbol) {
      console.log(`Eliminando equipos antiguos para recrear...`);
      // Eliminar equipos antiguos
      for (const team of teams) {
        await strapi.db.query('api::team.team').delete({ where: { id: team.id } });
      }

      // Crear nuevos equipos
      for (const teamData of CHAMPIONS_TEAMS) {
        await strapi.db.query('api::team.team').create({
          data: {
            ...teamData,
            sport: futbol.id,
            isActive: true
          }
        });
      }

      teams = await strapi.db.query('api::team.team').findMany();
      console.log(`✅ ${teams.length} equipos de Champions League creados`);
    } else {
      console.log(`ℹ️  Ya existen ${teams.length} equipos`);
    }

    // 6. Crear sorteos de animalitos para hoy
    console.log('\n🎲 Creando sorteos de animalitos de ejemplo...');
    const today = new Date().toISOString().split('T')[0];
    const games = await strapi.db.query('api::animalitos-game.animalitos-game').findMany();

    const existingAnimalitoDraws = await strapi.db.query('api::animalitos-draw.animalitos-draw').findMany({
      where: { drawDate: today }
    });

    if (existingAnimalitoDraws.length === 0 && games.length > 0) {
      for (const game of games) {
        await strapi.db.query('api::animalitos-draw.animalitos-draw').create({
          data: {
            game: game.id,
            drawDate: today,
            status: 'open',
            winningAnimalNumber: null
          }
        });
      }
      console.log(`✅ ${games.length} sorteos de animalitos creados para hoy`);
    } else {
      console.log(`ℹ️  Ya existen sorteos para hoy, omitiendo...`);
    }

    // 7. Crear sorteos de lotería para hoy
    console.log('\n🎫 Creando sorteos de lotería de ejemplo...');
    const lotteries = await strapi.db.query('api::lottery.lottery').findMany();

    const existingLotteryDraws = await strapi.db.query('api::lottery-draw.lottery-draw').findMany({
      where: { drawDate: today }
    });

    if (existingLotteryDraws.length === 0 && lotteries.length > 0) {
      for (const lottery of lotteries) {
        await strapi.db.query('api::lottery-draw.lottery-draw').create({
          data: {
            lottery: lottery.id,
            drawDate: today,
            drawTime: '14:00:00',
            status: 'open',
            closeMinutesBefore: 5,
            winningNumber: null
          }
        });
      }
      console.log(`✅ ${lotteries.length} sorteos de lotería creados para hoy`);
    } else {
      console.log(`ℹ️  Ya existen sorteos de lotería para hoy, omitiendo...`);
    }

    // 8. Crear partidos de Champions League para mañana
    console.log('\n🏟️  Creando partidos de Champions League para mañana...');

    // Eliminar partidos y mercados antiguos
    const oldMatches = await strapi.db.query('api::match.match').findMany();
    console.log(`Eliminando ${oldMatches.length} partidos antiguos...`);
    for (const match of oldMatches) {
      // Eliminar mercados asociados
      const markets = await strapi.db.query('api::market.market').findMany({
        where: { match: match.id }
      });
      for (const market of markets) {
        await strapi.db.query('api::market.market').delete({ where: { id: market.id } });
      }
      // Eliminar partido
      await strapi.db.query('api::match.match').delete({ where: { id: match.id } });
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const matchesData = generateChampionsMatches(tomorrow, teams);

    const createdMatches = [];
    for (const matchData of matchesData) {
      const { homeTeamObj, awayTeamObj, ...matchFields } = matchData;
      const match = await strapi.db.query('api::match.match').create({
        data: {
          ...matchFields,
          sport: futbol.id
        }
      });
      createdMatches.push({ ...match, homeTeamObj, awayTeamObj });
    }

    console.log(`✅ ${createdMatches.length} partidos de Champions League creados para mañana`);

    // 9. Crear mercados de apuestas para cada partido
    console.log('\n💰 Creando mercados de apuestas completos...');

    let totalMarketsCreated = 0;
    for (const match of createdMatches) {
      const markets = generateMarketsForMatch(match);

      for (const marketData of markets) {
        await strapi.db.query('api::market.market').create({
          data: {
            ...marketData,
            match: match.id
          }
        });
        totalMarketsCreated++;
      }
    }

    console.log(`✅ ${totalMarketsCreated} mercados de apuestas creados (${Math.floor(totalMarketsCreated / createdMatches.length)} por partido)`);

    // 10. Crear un parley de ejemplo completo
    console.log('\n🎯 Creando ticket de parley de ejemplo...');

    const allMarkets = await strapi.db.query('api::market.market').findMany({
      populate: ['match']
    });

    // Seleccionar 4 mercados de diferentes partidos para el parley de ejemplo
    const selectedMarkets = [];
    const usedMatches = new Set();

    for (const market of allMarkets) {
      if (market.marketType === 'moneyline' && market.selection.includes('Local') && !usedMatches.has(market.match.id)) {
        selectedMarkets.push(market);
        usedMatches.add(market.match.id);
        if (selectedMarkets.length === 4) break;
      }
    }

    if (selectedMarkets.length >= 2) {
      // Calcular totalOdds y potentialWin
      const betAmount = 100;
      const totalOdds = selectedMarkets.reduce((acc, m) => acc * parseFloat(m.odds), 1);
      const potentialWin = betAmount * totalOdds;

      const ticketCode = `PAR-DEMO-${Date.now()}`;

      const exampleTicket = await strapi.db.query('api::parley-ticket.parley-ticket').create({
        data: {
          ticketCode,
          betAmount,
          totalOdds: parseFloat(totalOdds.toFixed(2)),
          potentialWin: parseFloat(potentialWin.toFixed(2)),
          status: 'pending',
          userName: 'Usuario Demo',
          userPhone: '+58 412 1234567',
          paidAmount: 0
        }
      });

      // Crear legs
      for (const market of selectedMarkets) {
        await strapi.db.query('api::parley-leg.parley-leg').create({
          data: {
            ticket: exampleTicket.id,
            market: market.id,
            odds: market.odds,
            status: 'pending'
          }
        });
      }

      console.log(`✅ Ticket de parley de ejemplo creado:`);
      console.log(`   • Código: ${ticketCode}`);
      console.log(`   • Apuesta: $${betAmount}`);
      console.log(`   • Cuotas totales: ${totalOdds.toFixed(2)}`);
      console.log(`   • Ganancia potencial: $${potentialWin.toFixed(2)}`);
      console.log(`   • Selecciones: ${selectedMarkets.length} partidos`);
    }

    // 11. Habilitar todos los permisos públicos para pruebas
    console.log('\n🔓 Activando permisos públicos para pruebas...');
    const publicRole = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (publicRole) {
      const usersPermissionsService = strapi.plugin('users-permissions').service('users-permissions');
      const roleService = strapi.plugin('users-permissions').service('role');

      const permissionsTemplate = usersPermissionsService.getActions({ defaultEnable: false });

      Object.values(permissionsTemplate).forEach((typeConfig) => {
        Object.values(typeConfig.controllers).forEach((controllerConfig) => {
          Object.keys(controllerConfig).forEach((actionName) => {
            controllerConfig[actionName].enabled = true;
          });
        });
      });

      await roleService.updateRole(publicRole.id, { permissions: permissionsTemplate });
      console.log('✅ Permisos públicos activados para todos los endpoints');
    }

    console.log('\n✨ ¡Seed mejorado completado exitosamente!\n');
    console.log('📊 Resumen de datos creados:');
    console.log(`   • ${ANIMALITOS_DATA.length} animalitos`);
    console.log(`   • ${LOTTERIES_DATA.length} loterías`);
    console.log(`   • ${ANIMALITOS_GAMES_DATA.length} juegos de animalitos`);
    console.log(`   • ${SPORTS_DATA.length} deportes`);
    console.log(`   • ${CHAMPIONS_TEAMS.length} equipos de Champions League`);
    console.log(`   • ${createdMatches.length} partidos para mañana (27 nov)`);
    console.log(`   • ${totalMarketsCreated} mercados de apuestas`);
    console.log(`   • 1 ticket de parley de ejemplo`);
    console.log('\n🎉 ¡Base de datos lista con casos de prueba completos!\n');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  }
}

// Bootstrap de Strapi
async function main() {
  const { default: Strapi } = require('@strapi/strapi');
  const app = await Strapi({ distDir: './dist' }).load();

  await seed({ strapi: app });

  await app.destroy();
  console.log('\n👋 Cerrando Strapi...');
  process.exit(0);
}

main().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
