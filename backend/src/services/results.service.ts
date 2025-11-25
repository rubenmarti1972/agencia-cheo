import type { Core } from '@strapi/strapi';
import { logger } from '../utils/logger';
import { scrapeAnimalitos, AnimalitoResult } from '../scrapers/animalitos.scraper';
import { scrapeLotteries, LotteryResult } from '../scrapers/lottery.scraper';
import { getTicketsUpdater } from './tickets-updater.service';

/**
 * Servicio para gestionar la obtención y actualización de resultados
 * Integra scraping con actualización de base de datos
 */
export class ResultsService {
  private strapi: Core.Strapi;

  constructor(strapi: Core.Strapi) {
    this.strapi = strapi;
  }

  /**
   * Procesa resultados de animalitos desde scraping
   * 1. Scrape resultados
   * 2. Actualiza sorteos en BD
   * 3. Actualiza tickets
   */
  async processAnimalitoResults(): Promise<{
    success: boolean;
    processed: number;
    updated: number;
    errors: string[];
  }> {
    logger.info('ResultsService', 'Iniciando procesamiento de resultados de animalitos');

    const errors: string[] = [];
    let processed = 0;
    let updated = 0;

    try {
      // 1. Scrape resultados
      const scrapeResult = await scrapeAnimalitos();

      if (!scrapeResult.success || !scrapeResult.data) {
        const error = `Scraping falló: ${scrapeResult.error}`;
        logger.error('ResultsService', error);
        errors.push(error);
        return { success: false, processed: 0, updated: 0, errors };
      }

      const results = scrapeResult.data;
      logger.info('ResultsService', `Scraped ${results.length} resultados de animalitos`);

      // 2. Procesar cada resultado
      for (const result of results) {
        try {
          processed++;
          const wasUpdated = await this.updateAnimalitoResult(result);
          if (wasUpdated) {
            updated++;
          }
        } catch (error) {
          const errorMsg = `Error procesando ${result.gameName}: ${error}`;
          logger.error('ResultsService', errorMsg);
          errors.push(errorMsg);
        }
      }

      logger.info('ResultsService', 'Procesamiento de animalitos completado', {
        processed,
        updated,
        errors: errors.length
      });

      return {
        success: errors.length === 0,
        processed,
        updated,
        errors
      };
    } catch (error) {
      const errorMsg = `Error fatal en procesamiento de animalitos: ${error}`;
      logger.error('ResultsService', errorMsg);
      errors.push(errorMsg);
      return { success: false, processed, updated, errors };
    }
  }

  /**
   * Actualiza un resultado individual de animalitos
   */
  private async updateAnimalitoResult(result: AnimalitoResult): Promise<boolean> {
    logger.info('ResultsService', 'Actualizando resultado de animalito', {
      game: result.gameName,
      winner: result.winningNumber,
      date: result.drawDate
    });

    try {
      // 1. Buscar el juego por nombre
      const games = await this.strapi.entityService.findMany(
        'api::animalitos-game.animalitos-game',
        {
          filters: {
            name: { $containsi: result.gameName }
          }
        }
      );

      if (!games || games.length === 0) {
        logger.warn('ResultsService', `Juego no encontrado: ${result.gameName}`);
        return false;
      }

      const game = games[0];

      // 2. Buscar el sorteo del día
      const draws = await this.strapi.entityService.findMany(
        'api::animalitos-draw.animalitos-draw',
        {
          filters: {
            game: { id: game.id },
            drawDate: result.drawDate,
            status: { $in: ['open', 'closed'] }
          }
        }
      );

      if (!draws || draws.length === 0) {
        logger.warn('ResultsService', 'Sorteo no encontrado o ya procesado', {
          game: result.gameName,
          date: result.drawDate
        });
        return false;
      }

      const draw = draws[0];

      // 3. Verificar que no esté ya actualizado
      if (draw.status === 'result_published' && draw.winningAnimalNumber) {
        logger.info('ResultsService', 'Sorteo ya tiene resultado publicado', {
          drawId: draw.id,
          existing: draw.winningAnimalNumber
        });
        return false;
      }

      // 4. Actualizar el sorteo con el resultado
      await this.strapi.entityService.update(
        'api::animalitos-draw.animalitos-draw',
        draw.id,
        {
          data: {
            winningAnimalNumber: result.winningNumber,
            status: 'result_published'
          }
        }
      );

      logger.info('ResultsService', 'Sorteo actualizado con resultado', {
        drawId: draw.id,
        winner: result.winningNumber
      });

      // 5. Actualizar tickets
      const ticketsUpdater = getTicketsUpdater(this.strapi);
      const updateResult = await ticketsUpdater.updateAnimalitosTickets(
        draw.id,
        result.winningNumber
      );

      logger.info('ResultsService', 'Tickets actualizados', updateResult);

      return true;
    } catch (error) {
      logger.error('ResultsService', 'Error actualizando resultado de animalito', {
        result,
        error
      });
      throw error;
    }
  }

