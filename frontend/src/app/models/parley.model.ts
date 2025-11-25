import { StrapiEntity } from './strapi.model';

export interface Sport extends StrapiEntity {
  name: string;
  slug: string;
  iconUrl?: string;
  isActive: boolean;
  teams?: Team[];
  matches?: Match[];
}

export interface Team extends StrapiEntity {
  sport?: Sport;
  name: string;
  shortName?: string;
  logoUrl?: string;
  country?: string;
  isActive: boolean;
}

export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'cancelled';

export interface Match extends StrapiEntity {
  sport?: Sport;
  homeTeam?: Team;
  awayTeam?: Team;
  matchDate: string;
  status: MatchStatus;
  homeScore: number;
  awayScore: number;
  venue?: string;
  markets?: Market[];
}

export type MarketType = 'moneyline' | 'spread' | 'over_under' | 'both_teams_score' | 'correct_score';
export type MarketResult = 'pending' | 'won' | 'lost' | 'void';

export interface Market extends StrapiEntity {
  match?: Match;
  marketType: MarketType;
  name: string;
  selection: string;
  odds: number;
  line?: number;
  isActive: boolean;
  result: MarketResult;
}

export type ParleyTicketStatus = 'pending' | 'won' | 'lost' | 'void';

export interface ParleyTicket extends StrapiEntity {
  ticketCode: string;
  betAmount: number;
  totalOdds: number;
  potentialWin: number;
  status: ParleyTicketStatus;
  paidAmount: number;
  userName?: string;
  userPhone?: string;
  legs?: ParleyLeg[];
}

export type ParleyLegStatus = 'pending' | 'won' | 'lost' | 'void';

export interface ParleyLeg extends StrapiEntity {
  ticket?: ParleyTicket;
  market?: Market;
  odds: number;
  status: ParleyLegStatus;
}

export interface PlaceParleyTicketRequest {
  marketIds: number[];
  betAmount: number;
  userName?: string;
  userPhone?: string;
}

export interface PlaceParleyTicketResponse {
  ticketCode: string;
  ticket: ParleyTicket;
}
