import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::lottery-bet.lottery-bet', () => ({
  /**
   * Endpoint unificado para consultar un ticket por código
   * GET /api/ticket/:ticketCode
   *
   * Busca en lottery-bet, animalitos-bet y parley-ticket
   */
  async findByCode(ctx) {
    const { ticketCode } = ctx.params;

    if (!ticketCode) {
      return ctx.badRequest('Ticket code is required');
    }

    try {
      // Buscar en lottery-bet
      const lotteryBets = await strapi.entityService.findMany('api::lottery-bet.lottery-bet', {
        filters: { ticketCode },
        populate: {
          draw: {
            populate: ['lottery']
          }
        }
      });

      if (lotteryBets.length > 0) {
        return ctx.send({
          data: {
            type: 'lottery',
            ticket: lotteryBets[0],
          }
        });
      }

      // Buscar en animalitos-bet
      const animalitosBets = await strapi.entityService.findMany('api::animalitos-bet.animalitos-bet', {
        filters: { ticketCode },
        populate: {
          draw: {
            populate: ['game']
          },
          animalito: true
        }
      });

      if (animalitosBets.length > 0) {
        return ctx.send({
          data: {
            type: 'animalitos',
            ticket: animalitosBets[0],
          }
        });
      }

      // Buscar en parley-ticket
      const parleyTickets = await strapi.entityService.findMany('api::parley-ticket.parley-ticket', {
        filters: { ticketCode },
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

      if (parleyTickets.length > 0) {
        return ctx.send({
          data: {
            type: 'parley',
            ticket: parleyTickets[0],
          }
        });
      }

      return ctx.notFound('Ticket not found');
    } catch (error) {
      strapi.log.error('Error finding ticket:', error);
      return ctx.internalServerError('Error searching for ticket');
    }
  }
}));
