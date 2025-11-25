import { logger } from '../utils/logger';
import type { Core } from '@strapi/strapi';

/**
 * Servicio para actualizar tickets después de que se publiquen resultados
 * Marca tickets como ganados/perdidos y calcula pagos
 */
export class TicketsUpdaterService {
  private strapi: Core.Strapi;

  constructor(strapi: Core.Strapi) {
    this.strapi = strapi;
  }

  /**
   * Actualiza todos los tickets de una lotería después de publicar el resultado
   */
  async updateLotteryTickets(drawId: number, winningNumber: string): Promise<{
    updated: number;
    won: number;
    lost: number;
    totalPayout: number;
  }> {
    logger.info('TicketsUpdater', `Actualizando tickets de lotería para sorteo ${drawId}`);

    try {
      // 1. Obtener el sorteo con su lotería
      const draw = await this.strapi.entityService.findOne(
        'api::lottery-draw.lottery-draw',
        drawId,
        {
          populate: ['lottery']
        }
      );

      if (!draw) {
        throw new Error(`Sorteo ${drawId} no encontrado`);
      }

      // 2. Buscar todas las apuestas pendientes
      const bets = await this.strapi.entityService.findMany(
        'api::lottery-bet.lottery-bet',
        {
          filters: {
            draw: { id: drawId },
            status: 'pending'
          },
          populate: ['draw']
        }
      ) as unknown[];

      if (!bets || !Array.isArray(bets)) {
        logger.warn('TicketsUpdater', 'No se encontraron apuestas pendientes');
        return { updated: 0, won: 0, lost: 0, totalPayout: 0 };
      }

      logger.info('TicketsUpdater', `Encontradas ${bets.length} apuestas pendientes`);

      let wonCount = 0;
      let lostCount = 0;
      let totalPayout = 0;

      // 3. Actualizar cada apuesta
      for (const betData of bets) {
        const bet = betData as {
          id: number;
          ticketCode: string;
          betNumber: string;
          potentialWin: number;
        };

        const isWinner = bet.betNumber === winningNumber;
        const newStatus = isWinner ? 'won' : 'lost';
        const paidAmount = isWinner ? bet.potentialWin : 0;

        await this.strapi.entityService.update(
          'api::lottery-bet.lottery-bet',
          bet.id,
          {
            data: {
              status: newStatus,
              paidAmount
            } as Record<string, unknown>
          }
        );

        if (isWinner) {
          wonCount++;
          totalPayout += paidAmount;
          logger.info('TicketsUpdater', `Ticket ${bet.ticketCode} GANÓ`, {
            betNumber: bet.betNumber,
            payout: paidAmount
          });
        } else {
          lostCount++;
        }
      }

      logger.info('TicketsUpdater', 'Actualización de tickets completada', {
        total: bets.length,
        won: wonCount,
        lost: lostCount,
        totalPayout
      });

      return {
        updated: bets.length,
        won: wonCount,
        lost: lostCount,
        totalPayout
      };
    } catch (error) {
      logger.error('TicketsUpdater', 'Error actualizando tickets de lotería', { error });
      throw error;
    }
  }

  /**
   * Actualiza todos los tickets de animalitos después de publicar el resultado
   */
  async updateAnimalitosTickets(drawId: number, winningAnimalNumber: number): Promise<{
    updated: number;
    won: number;
    lost: number;
    totalPayout: number;
  }> {
    logger.info('TicketsUpdater', `Actualizando tickets de animalitos para sorteo ${drawId}`);

    try {
      // 1. Obtener el sorteo con su juego
      const draw = await this.strapi.entityService.findOne(
        'api::animalitos-draw.animalitos-draw',
        drawId,
        {
          populate: ['game']
        }
      );

      if (!draw) {
        throw new Error(`Sorteo de animalitos ${drawId} no encontrado`);
      }

      // 2. Buscar todas las apuestas pendientes
      const bets = await this.strapi.entityService.findMany(
        'api::animalitos-bet.animalitos-bet',
        {
          filters: {
            draw: { id: drawId },
            status: 'pending'
          },
          populate: ['draw', 'animalito']
        }
      ) as unknown[];

      if (!bets || !Array.isArray(bets)) {
        logger.warn('TicketsUpdater', 'No se encontraron apuestas de animalitos pendientes');
        return { updated: 0, won: 0, lost: 0, totalPayout: 0 };
      }

      logger.info('TicketsUpdater', `Encontradas ${bets.length} apuestas de animalitos pendientes`);

      let wonCount = 0;
      let lostCount = 0;
      let totalPayout = 0;

      // 3. Actualizar cada apuesta
      for (const betData of bets) {
        const bet = betData as {
          id: number;
          ticketCode: string;
          potentialWin: number;
          animalito?: { number: number };
        };

        // Comparar el número del animalito apostado con el ganador
        const isWinner = bet.animalito?.number === winningAnimalNumber;
        const newStatus = isWinner ? 'won' : 'lost';
        const paidAmount = isWinner ? bet.potentialWin : 0;

        await this.strapi.entityService.update(
          'api::animalitos-bet.animalitos-bet',
          bet.id,
          {
            data: {
              status: newStatus,
              paidAmount
            } as Record<string, unknown>
          }
        );

        if (isWinner) {
          wonCount++;
          totalPayout += paidAmount;
          logger.info('TicketsUpdater', `Ticket ${bet.ticketCode} GANÓ`, {
            animalNumber: bet.animalito?.number,
            payout: paidAmount
          });
        } else {
          lostCount++;
        }
      }

      logger.info('TicketsUpdater', 'Actualización de tickets de animalitos completada', {
        total: bets.length,
        won: wonCount,
        lost: lostCount,
        totalPayout
      });

      return {
        updated: bets.length,
        won: wonCount,
        lost: lostCount,
        totalPayout
      };
    } catch (error) {
      logger.error('TicketsUpdater', 'Error actualizando tickets de animalitos', { error });
      throw error;
    }
  }

