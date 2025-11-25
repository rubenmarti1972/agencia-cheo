import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  Animalito,
  AnimalitosGame,
  AnimalitosDraw,
  PlaceAnimalitosBetRequest,
  PlaceAnimalitosBetResponse,
  StrapiCollectionResponse,
  StrapiResponse
} from '../models';

/**
 * Servicio para gestionar animalitos venezolanos
 */
@Injectable({
  providedIn: 'root'
})
export class AnimalitosService extends ApiService {
  /**
   * Obtener catálogo completo de 36 animalitos
   */
  getAllAnimalitos(): Observable<StrapiCollectionResponse<Animalito>> {
    return this.get<StrapiCollectionResponse<Animalito>>('/animalitos?sort=number:asc');
  }

  /**
   * Obtener un animalito por número (1-36)
   */
  getAnimalitoByNumber(number: number): Observable<StrapiCollectionResponse<Animalito>> {
    return this.get<StrapiCollectionResponse<Animalito>>(`/animalitos?filters[number]=${number}`);
  }

  /**
   * Obtener todos los juegos activos
   */
  getAllGames(): Observable<StrapiCollectionResponse<AnimalitosGame>> {
    return this.get<StrapiCollectionResponse<AnimalitosGame>>('/animalitos-games?filters[isActive]=true&sort=scheduledTime:asc');
  }

  /**
   * Obtener un juego específico
   */
  getGameById(id: number): Observable<StrapiResponse<AnimalitosGame>> {
    return this.get<StrapiResponse<AnimalitosGame>>(`/animalitos-games/${id}`);
  }

  /**
   * Obtener sorteos abiertos de un juego
   */
  getOpenDraws(gameId: number): Observable<StrapiCollectionResponse<AnimalitosDraw>> {
    return this.get<StrapiCollectionResponse<AnimalitosDraw>>(
      `/animalitos-draws?filters[game][id]=${gameId}&filters[status]=open&populate=game`
    );
  }

  /**
   * Obtener sorteos por fecha
   */
  getDrawsByDate(date: string): Observable<StrapiCollectionResponse<AnimalitosDraw>> {
    return this.get<StrapiCollectionResponse<AnimalitosDraw>>(
      `/animalitos-draws?filters[drawDate]=${date}&populate=game`
    );
  }

  /**
   * Realizar una apuesta de animalitos
   */
  placeBet(request: PlaceAnimalitosBetRequest): Observable<{ data: PlaceAnimalitosBetResponse }> {
    return this.post<{ data: PlaceAnimalitosBetResponse }>('/animalitos/place-bet', request);
  }

  /**
   * Obtener resultados de sorteos con resultado publicado
   */
  getResults(date?: string): Observable<StrapiCollectionResponse<AnimalitosDraw>> {
    let endpoint = '/animalitos-draws?filters[status]=result_published&populate=game';

    if (date) {
      endpoint += `&filters[drawDate]=${date}`;
    }

    return this.get<StrapiCollectionResponse<AnimalitosDraw>>(endpoint);
  }
}
