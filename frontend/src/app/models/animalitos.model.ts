import { StrapiEntity } from './strapi.model';

export interface Animalito extends StrapiEntity {
  number: number;
  name: string;
  imageUrl?: string;
  bets?: AnimalitosBet[];
}

export interface AnimalitosGame extends StrapiEntity {
  name: string;
  scheduledTime: string;
  closeMinutesBefore: number;
  isActive: boolean;
  payoutMultiplier: number;
  minBetAmount: number;
  maxBetAmount: number;
  draws?: AnimalitosDraw[];
}

export type AnimalitosDrawStatus = 'open' | 'closed' | 'result_published';

export interface AnimalitosDraw extends StrapiEntity {
  game?: AnimalitosGame;
  drawDate: string;
  status: AnimalitosDrawStatus;
  winningAnimalNumber?: number;
  bets?: AnimalitosBet[];
}

export type AnimalitosBetStatus = 'pending' | 'won' | 'lost';

export interface AnimalitosBet extends StrapiEntity {
  draw?: AnimalitosDraw;
  animalito?: Animalito;
  ticketCode: string;
  betAmount: number;
  potentialWin: number;
  status: AnimalitosBetStatus;
  paidAmount: number;
  userName?: string;
  userPhone?: string;
}

export interface PlaceAnimalitosBetRequest {
  drawId: number;
  animalitoNumber: number;
  betAmount: number;
  userName?: string;
  userPhone?: string;
}

export interface PlaceAnimalitosBetResponse {
  ticketCode: string;
  bet: AnimalitosBet;
}
