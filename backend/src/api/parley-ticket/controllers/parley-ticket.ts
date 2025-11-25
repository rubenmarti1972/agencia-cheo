import { factories } from '@strapi/strapi';
import crypto from 'crypto';

export default factories.createCoreController('api::parley-ticket.parley-ticket', () => ({
  /**
   * POST /api/parley/place-ticket
   *
   * Body:
   * {
   *   "marketIds": number[],  // IDs de los mercados seleccionados
   *   "betAmount": number,
   *   "userName"?: string,
   *   "userPhone"?: string
   * }
   */
  async placeTicket(ctx) {
    const { marketIds, betAmount, userName, userPhone } = ctx.request.body;

    // Validaciones básicas
    if (!marketIds || !Array.isArray(marketIds) || marketIds.length === 0) {
      return ctx.badRequest('marketIds array is required and must not be empty');
    }

    if (marketIds.length < 2) {
      return ctx.badRequest('Parley must have at least 2 selections');
    }

    if (!betAmount || betAmount <= 0) {
      return ctx.badRequest('betAmount must be greater than 0');
    }

    try {
      // Obtener todos los mercados seleccionados
      const markets = await Promise.all(
        marketIds.map(id =>
          strapi.entityService.findOne('api::market.market', id, {
            populate: {
              match: {
                populate: ['homeTeam', 'awayTeam', 'sport']
              }
            }
          })
        )
      );

      // Validar que todos los mercados existen
      const notFound = markets.findIndex(m => !m);
      if (notFound !== -1) {
        return ctx.badRequest(`Market with id ${marketIds[notFound]} not found`);
      }

      // Validar que todos los mercados están activos
      const inactiveMarket = markets.find(m => !m.isActive);
      if (inactiveMarket) {
        return ctx.badRequest(`Market ${inactiveMarket.id} is not active`);
      }

      // Validar que todos los partidos están programados o en vivo
      for (const market of markets) {
        // @ts-ignore
        const match = market.match;
        if (!match) {
          return ctx.badRequest('Match not found for market');
        }

        if (match.status === 'finished' || match.status === 'cancelled') {
          return ctx.badRequest(`Match ${match.id} is ${match.status}, cannot place bets`);
        }
      }

      // Validar que no hay partidos duplicados
      const matchIds = markets.map((m: any) => m.match.id);
      const uniqueMatches = new Set(matchIds);
      if (uniqueMatches.size !== matchIds.length) {
        return ctx.badRequest('Cannot select multiple markets from the same match');
      }

      // Calcular odd total (producto de todas las odds)
      const totalOdds = markets.reduce((acc, market) => acc * parseFloat(market.odds as string), 1);

      // Calcular ganancia potencial
      const potentialWin = betAmount * totalOdds;

      // Generar código único de ticket
      const ticketCode = `PAR-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

      // Crear el ticket de parley
      const ticket = await strapi.entityService.create('api::parley-ticket.parley-ticket', {
        data: {
          ticketCode,
          betAmount,
          totalOdds,
          potentialWin,
          status: 'pending',
          userName,
          userPhone,
          paidAmount: 0
        }
      });

      // Crear los legs (selecciones)
      const legs = await Promise.all(
        markets.map(market =>
          strapi.entityService.create('api::parley-leg.parley-leg', {
            data: {
              ticket: ticket.id,
              market: market.id,
              odds: market.odds,
              status: 'pending'
            }
          })
        )
      );

      // Retornar el ticket completo con todas las relaciones
      const fullTicket = await strapi.entityService.findOne('api::parley-ticket.parley-ticket', ticket.id, {
        populate: {
          legs: {
            populate: {
              market: {
                populate: {
                  match: {
                    populate: ['homeTeam', 'awayTeam', 'sport']
                  }
                }
              }
            }
          }
        }
      });

      return ctx.send({
        data: {
          ticketCode,
          ticket: fullTicket
        }
      });
    } catch (error) {
      strapi.log.error('Error placing parley ticket:', error);
      return ctx.internalServerError('Error placing parley ticket');
    }
  }
}));
