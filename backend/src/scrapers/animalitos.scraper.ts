import { Page } from 'playwright';
import { BaseScraper, ScrapeResult } from './base.scraper';
import { logger } from '../utils/logger';

declare const document: any;

export interface AnimalitoResult {
  gameName: string;
  winningNumber: number;
  drawDate: string;
  scheduledTime: string;
}

/**
 * Scraper para resultados de animalitos
 * Extrae el número ganador de diferentes sitios web
 */
export class AnimalitosScraper extends BaseScraper<AnimalitoResult[]> {
  constructor() {
    super({
      name: 'AnimalitosScraper',
      maxRetries: 3,
      timeout: 15000,
      waitForSelector: 'body'
    });
  }

  /**
   * Lógica de scraping específica para animalitos
   * NOTA: Estos selectores son ejemplos, deben ajustarse a los sitios reales
   */
  protected async scrapeData(page: Page): Promise<AnimalitoResult[]> {
    logger.debug(this.config.name, 'Extrayendo datos de animalitos...');

    const results: AnimalitoResult[] = [];
    const today = new Date().toISOString().split('T')[0];

    try {
      // Ejemplo: Esperamos que el sitio tenga una tabla con resultados del día
      // Estos selectores DEBEN ajustarse a los sitios reales
      const resultsData = await page.evaluate((): { game: string; number: string; time: string }[] => {
        const rows = document.querySelectorAll('.resultado-animalito, .result-row, [data-game]');
        const extracted: { game: string; number: string; time: string }[] = [];

        rows.forEach((row: any) => {
          // Intentar diferentes estructuras comunes
          const gameEl = row.querySelector('.game-name, .nombre-juego, [data-game-name]');
          const numberEl = row.querySelector('.winning-number, .numero-ganador, [data-number]');
          const timeEl = row.querySelector('.game-time, .hora, [data-time]');

          if (gameEl && numberEl) {
            extracted.push({
              game: gameEl.textContent?.trim() || '',
              number: numberEl.textContent?.trim() || '',
              time: timeEl?.textContent?.trim() || ''
            });
          }
        });

        return extracted;
      });

      // Procesar y validar cada resultado
      for (const item of resultsData) {
        const parsedResult = this.parseAnimalitoResult(item, today);
        if (parsedResult) {
          results.push(parsedResult);
        }
      }

      logger.debug(this.config.name, `Extraídos ${results.length} resultados`);

      return results;
    } catch (error) {
      logger.error(this.config.name, 'Error extrayendo datos', { error });
      throw error;
    }
  }

  /**
   * Parsea y normaliza un resultado individual
   */
  private parseAnimalitoResult(
    raw: { game: string; number: string; time: string },
    date: string
  ): AnimalitoResult | null {
    try {
      // Extraer solo el número del texto (ej: "09 PERRO" -> 9)
      const numberMatch = raw.number.match(/(\d{1,2})/);
      if (!numberMatch) {
        logger.warn(this.config.name, 'No se pudo extraer número', { raw });
        return null;
      }

      const winningNumber = parseInt(numberMatch[1], 10);

      // Validar rango de animalitos (1-36)
      if (winningNumber < 1 || winningNumber > 36) {
        logger.warn(this.config.name, 'Número fuera de rango', { winningNumber });
        return null;
      }

      // Normalizar nombre del juego
      const gameName = this.normalizeGameName(raw.game);

      // Inferir hora si no está disponible
      const scheduledTime = this.inferGameTime(gameName, raw.time);

      return {
        gameName,
        winningNumber,
        drawDate: date,
        scheduledTime
      };
    } catch (error) {
      logger.warn(this.config.name, 'Error parseando resultado', { raw, error });
      return null;
    }
  }

  /**
   * Normaliza el nombre del juego a valores estándar
   */
  private normalizeGameName(name: string): string {
    const normalized = name.toLowerCase().trim();

    if (normalized.includes('9') || normalized.includes('nueve') || normalized.includes('mañana')) {
      return 'Animalitos 9am';
    }
    if (normalized.includes('12') || normalized.includes('doce') || normalized.includes('mediodía')) {
      return 'Animalitos 12pm';
    }
    if (normalized.includes('16') || normalized.includes('4') || normalized.includes('tarde')) {
      return 'Animalitos 4pm';
    }
    if (normalized.includes('19') || normalized.includes('7') || normalized.includes('noche')) {
      return 'Animalitos 7pm';
    }

    return name;
  }

  /**
   * Infiere la hora del juego basándose en el nombre
   */
  private inferGameTime(gameName: string, rawTime: string): string {
    // Si tenemos la hora del scraping, usarla
    if (rawTime && rawTime.match(/\d{1,2}:\d{2}/)) {
      return rawTime;
    }

    // Inferir basándose en el nombre
    if (gameName.includes('9am')) return '09:00:00';
    if (gameName.includes('12pm')) return '12:00:00';
    if (gameName.includes('4pm')) return '16:00:00';
    if (gameName.includes('7pm')) return '19:00:00';

    return '12:00:00'; // Default
  }

  /**
   * Valida que los datos extraídos sean correctos
   */
  protected validateData(data: AnimalitoResult[]): boolean {
    if (!Array.isArray(data) || data.length === 0) {
      logger.warn(this.config.name, 'No se encontraron resultados');
      return false;
    }

    // Validar cada resultado
    for (const result of data) {
      if (!result.winningNumber || result.winningNumber < 1 || result.winningNumber > 36) {
        logger.warn(this.config.name, 'Resultado inválido', { result });
        return false;
      }

      if (!result.gameName || !result.drawDate) {
        logger.warn(this.config.name, 'Datos incompletos', { result });
        return false;
      }
    }

    logger.info(this.config.name, 'Validación exitosa', {
      resultCount: data.length
    });

    return true;
  }

  /**
   * Scrape con múltiples fuentes de animalitos
   */
  async scrapeAnimalitoResults(): Promise<ScrapeResult<AnimalitoResult[]>> {
    const sources = [
      'https://guacharoactivo.com.ve/resultados',
      'https://triplescandela.com/resultados',
      'https://triplesleones.com/resultados'
      // Agregar más fuentes según disponibilidad
    ];

    logger.info(this.config.name, 'Iniciando scraping de animalitos');

    return await this.scrapeWithFallback(sources);
  }
}

/**
 * Función helper para uso directo
 */
export async function scrapeAnimalitos(): Promise<ScrapeResult<AnimalitoResult[]>> {
  const scraper = new AnimalitosScraper();
  return await scraper.scrapeAnimalitoResults();
}
