import * as cron from 'node-cron';
import type { Core } from '@strapi/strapi';
import { logger } from '../utils/logger';
import { getResultsService } from '../services';

/**
 * Configuración y manejo de cron jobs para scraping automático
 */
export class CronJobs {
  private strapi: Core.Strapi;
  private jobs: Map<string, cron.ScheduledTask> = new Map();

  constructor(strapi: Core.Strapi) {
    this.strapi = strapi;
  }

  /**
   * Inicia todos los cron jobs
   */
  start(): void {
    logger.info('CronJobs', 'Iniciando cron jobs...');

    // Job principal: cada 5 minutos revisa si hay nuevos resultados
    this.scheduleMainJob();

    // Jobs específicos para horarios conocidos de animalitos
    this.scheduleAnimalitoJobs();

    // Job para loterías (horarios comunes: 1pm, 4pm, 7pm)
    this.scheduleLotteryJobs();

    logger.info('CronJobs', `${this.jobs.size} cron jobs iniciados`);
  }

  /**
   * Detiene todos los cron jobs
   */
  stop(): void {
    logger.info('CronJobs', 'Deteniendo cron jobs...');

    this.jobs.forEach((job, name) => {
      job.stop();
      logger.info('CronJobs', `Job detenido: ${name}`);
    });

    this.jobs.clear();
  }

  /**
   * Job principal que se ejecuta cada 5 minutos
   * Revisa si hay nuevos resultados disponibles
   */
  private scheduleMainJob(): void {
    const jobName = 'main-results-check';

    // Ejecutar cada 5 minutos: */5 * * * *
    const job = cron.schedule('*/5 * * * *', async () => {
      logger.info('CronJobs', `[${jobName}] Ejecutando...`);

      try {
        const resultsService = getResultsService(this.strapi);
        const result = await resultsService.processAllResults();

        logger.info('CronJobs', `[${jobName}] Completado`, {
          success: result.success,
          animalitosupdated: result.animalitos.updated,
          lotteriesUpdated: result.lotteries.updated,
          errors: result.errors.length
        });

        if (result.errors.length > 0) {
          logger.warn('CronJobs', `[${jobName}] Errores detectados`, {
            errors: result.errors
          });
        }
      } catch (error) {
        logger.error('CronJobs', `[${jobName}] Error fatal`, { error });
      }
    });

    this.jobs.set(jobName, job);

    logger.info('CronJobs', `Job programado: ${jobName} (cada 5 minutos)`);
  }

  /**
   * Jobs específicos para animalitos en horarios conocidos
   * Ejecutan 5 minutos después del sorteo para dar tiempo a que publiquen
   */
  private scheduleAnimalitoJobs(): void {
    const schedules = [
      { name: 'animalitos-9am', time: '09:05 AM', cron: '5 9 * * *' },
      { name: 'animalitos-12pm', time: '12:05 PM', cron: '5 12 * * *' },
      { name: 'animalitos-4pm', time: '4:05 PM', cron: '5 16 * * *' },
      { name: 'animalitos-7pm', time: '7:05 PM', cron: '5 19 * * *' }
    ];

    schedules.forEach(schedule => {
      const job = cron.schedule(schedule.cron, async () => {
        logger.info('CronJobs', `[${schedule.name}] Ejecutando scraping de animalitos ${schedule.time}`);

        try {
          const resultsService = getResultsService(this.strapi);
          const result = await resultsService.processAnimalitoResults();

          logger.info('CronJobs', `[${schedule.name}] Completado`, {
            processed: result.processed,
            updated: result.updated,
            errors: result.errors.length
          });

          if (!result.success) {
            logger.error('CronJobs', `[${schedule.name}] Falló`, {
              errors: result.errors
            });
          }
        } catch (error) {
          logger.error('CronJobs', `[${schedule.name}] Error fatal`, { error });
        }
      });

      this.jobs.set(schedule.name, job);

      logger.info('CronJobs', `Job programado: ${schedule.name} (${schedule.time})`);
    });
  }

  /**
   * Jobs específicos para loterías en horarios comunes
   * Ejecutan 10 minutos después del sorteo
   */
  private scheduleLotteryJobs(): void {
    const schedules = [
      { name: 'lottery-1pm', time: '1:10 PM', cron: '10 13 * * *' },
      { name: 'lottery-4pm', time: '4:10 PM', cron: '10 16 * * *' },
      { name: 'lottery-7pm', time: '7:10 PM', cron: '10 19 * * *' }
    ];

    schedules.forEach(schedule => {
      const job = cron.schedule(schedule.cron, async () => {
        logger.info('CronJobs', `[${schedule.name}] Ejecutando scraping de loterías ${schedule.time}`);

        try {
          const resultsService = getResultsService(this.strapi);
          const result = await resultsService.processLotteryResults();

          logger.info('CronJobs', `[${schedule.name}] Completado`, {
            processed: result.processed,
            updated: result.updated,
            errors: result.errors.length
          });

          if (!result.success) {
            logger.error('CronJobs', `[${schedule.name}] Falló`, {
              errors: result.errors
            });
          }
        } catch (error) {
          logger.error('CronJobs', `[${schedule.name}] Error fatal`, { error });
        }
      });

      this.jobs.set(schedule.name, job);

      logger.info('CronJobs', `Job programado: ${schedule.name} (${schedule.time})`);
    });
  }

  /**
   * Ejecuta manualmente el scraping (útil para testing)
   */
  async runManual(): Promise<void> {
    logger.info('CronJobs', 'Ejecutando scraping manual...');

    const resultsService = getResultsService(this.strapi);
    const result = await resultsService.processAllResults();

    logger.info('CronJobs', 'Scraping manual completado', result);
  }

  /**
   * Obtiene el estado de todos los jobs
   */
  getStatus(): { name: string; running: boolean }[] {
    const status: { name: string; running: boolean }[] = [];

    this.jobs.forEach((job, name) => {
      status.push({
        name,
        running: job.getStatus() === 'scheduled'
      });
    });

    return status;
  }
}

/**
 * Factory function para obtener instancia del scheduler
 */
export function getCronJobs(strapi: Core.Strapi): CronJobs {
  return new CronJobs(strapi);
}
