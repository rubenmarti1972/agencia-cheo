// @ts-nocheck
/**
 * Función de seed para poblar la base de datos
 * Se puede llamar desde el bootstrap de Strapi
 */

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
    name: 'Lotería del Zulia',
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
    name: 'Lotería de Caracas',
    description: 'Lotería de la capital',
    isActive: true,
    minBetAmount: 1.0,
    maxBetAmount: 1000.0,
    payoutMultiplier: 75.0
  },
  {
    name: 'Chance Táchira',
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
  { name: 'Fútbol', isActive: true },
  { name: 'Béisbol', isActive: true },
  { name: 'Baloncesto', isActive: true },
  { name: 'Tenis', isActive: true }
];

export async function runSeed() {
  console.log('\n🌱 Iniciando seed de la base de datos...\n');

  try {
    console.log('📊 Verificando datos existentes...\n');

    // 1. Crear animalitos
    console.log('🐾 Creando animalitos...');
    const existingAnimalitos = await strapi.db.query('api::animalito.animalito').findMany();

    if (existingAnimalitos.length === 0) {
      for (const animalito of ANIMALITOS_DATA) {
        await strapi.db.query('api::animalito.animalito').create({ data: animalito });
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
        await strapi.db.query('api::lottery.lottery').create({ data: lottery });
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
        await strapi.db.query('api::animalitos-game.animalitos-game').create({ data: game });
      }
      console.log(`✅ ${ANIMALITOS_GAMES_DATA.length} juegos de animalitos creados`);
    } else {
      console.log(`ℹ️  Ya existen ${existingGames.length} juegos, omitiendo...`);
    }

    // 4. Crear deportes
    console.log('\n⚽ Creando deportes...');
    const existingSports = await strapi.db.query('api::sport.sport').findMany();

    if (existingSports.length === 0) {
      for (const sport of SPORTS_DATA) {
        await strapi.db.query('api::sport.sport').create({ data: sport });
      }
      console.log(`✅ ${SPORTS_DATA.length} deportes creados`);
    } else {
      console.log(`ℹ️  Ya existen ${existingSports.length} deportes, omitiendo...`);
    }

    // 5. Crear sorteos de animalitos para hoy
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

    // 6. Crear sorteos de lotería para hoy
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

    // 7. Crear equipos de ejemplo
    console.log('\n⚽ Creando equipos de ejemplo...');
    const sports = await strapi.db.query('api::sport.sport').findMany();
    const futbol = sports.find(s => s.name === 'Fútbol');

    const existingTeams = await strapi.db.query('api::team.team').findMany();

    if (existingTeams.length === 0 && futbol) {
      const TEAMS_DATA = [
        {
          name: 'Real Madrid',
          shortName: 'RMA',
          sport: futbol.id,
          country: 'España',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg'
        },
        {
          name: 'Barcelona',
          shortName: 'BAR',
          sport: futbol.id,
          country: 'España',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg'
        },
        {
          name: 'Manchester United',
          shortName: 'MUN',
          sport: futbol.id,
          country: 'Inglaterra',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg'
        },
        {
          name: 'Liverpool',
          shortName: 'LIV',
          sport: futbol.id,
          country: 'Inglaterra',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg'
        },
        {
          name: 'Bayern Munich',
          shortName: 'BAY',
          sport: futbol.id,
          country: 'Alemania',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg'
        },
        {
          name: 'PSG',
          shortName: 'PSG',
          sport: futbol.id,
          country: 'Francia',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg'
        }
      ];

      for (const team of TEAMS_DATA) {
        await strapi.db.query('api::team.team').create({ data: team });
      }
      console.log(`✅ ${TEAMS_DATA.length} equipos creados con logos`);
    } else {
      console.log(`ℹ️  Ya existen equipos, omitiendo...`);
    }

    // 8. Crear partidos de ejemplo
    console.log('\n🏟️  Creando partidos de ejemplo...');
    const teams = await strapi.db.query('api::team.team').findMany({ limit: 6 });

    if (teams.length >= 4 && futbol) {
      // SIEMPRE eliminar partidos antiguos y recrearlos con fechas frescas
      const existingMatches = await strapi.db.query('api::match.match').findMany();

      if (existingMatches.length > 0) {
        console.log(`   Eliminando ${existingMatches.length} partidos antiguos...`);
        // Primero eliminar markets asociados
        for (const match of existingMatches) {
          const markets = await strapi.db.query('api::market.market').findMany({
            where: { match: match.id }
          });
          for (const market of markets) {
            await strapi.db.query('api::market.market').delete({ where: { id: market.id } });
          }
        }
        // Luego eliminar partidos
        for (const match of existingMatches) {
          await strapi.db.query('api::match.match').delete({ where: { id: match.id } });
        }
      }

      // Crear partidos nuevos con fechas frescas
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const MATCHES_DATA = [
        {
          sport: futbol.id,
          homeTeam: teams[0].id,
          awayTeam: teams[1].id,
          matchDate: `${tomorrowStr}T18:00:00.000Z`,
          status: 'scheduled'
        },
        {
          sport: futbol.id,
          homeTeam: teams[2].id,
          awayTeam: teams[3].id,
          matchDate: `${tomorrowStr}T20:00:00.000Z`,
          status: 'scheduled'
        }
      ];

      for (const match of MATCHES_DATA) {
        await strapi.db.query('api::match.match').create({ data: match });
      }
      console.log(`✅ ${MATCHES_DATA.length} partidos creados para mañana (${tomorrowStr})`);
    } else {
      console.log(`ℹ️  No hay suficientes equipos para crear partidos`);
    }

    // 9. Crear mercados de apuestas
    console.log('\n💰 Creando mercados de apuestas...');
    const matches = await strapi.db.query('api::match.match').findMany({
      populate: ['homeTeam', 'awayTeam']
    });

    if (matches.length > 0) {
      let marketsCreated = 0;

      for (const match of matches) {
        // Verificar si este match ya tiene markets
        const matchMarkets = await strapi.db.query('api::market.market').findMany({
          where: { match: match.id }
        });

        if (matchMarkets.length === 0) {
          const homeTeamName = match.homeTeam?.name || 'Local';
          const awayTeamName = match.awayTeam?.name || 'Visitante';

          // Crear markets con nombres descriptivos estilo casa de apuestas profesional
          await strapi.db.query('api::market.market').create({
            data: {
              match: match.id,
              marketType: 'moneyline',
              name: `1 - ${homeTeamName}`,
              selection: 'home',
              odds: 2.10,
              isActive: true,
              result: 'pending'
            }
          });

          await strapi.db.query('api::market.market').create({
            data: {
              match: match.id,
              marketType: 'moneyline',
              name: `X - Empate`,
              selection: 'draw',
              odds: 3.20,
              isActive: true,
              result: 'pending'
            }
          });

          await strapi.db.query('api::market.market').create({
            data: {
              match: match.id,
              marketType: 'moneyline',
              name: `2 - ${awayTeamName}`,
              selection: 'away',
              odds: 3.50,
              isActive: true,
              result: 'pending'
            }
          });

          // Agregar mercados adicionales tipo casas de apuestas profesionales
          await strapi.db.query('api::market.market').create({
            data: {
              match: match.id,
              marketType: 'over_under',
              name: 'Más de 2.5 goles',
              selection: 'over',
              odds: 1.85,
              line: 2.5,
              isActive: true,
              result: 'pending'
            }
          });

          await strapi.db.query('api::market.market').create({
            data: {
              match: match.id,
              marketType: 'over_under',
              name: 'Menos de 2.5 goles',
              selection: 'under',
              odds: 1.95,
              line: 2.5,
              isActive: true,
              result: 'pending'
            }
          });

          await strapi.db.query('api::market.market').create({
            data: {
              match: match.id,
              marketType: 'both_teams_score',
              name: 'Ambos equipos anotan - Sí',
              selection: 'yes',
              odds: 1.70,
              isActive: true,
              result: 'pending'
            }
          });

          await strapi.db.query('api::market.market').create({
            data: {
              match: match.id,
              marketType: 'both_teams_score',
              name: 'Ambos equipos anotan - No',
              selection: 'no',
              odds: 2.10,
              isActive: true,
              result: 'pending'
            }
          });

          marketsCreated += 7;
        }
      }

      if (marketsCreated > 0) {
        console.log(`✅ ${marketsCreated} mercados de apuestas creados`);
      } else {
        console.log(`ℹ️  Los partidos ya tienen mercados`);
      }
    } else {
      console.log(`ℹ️  No hay partidos para crear mercados`);
    }

    console.log('\n✨ ¡Seed completado exitosamente!\n');
    console.log('📊 Resumen de datos creados:');
    console.log(`   • ${ANIMALITOS_DATA.length} animalitos`);
    console.log(`   • ${LOTTERIES_DATA.length} loterías`);
    console.log(`   • ${ANIMALITOS_GAMES_DATA.length} juegos de animalitos`);
    console.log(`   • ${SPORTS_DATA.length} deportes`);
    console.log(`   • Sorteos para hoy`);
    console.log(`   • 6 equipos de fútbol`);
    console.log(`   • Partidos y mercados de ejemplo`);
    console.log('\n🎉 Tu base de datos está lista para usar!\n');

    return true;
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    return false;
  }
}
