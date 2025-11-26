import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  Sport,
  Team,
  Match,
  Market,
  ParleyTicket,
  PlaceParleyTicketRequest,
  PlaceParleyTicketResponse,
  StrapiCollectionResponse,
  StrapiResponse
} from '../models';

/**
 * Servicio para gestionar apuestas parley deportivas
 */
@Injectable({
  providedIn: 'root'
})
export class ParleyService extends ApiService {
  /**
   * Obtener todos los deportes activos
   */
  getAllSports(): Observable<StrapiCollectionResponse<Sport>> {
    return this.get<StrapiCollectionResponse<Sport>>('/sports?filters[isActive]=true');
  }

  /**
   * Obtener un deporte específico
   */
  getSportById(id: number): Observable<StrapiResponse<Sport>> {
    return this.get<StrapiResponse<Sport>>(`/sports/${id}`);
  }

  /**
   * Obtener equipos de un deporte
   */
  getTeamsBySport(sportId: number): Observable<StrapiCollectionResponse<Team>> {
    return this.get<StrapiCollectionResponse<Team>>(
      `/teams?filters[sport][id]=${sportId}&filters[isActive]=true`
    );
  }

  /**
   * Obtener partidos programados o en vivo de un deporte
   */
  getMatchesBySport(sportId: number): Observable<StrapiCollectionResponse<Match>> {
    const query =
      `filters[sport][id]=${sportId}` +
      `&filters[status][$in][0]=scheduled` +
      `&filters[status][$in][1]=live` +
      `&populate[homeTeam]=true` +
      `&populate[awayTeam]=true` +
      `&populate[sport]=true` +
      `&populate[markets]=true` +
      `&sort=matchDate:asc`;

    return this.get<StrapiCollectionResponse<Match>>(`/matches?${query}`);
  }

  /**
   * Obtener un partido específico con sus mercados
   */
  getMatchById(id: number): Observable<StrapiResponse<Match>> {
    const query =
      `populate[homeTeam]=true` +
      `&populate[awayTeam]=true` +
      `&populate[sport]=true` +
      `&populate[markets]=true`;

    return this.get<StrapiResponse<Match>>(`/matches/${id}?${query}`);
  }

  /**
   * Obtener mercados activos de un partido
   */
  getMarketsByMatch(matchId: number): Observable<StrapiCollectionResponse<Market>> {
    const query =
      `filters[match][id]=${matchId}` +
      `&filters[isActive]=true` +
      `&populate[match][populate][homeTeam]=true` +
      `&populate[match][populate][awayTeam]=true` +
      `&populate[match][populate][sport]=true`;

    return this.get<StrapiCollectionResponse<Market>>(`/markets?${query}`);
  }

  /**
   * Obtener un mercado específico
   */
  getMarketById(id: number): Observable<StrapiResponse<Market>> {
    const query =
      `populate[match][populate][homeTeam]=true` +
      `&populate[match][populate][awayTeam]=true` +
      `&populate[match][populate][sport]=true`;

    return this.get<StrapiResponse<Market>>(`/markets/${id}?${query}`);
  }

  /**
   * Crear un ticket de parley
   */
  placeTicket(request: PlaceParleyTicketRequest): Observable<{ data: PlaceParleyTicketResponse }> {
    return this.post<{ data: PlaceParleyTicketResponse }>('/parley/place-ticket', request);
  }

  /**
   * Obtener todos los partidos próximos (independiente del deporte)
   */
  getUpcomingMatches(): Observable<StrapiCollectionResponse<Match>> {
    const now = new Date();
    const nowISO = now.toISOString();

    const query =
      `filters[status][$in][0]=scheduled` +
      `&filters[status][$in][1]=live` +
      `&filters[matchDate][$gte]=${nowISO}` +
      `&populate[homeTeam]=true` +
      `&populate[awayTeam]=true` +
      `&populate[sport]=true` +
      `&populate[markets]=true` +
      `&sort=matchDate:asc` +
      `&pagination[limit]=20`;

    return this.get<StrapiCollectionResponse<Match>>(`/matches?${query}`);
  }

  /**
   * Obtener resultados de partidos finalizados
   */
  getFinishedMatches(date?: string): Observable<StrapiCollectionResponse<Match>> {
    let query =
      `filters[status]=finished` +
      `&populate[homeTeam]=true` +
      `&populate[awayTeam]=true` +
      `&populate[sport]=true` +
      `&sort=matchDate:desc`;

    if (date) {
      query += `&filters[matchDate]=${date}`;
    }

    return this.get<StrapiCollectionResponse<Match>>(`/matches?${query}`);
  }
}
