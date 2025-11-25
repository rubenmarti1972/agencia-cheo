import type { Core } from '@strapi/strapi';
import { getCronJobs, CronJobs } from './jobs';
import { logger } from '../utils/logger';

/**
 * Scheduler principal que maneja el ciclo de vida de los cron jobs
 */
class Scheduler {
  private cronJobs: CronJobs | null = null;

  /**
   * Inicializa el scheduler con la instancia de Strapi
   */
  initialize(strapi: Core.Strapi): void {
    logger.info('Scheduler', 'Inicializando scheduler...');

    this.cronJobs = getCronJobs(strapi);

    // Iniciar los jobs solo si no estamos en modo desarrollo con hot reload
    if (process.env.NODE_ENV === 'production' || process.env.ENABLE_CRON === 'true') {
      this.cronJobs.start();
      logger.info('Scheduler', 'Cron jobs activados');
    } else {
      logger.warn(
        'Scheduler',
        'Cron jobs NO activados (set ENABLE_CRON=true para activar en desarrollo)'
      );
    }
  }

  /**
   * Detiene todos los jobs
   */
  shutdown(): void {
    if (this.cronJobs) {
      logger.info('Scheduler', 'Deteniendo scheduler...');
      this.cronJobs.stop();
      this.cronJobs = null;
    }
  }

  /**
   * Ejecuta scraping manual (para testing o triggers manuales)
   */
  async runManual(): Promise<void> {
    if (!this.cronJobs) {
      throw new Error('Scheduler no inicializado');
    }

    await this.cronJobs.runManual();
  }

  /**
   * Obtiene el estado actual de los jobs
   */
  getStatus(): { name: string; running: boolean }[] {
    if (!this.cronJobs) {
      return [];
    }

    return this.cronJobs.getStatus();
  }
}

// Singleton instance
export const scheduler = new Scheduler();

/**
 * Función para integrar el scheduler con Strapi lifecycle
 */
export function bootstrapScheduler(strapi: Core.Strapi): void {
  // Iniciar cuando Strapi arranca
  strapi.server.httpServer?.on('listening', () => {
    scheduler.initialize(strapi);
  });

  // Detener cuando Strapi se cierra
  const shutdown = (): void => {
    scheduler.shutdown();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}
