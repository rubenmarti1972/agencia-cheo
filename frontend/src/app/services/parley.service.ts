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
    return this.get<StrapiCollectionResponse<Match>>(
      `/matches?filters[sport][id]=${sportId}&filters[status][$in][0]=scheduled&filters[status][$in][1]=live&populate[homeTeam]=*&populate[awayTeam]=*&populate[sport]=*&sort=matchDate:asc`
    );
  }

  /**
   * Obtener un partido específico con sus mercados
   */
  getMatchById(id: number): Observable<StrapiResponse<Match>> {
    return this.get<StrapiResponse<Match>>(
      `/matches/${id}?populate[homeTeam]=*&populate[awayTeam]=*&populate[sport]=*&populate[markets]=*`
    );
  }

  /**
   * Obtener mercados activos de un partido
   */
  getMarketsByMatch(matchId: number): Observable<StrapiCollectionResponse<Market>> {
    return this.get<StrapiCollectionResponse<Market>>(
      `/markets?filters[match][id]=${matchId}&filters[isActive]=true&populate[match][populate][homeTeam]=*&populate[match][populate][awayTeam]=*`
    );
  }

  /**
   * Obtener un mercado específico
   */
  getMarketById(id: number): Observable<StrapiResponse<Market>> {
    return this.get<StrapiResponse<Market>>(
      `/markets/${id}?populate[match][populate][homeTeam]=*&populate[match][populate][awayTeam]=*&populate[match][populate][sport]=*`
    );
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
    const today = new Date().toISOString().split('T')[0];

    return this.get<StrapiCollectionResponse<Match>>(
      `/matches?filters[status][$in][0]=scheduled&filters[status][$in][1]=live&filters[matchDate][$gte]=${today}&populate[homeTeam]=*&populate[awayTeam]=*&populate[sport]=*&sort=matchDate:asc&pagination[limit]=20`
    );
  }

  /**
   * Obtener resultados de partidos finalizados
   */
  getFinishedMatches(date?: string): Observable<StrapiCollectionResponse<Match>> {
    let endpoint = '/matches?filters[status]=finished&populate[homeTeam]=*&populate[awayTeam]=*&populate[sport]=*&sort=matchDate:desc';

    if (date) {
      endpoint += `&filters[matchDate]=${date}`;
    }

    return this.get<StrapiCollectionResponse<Match>>(endpoint);
  }
}
