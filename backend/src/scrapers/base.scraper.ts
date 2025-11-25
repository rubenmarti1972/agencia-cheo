import { chromium, Browser, Page } from 'playwright';
import { logger } from '../utils/logger';

export interface ScraperConfig {
  name: string;
  maxRetries: number;
  timeout: number;
  waitForSelector?: string;
}

export interface ScrapeResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  source: string;
}

/**
 * Clase base abstracta para todos los scrapers
 * Maneja reintentos, timeouts, navegación y limpieza
 */
export abstract class BaseScraper<T> {
  protected config: ScraperConfig;
  private browser: Browser | null = null;
  private page: Page | null = null;

  constructor(config: ScraperConfig) {
    this.config = config;
  }

  /**
   * Método abstracto que debe implementar cada scraper
   * Contiene la lógica específica de scraping
   */
  protected abstract scrapeData(page: Page): Promise<T>;

  /**
   * Método abstracto para validar el dato obtenido
   */
  protected abstract validateData(data: T): boolean;

  /**
   * Inicializa el browser y la página
   */
  private async initialize(): Promise<void> {
    try {
      logger.debug(this.config.name, 'Inicializando browser...');

      this.browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      this.page = await this.browser.newPage();
      this.page.setDefaultTimeout(this.config.timeout);

      logger.debug(this.config.name, 'Browser inicializado correctamente');
    } catch (error) {
      logger.error(this.config.name, 'Error inicializando browser', { error });
      throw new Error(`Error inicializando browser: ${error}`);
    }
  }

  /**
   * Navega a una URL con manejo de errores
   */
  protected async navigateTo(url: string): Promise<void> {
    if (!this.page) {
      throw new Error('Page no inicializada');
    }

    logger.debug(this.config.name, `Navegando a ${url}`);

    try {
      await this.page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: this.config.timeout
      });

      // Esperar selector específico si está configurado
      if (this.config.waitForSelector) {
        await this.page.waitForSelector(this.config.waitForSelector, {
          timeout: this.config.timeout
        });
      }

      logger.debug(this.config.name, 'Navegación exitosa');
    } catch (error) {
      logger.error(this.config.name, `Error navegando a ${url}`, { error });
      throw new Error(`Error de navegación: ${error}`);
    }
  }

  /**
   * Limpia recursos (browser y page)
   */
  private async cleanup(): Promise<void> {
    try {
      if (this.page) {
        await this.page.close();
        this.page = null;
      }
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }
      logger.debug(this.config.name, 'Recursos liberados');
    } catch (error) {
      logger.warn(this.config.name, 'Error al liberar recursos', { error });
    }
  }

  /**
   * Ejecuta el scraping con un intento único
   */
  private async attemptScrape(): Promise<T> {
    if (!this.page) {
      throw new Error('Page no inicializada');
    }

    const data = await this.scrapeData(this.page);

    if (!this.validateData(data)) {
      throw new Error('Validación de datos falló');
    }

    return data;
  }

  /**
   * Ejecuta el scraping con reintentos
   */
  async scrape(url: string): Promise<ScrapeResult<T>> {
    let lastError: string = '';

    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        logger.info(
          this.config.name,
          `Intento ${attempt}/${this.config.maxRetries} de scraping`
        );

        await this.initialize();
        await this.navigateTo(url);
        const data = await this.attemptScrape();

        logger.info(this.config.name, 'Scraping exitoso', { data });

        return {
          success: true,
          data,
          source: url
        };
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);

        logger.warn(
          this.config.name,
          `Intento ${attempt} falló: ${lastError}`
        );

        // Esperar antes del siguiente intento (exponential backoff)
        if (attempt < this.config.maxRetries) {
          const waitTime = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s...
          logger.debug(this.config.name, `Esperando ${waitTime}ms antes del siguiente intento`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      } finally {
        await this.cleanup();
      }
    }

    // Todos los intentos fallaron
    logger.error(
      this.config.name,
      `Scraping falló después de ${this.config.maxRetries} intentos`,
      { lastError }
    );

    return {
      success: false,
      error: lastError,
      source: url
    };
  }

  /**
   * Intenta múltiples fuentes con fallback
   */
  async scrapeWithFallback(urls: string[]): Promise<ScrapeResult<T>> {
    logger.info(this.config.name, `Intentando scraping con ${urls.length} fuentes`);

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      logger.info(this.config.name, `Probando fuente ${i + 1}/${urls.length}: ${url}`);

      const result = await this.scrape(url);

      if (result.success) {
        logger.info(this.config.name, `Fuente ${i + 1} exitosa`);
        return result;
      }

      logger.warn(this.config.name, `Fuente ${i + 1} falló, probando siguiente...`);
    }

    logger.error(this.config.name, 'Todas las fuentes fallaron');

    return {
      success: false,
      error: 'Todas las fuentes de scraping fallaron',
      source: 'all'
    };
  }
}
