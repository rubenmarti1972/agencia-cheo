import { StrapiEntity } from './strapi.model';

export interface Lottery extends StrapiEntity {
  name: string;
  description?: string;
  isActive: boolean;
  minBetAmount: number;
  maxBetAmount: number;
  payoutMultiplier: number;
  draws?: LotteryDraw[];
}

export type LotteryDrawStatus = 'open' | 'closed' | 'result_published';

export interface LotteryDraw extends StrapiEntity {
  lottery?: Lottery;
  drawDate: string;
  drawTime: string;
  closeMinutesBefore: number;
  status: LotteryDrawStatus;
  winningNumber?: string;
  bets?: LotteryBet[];
}

export type LotteryBetStatus = 'pending' | 'won' | 'lost';

export interface LotteryBet extends StrapiEntity {
  draw?: LotteryDraw;
  ticketCode: string;
  betNumber: string;
  betAmount: number;
  potentialWin: number;
  status: LotteryBetStatus;
  paidAmount: number;
  userName?: string;
  userPhone?: string;
}

export interface PlaceLotteryBetRequest {
  drawId: number;
  betNumber: string;
  betAmount: number;
  userName?: string;
  userPhone?: string;
}

export interface PlaceLotteryBetResponse {
  ticketCode: string;
  bet: LotteryBet;
}
