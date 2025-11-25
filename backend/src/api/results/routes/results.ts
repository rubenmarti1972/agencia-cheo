/**
 * Rutas personalizadas para la API de resultados
 */

export default {
  contentType: 'api::lottery-draw.lottery-draw',
  routes: [
    {
      method: 'GET',
      path: '/results/today',
      handler: 'api::results.results.getToday',
      info: {
        contentType: 'api::lottery-draw.lottery-draw',
      },
      config: {
        auth: false, // Público
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'GET',
      path: '/results/date/:date',
      handler: 'api::results.results.getByDate',
      info: {
        contentType: 'api::lottery-draw.lottery-draw',
      },
      config: {
        auth: false, // Público
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/results/scrape',
      handler: 'api::results.results.scrapeNow',
      info: {
        contentType: 'api::lottery-draw.lottery-draw',
      },
      config: {
        auth: false, // En producción, cambiar a true y agregar policies
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'GET',
      path: '/results/cron-status',
      handler: 'api::results.results.getCronStatus',
      info: {
        contentType: 'api::lottery-draw.lottery-draw',
      },
      config: {
        auth: false, // En producción, cambiar a true
        policies: [],
        middlewares: []
      }
    }
  ]
};