  /**
   * Procesa resultados de loterías desde scraping
   */
  async processLotteryResults(): Promise<{
    success: boolean;
    processed: number;
    updated: number;
    errors: string[];
  }> {
    logger.info('ResultsService', 'Iniciando procesamiento de resultados de loterías');

    const errors: string[] = [];
    let processed = 0;
    let updated = 0;

    try {
      // 1. Scrape resultados
      const scrapeResult = await scrapeLotteries();

      if (!scrapeResult.success || !scrapeResult.data) {
        const error = `Scraping de loterías falló: ${scrapeResult.error}`;
        logger.error('ResultsService', error);
        errors.push(error);
        return { success: false, processed: 0, updated: 0, errors };
      }

      const results = scrapeResult.data;
      logger.info('ResultsService', `Scraped ${results.length} resultados de loterías`);

      // 2. Procesar cada resultado
      for (const result of results) {
        try {
          processed++;
          const wasUpdated = await this.updateLotteryResult(result);
          if (wasUpdated) {
            updated++;
          }
        } catch (error) {
          const errorMsg = `Error procesando ${result.lotteryName}: ${error}`;
          logger.error('ResultsService', errorMsg);
          errors.push(errorMsg);
        }
      }

      logger.info('ResultsService', 'Procesamiento de loterías completado', {
        processed,
        updated,
        errors: errors.length
      });

      return {
        success: errors.length === 0,
        processed,
        updated,
        errors
      };
    } catch (error) {
      const errorMsg = `Error fatal en procesamiento de loterías: ${error}`;
      logger.error('ResultsService', errorMsg);
      errors.push(errorMsg);
      return { success: false, processed, updated, errors };
    }
  }

  /**
   * Actualiza un resultado individual de lotería
   */
  private async updateLotteryResult(result: LotteryResult): Promise<boolean> {
    logger.info('ResultsService', 'Actualizando resultado de lotería', {
      lottery: result.lotteryName,
      winner: result.winningNumber,
      date: result.drawDate
    });

    try {
      // 1. Buscar la lotería por nombre
      const lotteries = await this.strapi.entityService.findMany(
        'api::lottery.lottery',
        {
          filters: {
            name: { $containsi: result.lotteryName }
          }
        }
      );

      if (!lotteries || lotteries.length === 0) {
        logger.warn('ResultsService', `Lotería no encontrada: ${result.lotteryName}`);
        return false;
      }

      const lottery = lotteries[0];

      // 2. Buscar el sorteo del día
      const draws = await this.strapi.entityService.findMany(
        'api::lottery-draw.lottery-draw',
        {
          filters: {
            lottery: { id: lottery.id },
            drawDate: result.drawDate,
            status: { $in: ['open', 'closed'] }
          }
        }
      );

      if (!draws || draws.length === 0) {
        logger.warn('ResultsService', 'Sorteo de lotería no encontrado', {
          lottery: result.lotteryName,
          date: result.drawDate
        });
        return false;
      }

      const draw = draws[0];

      // 3. Verificar que no esté ya actualizado
      if (draw.status === 'result_published' && draw.winningNumber) {
        logger.info('ResultsService', 'Sorteo ya tiene resultado', {
          drawId: draw.id,
          existing: draw.winningNumber
        });
        return false;
      }

      // 4. Actualizar el sorteo con el resultado
      await this.strapi.entityService.update(
        'api::lottery-draw.lottery-draw',
        draw.id,
        {
          data: {
            winningNumber: result.winningNumber,
            status: 'result_published'
          }
        }
      );

      logger.info('ResultsService', 'Sorteo de lotería actualizado', {
        drawId: draw.id,
        winner: result.winningNumber
      });

      // 5. Actualizar tickets
      const ticketsUpdater = getTicketsUpdater(this.strapi);
      const updateResult = await ticketsUpdater.updateLotteryTickets(
        draw.id,
        result.winningNumber
      );

      logger.info('ResultsService', 'Tickets de lotería actualizados', updateResult);

      return true;
    } catch (error) {
      logger.error('ResultsService', 'Error actualizando resultado de lotería', {
        result,
        error
      });
      throw error;
    }
  }

  /**
   * Procesa todos los resultados (animalitos y loterías)
   */
  async processAllResults(): Promise<{
    success: boolean;
    animalitos: { processed: number; updated: number };
    lotteries: { processed: number; updated: number };
    errors: string[];
  }> {
    logger.info('ResultsService', 'Procesando TODOS los resultados');

    const animalitoResults = await this.processAnimalitoResults();
    const lotteryResults = await this.processLotteryResults();

    const allErrors = [...animalitoResults.errors, ...lotteryResults.errors];

    return {
      success: allErrors.length === 0,
      animalitos: {
        processed: animalitoResults.processed,
        updated: animalitoResults.updated
      },
      lotteries: {
        processed: lotteryResults.processed,
        updated: lotteryResults.updated
      },
      errors: allErrors
    };
  }
}

/**
 * Factory function para obtener instancia del servicio
 */
export function getResultsService(strapi: Core.Strapi): ResultsService {
  return new ResultsService(strapi);
}
