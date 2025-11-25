/**
 * Exportaciones centralizadas de scrapers
 */

export { BaseScraper, ScrapeResult, ScraperConfig } from './base.scraper';
export {
  AnimalitosScraper,
  AnimalitoResult,
  scrapeAnimalitos
} from './animalitos.scraper';
export {
  LotteryScraper,
  LotteryResult,
  scrapeLotteries
} from './lottery.scraper';
