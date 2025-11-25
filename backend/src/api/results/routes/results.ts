/**
 * Rutas personalizadas para la API de resultados
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/results/today',
      handler: 'results.getToday',
      config: {
        auth: false, // Público
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'GET',
      path: '/results/date/:date',
      handler: 'results.getByDate',
      config: {
        auth: false, // Público
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/results/scrape',
      handler: 'results.scrapeNow',
      config: {
        auth: false, // En producción, cambiar a true y agregar policies
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'GET',
      path: '/results/cron-status',
      handler: 'results.getCronStatus',
      config: {
        auth: false, // En producción, cambiar a true
        policies: [],
        middlewares: []
      }
    }
  ]
};