  /**
   * Actualiza tickets de parley después de que finalice un partido
   * NOTA: Los parleys requieren que TODOS los partidos finalicen
   */
  async updateParleyTicketsForMatch(matchId: number): Promise<{
    evaluated: number;
    stillPending: number;
    won: number;
    lost: number;
    totalPayout: number;
  }> {
    logger.info('TicketsUpdater', `Evaluando parleys después del partido ${matchId}`);

    try {
      // 1. Obtener el partido con resultado
      const match = await this.strapi.entityService.findOne(
        'api::match.match',
        matchId,
        {
          populate: ['markets']
        }
      );

      if (!match || match.status !== 'finished') {
        throw new Error(`Partido ${matchId} no está finalizado`);
      }

      // 2. Encontrar todos los legs de parley que usan este partido
      const parleyLegs = await this.strapi.entityService.findMany(
        'api::parley-leg.parley-leg',
        {
          filters: {
            market: {
              match: { id: matchId }
            },
            status: 'pending'
          },
          populate: ['ticket', 'market']
        }
      ) as unknown[];

      if (!parleyLegs || !Array.isArray(parleyLegs)) {
        logger.warn('TicketsUpdater', 'No se encontraron legs de parley');
        return {
          evaluated: 0,
          stillPending: 0,
          won: 0,
          lost: 0,
          totalPayout: 0
        };
      }

      logger.info('TicketsUpdater', `Encontrados ${parleyLegs.length} legs pendientes del partido`);

      const ticketsToEvaluate = new Set<number>();

      // 3. Actualizar cada leg basándose en el resultado del mercado
      for (const leg of parleyLegs) {
        const legData = leg as {
          id: number;
          market?: { result?: string };
          ticket?: { id: number };
        };

        const marketResult = legData.market?.result || 'pending';
        const newLegStatus = marketResult === 'won' ? 'won' : 'lost';

        await this.strapi.entityService.update(
          'api::parley-leg.parley-leg',
          legData.id,
          {
            data: {
              status: newLegStatus
            } as Record<string, string>
          }
        );

        // Marcar el ticket para evaluación completa
        if (legData.ticket?.id) {
          ticketsToEvaluate.add(legData.ticket.id);
        }
      }

      // 4. Evaluar cada ticket completo
      let wonCount = 0;
      let lostCount = 0;
      let stillPendingCount = 0;
      let totalPayout = 0;

      for (const ticketId of ticketsToEvaluate) {
        const result = await this.evaluateParleyTicket(ticketId);

        if (result.status === 'won') {
          wonCount++;
          totalPayout += result.payout;
        } else if (result.status === 'lost') {
          lostCount++;
        } else {
          stillPendingCount++;
        }
      }

      logger.info('TicketsUpdater', 'Actualización de parleys completada', {
        evaluated: ticketsToEvaluate.size,
        won: wonCount,
        lost: lostCount,
        stillPending: stillPendingCount,
        totalPayout
      });

      return {
        evaluated: ticketsToEvaluate.size,
        stillPending: stillPendingCount,
        won: wonCount,
        lost: lostCount,
        totalPayout
      };
    } catch (error) {
      logger.error('TicketsUpdater', 'Error actualizando parleys', { error });
      throw error;
    }
  }

  /**
   * Evalúa un ticket de parley completo
   * Un parley gana solo si TODOS los legs ganan
   */
  private async evaluateParleyTicket(ticketId: number): Promise<{
    status: 'pending' | 'won' | 'lost';
    payout: number;
  }> {
    // Obtener el ticket con todos sus legs
    const ticket = await this.strapi.entityService.findOne(
      'api::parley-ticket.parley-ticket',
      ticketId,
      {
        populate: ['legs']
      }
    );

    if (!ticket || !ticket.legs || ticket.legs.length === 0) {
      return { status: 'pending', payout: 0 };
    }

    // Verificar el estado de todos los legs
    const allLegs = ticket.legs as { status: string }[];
    const hasLost = allLegs.some((leg) => leg.status === 'lost');
    const allWon = allLegs.every((leg) => leg.status === 'won');
    const hasPending = allLegs.some((leg) => leg.status === 'pending');

    let newStatus: 'pending' | 'won' | 'lost' = ticket.status as 'pending' | 'won' | 'lost';
    let paidAmount = 0;

    if (hasLost) {
      // Si al menos un leg perdió, el parley pierde
      newStatus = 'lost';
      paidAmount = 0;
    } else if (allWon) {
      // Si todos ganaron, el parley gana
      newStatus = 'won';
      paidAmount = ticket.potentialWin as number;
    } else if (hasPending) {
      // Aún hay legs pendientes
      newStatus = 'pending';
      paidAmount = 0;
    }

    // Actualizar el ticket si cambió el estado
    if (newStatus !== ticket.status) {
      await this.strapi.entityService.update(
        'api::parley-ticket.parley-ticket',
        ticketId,
        {
          data: {
            status: newStatus,
            paidAmount
          } as Record<string, unknown>
        }
      );

      logger.info('TicketsUpdater', `Parley ${ticket.ticketCode} actualizado`, {
        status: newStatus,
        payout: paidAmount
      });
    }

    return {
      status: newStatus,
      payout: paidAmount
    };
  }
}

/**
 * Factory function para obtener instancia del servicio
 */
export function getTicketsUpdater(strapi: Core.Strapi): TicketsUpdaterService {
  return new TicketsUpdaterService(strapi);
}
