import crypto from 'crypto';

export default {
  /**
   * POST /api/animalitos/place-bet
   *
   * Body:
   * {
   *   "drawId": number,
   *   "animalitoNumber": number (1-36),
   *   "betAmount": number,
   *   "userName"?: string,
   *   "userPhone"?: string
   * }
   */
  async placeBet(ctx) {
    const { drawId, animalitoNumber, betAmount, userName, userPhone } = ctx.request.body;

    // Validaciones básicas
    if (!drawId || !animalitoNumber || !betAmount) {
      return ctx.badRequest('drawId, animalitoNumber, and betAmount are required');
    }

    if (betAmount <= 0) {
      return ctx.badRequest('betAmount must be greater than 0');
    }

    if (animalitoNumber < 1 || animalitoNumber > 36) {
      return ctx.badRequest('animalitoNumber must be between 1 and 36');
    }

    try {
      // Obtener el sorteo con su juego
      const draw = await strapi.entityService.findOne('api::animalitos-draw.animalitos-draw', drawId, {
        populate: ['game']
      });

      if (!draw) {
        return ctx.notFound('Draw not found');
      }

      // @ts-ignore - Strapi types
      const game = draw.game;

      if (!game) {
        return ctx.badRequest('Game not found for this draw');
      }

      // Validar que el juego está activo
      if (!game.isActive) {
        return ctx.badRequest('This game is not active');
      }

      // Validar estado del sorteo
      if (draw.status !== 'open') {
        return ctx.badRequest(`Draw is ${draw.status}, cannot place bets`);
      }

      // Validar hora de cierre
      const drawDateTime = new Date(`${draw.drawDate}T${game.scheduledTime}`);
      const closeTime = new Date(drawDateTime.getTime() - game.closeMinutesBefore * 60000);
      const now = new Date();

      if (now >= closeTime) {
        return ctx.badRequest('Betting is closed for this draw');
      }

      // Validar montos
      if (betAmount < game.minBetAmount) {
        return ctx.badRequest(`Minimum bet amount is ${game.minBetAmount}`);
      }

      if (betAmount > game.maxBetAmount) {
        return ctx.badRequest(`Maximum bet amount is ${game.maxBetAmount}`);
      }

      // Buscar el animalito
      const animalitos = await strapi.entityService.findMany('api::animalito.animalito', {
        filters: { number: animalitoNumber }
      });
      const animalitosList = Array.isArray(animalitos) ? animalitos : animalitos ? [animalitos] : [];

      if (animalitosList.length === 0) {
        return ctx.notFound('Animalito not found');
      }

      const animalito = animalitosList[0];

      // Generar código único de ticket
      const ticketCode = `ANI-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

      // Calcular ganancia potencial
      const potentialWin = betAmount * game.payoutMultiplier;

      // Crear la apuesta
      const bet = await strapi.entityService.create('api::animalitos-bet.animalitos-bet', {
        data: {
          draw: drawId,
          animalito: animalito.id,
          ticketCode,
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
          bet: await strapi.entityService.findOne('api::animalitos-bet.animalitos-bet', bet.id, {
            populate: {
              draw: {
                populate: ['game']
              },
              animalito: true
            }
          })
        }
      });
    } catch (error) {
      strapi.log.error('Error placing animalitos bet:', error);
      return ctx.internalServerError('Error placing bet');
    }
  }
};
