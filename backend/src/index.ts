import type { Core } from '@strapi/strapi';
import { bootstrapScheduler } from './cron/scheduler';

export default {
  register(/* { strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Inicializar el scheduler de cron jobs para scraping automático
    bootstrapScheduler(strapi);

    // Para ejecutar el seed, usa: POST /api/seed/run
    console.log('\n💡 Tip: Para poblar la base de datos, ejecuta: curl -X POST http://localhost:1337/api/seed/run\n');
  },
};
