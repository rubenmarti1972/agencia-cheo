import { LotteryBet } from './lottery.model';
import { AnimalitosBet } from './animalitos.model';
import { ParleyTicket } from './parley.model';

export type TicketType = 'lottery' | 'animalitos' | 'parley';

export interface TicketLookupResponse {
  type: TicketType;
  ticket: LotteryBet | AnimalitosBet | ParleyTicket;
}
