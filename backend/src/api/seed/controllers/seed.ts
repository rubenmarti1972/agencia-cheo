// @ts-nocheck
import { runSeed } from '../../../seed';

export default {
  async run(ctx) {
    try {
      console.log('\n🌱 Ejecutando seed manualmente vía API...\n');

      const success = await runSeed();

      if (success) {
        return ctx.send({
          message: '✅ Seed ejecutado exitosamente',
          success: true
        });
      } else {
        return ctx.badRequest('❌ Error durante el seed');
      }
    } catch (error) {
      console.error('❌ Error ejecutando seed:', error);
      return ctx.internalServerError('Error ejecutando seed: ' + error.message);
    }
  }
};
