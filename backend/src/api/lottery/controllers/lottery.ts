import { factories } from '@strapi/strapi';
import crypto from 'crypto';

export default factories.createCoreController('api::lottery.lottery', () => ({
  /**
   * POST /api/loterias/place-bet
   *
   * Body:
   * {
   *   "drawId": number,
   *   "betNumber": string,
   *   "betAmount": number,
   *   "userName"?: string,
   *   "userPhone"?: string
   * }
   */
  async placeBet(ctx) {
    const { drawId, betNumber, betAmount, userName, userPhone } = ctx.request.body;

    // Validaciones básicas
    if (!drawId || !betNumber || !betAmount) {
      return ctx.badRequest('drawId, betNumber, and betAmount are required');
    }

    if (betAmount <= 0) {
      return ctx.badRequest('betAmount must be greater than 0');
    }

    try {
      // Obtener el sorteo con su lotería
      const draw = await strapi.entityService.findOne('api::lottery-draw.lottery-draw', drawId, {
        populate: ['lottery']
      });

      if (!draw) {
        return ctx.notFound('Draw not found');
      }

      // @ts-ignore - Strapi types
      const lottery = draw.lottery;

      if (!lottery) {
        return ctx.badRequest('Lottery not found for this draw');
      }

      // Validar que la lotería está activa
      if (!lottery.isActive) {
        return ctx.badRequest('This lottery is not active');
      }

      // Validar estado del sorteo
      if (draw.status !== 'open') {
        return ctx.badRequest(`Draw is ${draw.status}, cannot place bets`);
      }

      // Validar hora de cierre
      const drawDateTime = new Date(`${draw.drawDate}T${draw.drawTime}`);
      const closeTime = new Date(drawDateTime.getTime() - draw.closeMinutesBefore * 60000);
      const now = new Date();

      if (now >= closeTime) {
        return ctx.badRequest('Betting is closed for this draw');
      }

      // Validar montos mínimo y máximo
      if (betAmount < lottery.minBetAmount) {
        return ctx.badRequest(`Minimum bet amount is ${lottery.minBetAmount}`);
      }

      if (betAmount > lottery.maxBetAmount) {
        return ctx.badRequest(`Maximum bet amount is ${lottery.maxBetAmount}`);
      }

      // Generar código único de ticket
      const ticketCode = `LOT-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

      // Calcular ganancia potencial
      const potentialWin = betAmount * lottery.payoutMultiplier;

      // Crear la apuesta
      const bet = await strapi.entityService.create('api::lottery-bet.lottery-bet', {
        data: {
          draw: drawId,
          ticketCode,
          betNumber,
          betAmount,
          potentialWin,
          status: 'pending',
          userName,
          userPhone,
          paidAmount: 0
        }
      });

      return ctx.send({
        data: {
          ticketCode,
          bet: await strapi.entityService.findOne('api::lottery-bet.lottery-bet', bet.id, {
            populate: {
              draw: {
                populate: ['lottery']
              }
            }
          })
        }
      });
    } catch (error) {
      strapi.log.error('Error placing lottery bet:', error);
      return ctx.internalServerError('Error placing bet');
    }
  }
}));
