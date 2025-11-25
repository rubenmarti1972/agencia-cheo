// @ts-nocheck
/**
 * Controller personalizado para API de resultados
 * Proporciona endpoints para consultar resultados del día
 */

export default {
  /**
   * GET /api/results/today
   * Retorna todos los resultados del día actual
   */
  async getToday(ctx: any) {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Buscar resultados de animalitos del día
      const animalitosDraws = await strapi.entityService.findMany(
        'api::animalitos-draw.animalitos-draw',
        {
          filters: {
            drawDate: today,
            status: 'result_published'
          },
          populate: ['game']
        }
      );
      const animalitosList = (Array.isArray(animalitosDraws)
        ? animalitosDraws
        : animalitosDraws
          ? [animalitosDraws]
          : []) as any[];

      // Buscar resultados de loterías del día
      const lotteryDraws = await strapi.entityService.findMany(
        'api::lottery-draw.lottery-draw',
        {
          filters: {
            drawDate: today,
            status: 'result_published'
          },
          populate: ['lottery']
        }
      );
      const lotteriesList = (Array.isArray(lotteryDraws) ? lotteryDraws : lotteryDraws ? [lotteryDraws] : []) as any[];

      // Formatear resultados de animalitos
      const animalitos = animalitosList.map((draw: {
        id: number;
        game?: { name: string };
        winningAnimalNumber: number;
        drawDate: string;
        createdAt: string;
      }) => ({
        game: draw.game?.name || 'Animalitos',
        winner: draw.winningAnimalNumber,
        time: draw.createdAt
      }));

      // Formatear resultados de loterías
      const loterias = lotteriesList.map((draw: {
        id: number;
        lottery?: { name: string };
        winningNumber: string;
        drawDate: string;
        drawTime: string;
        createdAt: string;
      }) => ({
        name: draw.lottery?.name || 'Lotería',
        winner: draw.winningNumber,
        time: `${draw.drawDate}T${draw.drawTime}`
      }));

      ctx.body = {
        date: today,
        animalitos,
        loterias
      };
    } catch (error) {
      ctx.throw(500, `Error obteniendo resultados: ${error}`);
    }
  },

  /**
   * GET /api/results/date/:date
   * Retorna todos los resultados de una fecha específica
   */
  async getByDate(ctx: any) {
    try {
      const { date } = ctx.params;

      // Validar formato de fecha
      if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        ctx.throw(400, 'Formato de fecha inválido. Use YYYY-MM-DD');
      }

      // Buscar resultados de animalitos
      const animalitosDraws = await strapi.entityService.findMany(
        'api::animalitos-draw.animalitos-draw',
        {
          filters: {
            drawDate: date,
            status: 'result_published'
          },
          populate: ['game']
        }
      );
      const animalitosList = (Array.isArray(animalitosDraws)
        ? animalitosDraws
        : animalitosDraws
          ? [animalitosDraws]
          : []) as any[];

      // Buscar resultados de loterías
      const lotteryDraws = await strapi.entityService.findMany(
        'api::lottery-draw.lottery-draw',
        {
          filters: {
            drawDate: date,
            status: 'result_published'
          },
          populate: ['lottery']
        }
      );
      const lotteriesList = (Array.isArray(lotteryDraws) ? lotteryDraws : lotteryDraws ? [lotteryDraws] : []) as any[];

      // Formatear resultados
      const animalitos = animalitosList.map((draw: {
        id: number;
        game?: { name: string };
        winningAnimalNumber: number;
        drawDate: string;
        createdAt: string;
      }) => ({
        game: draw.game?.name || 'Animalitos',
        winner: draw.winningAnimalNumber,
        time: draw.createdAt
      }));

      const loterias = lotteriesList.map((draw: {
        id: number;
        lottery?: { name: string };
        winningNumber: string;
        drawDate: string;
        drawTime: string;
      }) => ({
        name: draw.lottery?.name || 'Lotería',
        winner: draw.winningNumber,
        time: `${draw.drawDate}T${draw.drawTime}`
      }));

      ctx.body = {
        date,
        animalitos,
        loterias
      };
    } catch (error) {
      ctx.throw(500, `Error obteniendo resultados: ${error}`);
    }
  },

  /**
   * POST /api/results/scrape
   * Ejecuta el scraping manualmente (útil para testing)
   * NOTA: En producción, se debe proteger con autenticación
   */
  async scrapeNow(ctx: any) {
    try {
      const { getResultsService } = await import('../../../services');
      const resultsService = getResultsService(strapi);

      const result = await resultsService.processAllResults();

      ctx.body = {
        success: result.success,
        animalitos: result.animalitos,
        lotteries: result.lotteries,
        errors: result.errors
      };
    } catch (error) {
      ctx.throw(500, `Error ejecutando scraping: ${error}`);
    }
  },

  /**
   * GET /api/results/cron-status
   * Obtiene el estado de los cron jobs
   */
  async getCronStatus(ctx: any) {
    try {
      const { scheduler } = await import('../../../cron/scheduler');

      const status = scheduler.getStatus();

      ctx.body = {
        jobs: status,
        total: status.length,
        running: status.filter(j => j.running).length
      };
    } catch (error) {
      ctx.throw(500, `Error obteniendo estado de cron: ${error}`);
    }
  }
};
