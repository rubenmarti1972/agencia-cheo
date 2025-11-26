// @ts-nocheck
import crypto from 'crypto';
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::lottery.lottery', ({ strapi }) => ({
  async placeBet(ctx) {
    const { drawId, betNumber, betAmount, userName, userPhone } = ctx.request.body;

    if (!drawId || !betNumber || !betAmount) {
      return ctx.badRequest('drawId, betNumber, and betAmount are required');
    }

    if (betAmount <= 0) {
      return ctx.badRequest('betAmount must be greater than 0');
    }

    try {
      const draw = await strapi.entityService.findOne(
        'api::lottery-draw.lottery-draw',
        drawId,
        { populate: ['lottery'] }
      );

      if (!draw) {
        return ctx.notFound('Draw not found');
      }

      const lottery = (draw as any).lottery;

      if (!lottery) {
        return ctx.badRequest('Lottery not found for this draw');
      }

      if (!lottery.isActive) {
        return ctx.badRequest('This lottery is not active');
      }

      if (draw.status !== 'open') {
        return ctx.badRequest(`Draw is ${draw.status}, cannot place bets`);
      }

      const drawDateTime = new Date(`${draw.drawDate}T${draw.drawTime}`);
      const closeTime = new Date(drawDateTime.getTime() - draw.closeMinutesBefore * 60000);
      const now = new Date();

      if (now >= closeTime) {
        return ctx.badRequest('Betting is closed for this draw');
      }

      if (betAmount < lottery.minBetAmount) {
        return ctx.badRequest(`Minimum bet amount is ${lottery.minBetAmount}`);
      }

      if (betAmount > lottery.maxBetAmount) {
        return ctx.badRequest(`Maximum bet amount is ${lottery.maxBetAmount}`);
      }

      const ticketCode = `LOT-${Date.now()}-${crypto
        .randomBytes(4)
        .toString('hex')
        .toUpperCase()}`;

      const potentialWin = betAmount * lottery.payoutMultiplier;

      const bet = await strapi.entityService.create(
        'api::lottery-bet.lottery-bet',
        {
          data: {
            draw: drawId,
            ticketCode,
            betNumber,
            betAmount,
            potentialWin,
            status: 'pending',
            userName,
            userPhone,
            paidAmount: 0,
          },
        }
      );

      const betWithRelations = await strapi.entityService.findOne(
        'api::lottery-bet.lottery-bet',
        bet.id,
        {
          populate: {
            draw: {
              populate: ['lottery'],
            },
          },
        }
      );

      return ctx.send({
        data: {
          ticketCode,
          bet: betWithRelations,
        },
      });
    } catch (error) {
      strapi.log.error('Error placing lottery bet:', error);
      return ctx.internalServerError('Error placing bet');
    }
  },
}));
