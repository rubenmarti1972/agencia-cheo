/**
 * Rutas personalizadas para la API de resultados
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/results/today',
      handler: 'results.getToday',
      info: {
        contentType: 'api::lottery-draw.lottery-draw',
      },
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/results/date/:date',
      handler: 'results.getByDate',
      info: {
        contentType: 'api::lottery-draw.lottery-draw',
      },
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/results/scrape',
      handler: 'results.scrapeNow',
      info: {
        contentType: 'api::lottery-draw.lottery-draw',
      },
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/results/cron-status',
      handler: 'results.getCronStatus',
      info: {
        contentType: 'api::lottery-draw.lottery-draw',
      },
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
