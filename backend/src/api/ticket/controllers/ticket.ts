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
      const lotteryBetsList = Array.isArray(lotteryBets) ? lotteryBets : lotteryBets ? [lotteryBets] : [];

      if (lotteryBetsList.length > 0) {
        const bet = lotteryBetsList[0];
        return ctx.send({
          type: 'lottery',
          ticketCode: bet.ticketCode,
          status: bet.status,
          amount: bet.betAmount,
          potentialWin: bet.potentialWin,
          payout: bet.paidAmount || 0,
          details: {
            betNumber: bet.betNumber,
            lottery: bet.draw?.lottery?.name,
            drawDate: bet.draw?.drawDate,
            drawTime: bet.draw?.drawTime,
            winningNumber: bet.draw?.winningNumber
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
      const animalitosBetsList = Array.isArray(animalitosBets) ? animalitosBets : animalitosBets ? [animalitosBets] : [];

      if (animalitosBetsList.length > 0) {
        const bet = animalitosBetsList[0];
        return ctx.send({
          type: 'animalitos',
          ticketCode: bet.ticketCode,
          status: bet.status,
          amount: bet.betAmount,
          potentialWin: bet.potentialWin,
          payout: bet.paidAmount || 0,
          details: {
            animalito: {
              number: bet.animalito?.number,
              name: bet.animalito?.name
            },
            game: bet.draw?.game?.name,
            drawDate: bet.draw?.drawDate,
            winningAnimalNumber: bet.draw?.winningAnimalNumber
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
      const parleyTicketsList = Array.isArray(parleyTickets) ? parleyTickets : parleyTickets ? [parleyTickets] : [];

      if (parleyTicketsList.length > 0) {
        const ticket = parleyTicketsList[0];
        return ctx.send({
          type: 'parley',
          ticketCode: ticket.ticketCode,
          status: ticket.status,
          amount: ticket.betAmount,
          potentialWin: ticket.potentialWin,
          payout: ticket.paidAmount || 0,
          details: {
            totalOdds: ticket.totalOdds,
            legs: ticket.legs?.map((leg: any) => ({
              match: `${leg.market?.match?.homeTeam?.name} vs ${leg.market?.match?.awayTeam?.name}`,
              market: leg.market?.name,
              selection: leg.market?.selection,
              odds: leg.odds,
              status: leg.status
            }))
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
