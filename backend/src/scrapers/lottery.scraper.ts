import { Page } from 'playwright';
import { BaseScraper, ScrapeResult } from './base.scraper';
import { logger } from '../utils/logger';

export interface LotteryResult {
  lotteryName: string;
  winningNumber: string;
  drawDate: string;
  drawTime: string;
}

/**
 * Scraper para resultados de loterías venezolanas
 * Extrae números ganadores de diferentes loterías
 */
export class LotteryScraper extends BaseScraper<LotteryResult[]> {
  constructor() {
    super({
      name: 'LotteryScraper',
      maxRetries: 3,
      timeout: 15000,
      waitForSelector: 'body'
    });
  }

  /**
   * Lógica de scraping específica para loterías
   * NOTA: Estos selectores son ejemplos, deben ajustarse a los sitios reales
   */
  protected async scrapeData(page: Page): Promise<LotteryResult[]> {
    logger.debug(this.config.name, 'Extrayendo datos de loterías...');

    const results: LotteryResult[] = [];
    const today = new Date().toISOString().split('T')[0];

    try {
      // Esperar a que cargue el contenido
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
        logger.warn(this.config.name, 'Timeout en networkidle, continuando...');
      });

      // Extraer resultados del DOM
      const resultsData = await page.evaluate((): { lottery: string; number: string; time: string }[] => {
        const rows = document.querySelectorAll(
          '.resultado-loteria, .lottery-result, [data-lottery], .resultado'
        );
        const extracted: { lottery: string; number: string; time: string }[] = [];

        rows.forEach((row: Element) => {
          // Intentar diferentes estructuras de HTML comunes
          const lotteryEl = row.querySelector(
            '.lottery-name, .nombre-loteria, [data-lottery-name], h3, h4'
          );
          const numberEl = row.querySelector(
            '.winning-number, .numero-ganador, [data-number], .number'
          );
          const timeEl = row.querySelector(
            '.draw-time, .hora-sorteo, [data-time], .time'
          );

          if (lotteryEl && numberEl) {
            extracted.push({
              lottery: lotteryEl.textContent?.trim() || '',
              number: numberEl.textContent?.trim() || '',
              time: timeEl?.textContent?.trim() || ''
            });
          }
        });

        return extracted;
      });

      // Procesar cada resultado
      for (const item of resultsData) {
        const parsedResult = this.parseLotteryResult(item, today);
        if (parsedResult) {
          results.push(parsedResult);
        }
      }

      logger.debug(this.config.name, `Extraídos ${results.length} resultados de loterías`);

      return results;
    } catch (error) {
      logger.error(this.config.name, 'Error extrayendo datos de loterías', { error });
      throw error;
    }
  }

  /**
   * Parsea y normaliza un resultado individual de lotería
   */
  private parseLotteryResult(
    raw: { lottery: string; number: string; time: string },
    date: string
  ): LotteryResult | null {
    try {
      // Extraer número (puede ser de 2-4 dígitos generalmente)
      const numberMatch = raw.number.match(/(\d{2,4})/);
      if (!numberMatch) {
        logger.warn(this.config.name, 'No se pudo extraer número de lotería', { raw });
        return null;
      }

      const winningNumber = numberMatch[1];

      // Normalizar nombre de la lotería
      const lotteryName = this.normalizeLotteryName(raw.lottery);

      // Normalizar hora
      const drawTime = this.normalizeTime(raw.time);

      return {
        lotteryName,
        winningNumber,
        drawDate: date,
        drawTime
      };
    } catch (error) {
      logger.warn(this.config.name, 'Error parseando resultado de lotería', { raw, error });
      return null;
    }
  }

  /**
   * Normaliza el nombre de la lotería
   */
  private normalizeLotteryName(name: string): string {
    const normalized = name.toLowerCase().trim();

    // Mapear nombres comunes a nombres estándar
    const mappings: Record<string, string> = {
      'zulia': 'Lotería del Zulia',
      'tachira': 'Lotería del Táchira',
      'táchira': 'Lotería del Táchira',
      'caracas': 'Lotería de Caracas',
      'lara': 'Lotería del Lara',
      'triple': 'Triple',
      'triplea': 'Triple A',
      'triple a': 'Triple A',
      'triple zamorano': 'Triple Zamorano',
      'zamorano': 'Triple Zamorano',
      'guacharo': 'Guácharo Activo',
      'gúacharo': 'Guácharo Activo',
      'granjita': 'La Granjita'
    };

    for (const [key, value] of Object.entries(mappings)) {
      if (normalized.includes(key)) {
        return value;
      }
    }

    // Si no hay match, capitalizar el nombre original
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Normaliza el tiempo a formato HH:MM:SS
   */
  private normalizeTime(timeStr: string): string {
    // Si ya está en formato correcto
    if (timeStr.match(/^\d{2}:\d{2}:\d{2}$/)) {
      return timeStr;
    }

    // Intentar extraer HH:MM
    const match = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (match) {
      const hours = match[1].padStart(2, '0');
      const minutes = match[2];
      return `${hours}:${minutes}:00`;
    }

    // Inferir basado en horarios comunes de loterías
    const hour = timeStr.toLowerCase();
    if (hour.includes('1') && hour.includes('pm')) return '13:00:00';
    if (hour.includes('4') && hour.includes('pm')) return '16:00:00';
    if (hour.includes('7') && hour.includes('pm')) return '19:00:00';

    // Default a mediodía
    return '12:00:00';
  }

  /**
   * Valida que los datos extraídos sean correctos
   */
  protected validateData(data: LotteryResult[]): boolean {
    if (!Array.isArray(data) || data.length === 0) {
      logger.warn(this.config.name, 'No se encontraron resultados de loterías');
      return false;
    }

    // Validar cada resultado
    for (const result of data) {
      // Validar número ganador (mínimo 2 dígitos)
      if (!result.winningNumber || result.winningNumber.length < 2) {
        logger.warn(this.config.name, 'Número ganador inválido', { result });
        return false;
      }

      // Validar que tenga nombre de lotería
      if (!result.lotteryName) {
        logger.warn(this.config.name, 'Nombre de lotería faltante', { result });
        return false;
      }

      // Validar fecha
      if (!result.drawDate || !result.drawDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        logger.warn(this.config.name, 'Fecha inválida', { result });
        return false;
      }
    }

    logger.info(this.config.name, 'Validación de loterías exitosa', {
      resultCount: data.length
    });

    return true;
  }

  /**
   * Scrape con múltiples fuentes de loterías
   */
  async scrapeLotteryResults(): Promise<ScrapeResult<LotteryResult[]>> {
    const sources = [
      'https://guacharoactivo.com.ve/resultados',
      'https://triplescandela.com/resultados',
      'https://lagranjitaanimalitos.com/resultados'
      // Agregar más fuentes según disponibilidad
    ];

    logger.info(this.config.name, 'Iniciando scraping de loterías');

    return await this.scrapeWithFallback(sources);
  }
}

/**
 * Función helper para uso directo
 */
export async function scrapeLotteries(): Promise<ScrapeResult<LotteryResult[]>> {
  const scraper = new LotteryScraper();
  return await scraper.scrapeLotteryResults();
}
