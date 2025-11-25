import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  Lottery,
  LotteryDraw,
  LotteryBet,
  PlaceLotteryBetRequest,
  PlaceLotteryBetResponse,
  StrapiCollectionResponse,
  StrapiResponse
} from '../models';

/**
 * Servicio para gestionar loterías venezolanas
 */
@Injectable({
  providedIn: 'root'
})
export class LotteryService extends ApiService {
  /**
   * Obtener todas las loterías activas
   */
  getAllLotteries(): Observable<StrapiCollectionResponse<Lottery>> {
    return this.get<StrapiCollectionResponse<Lottery>>('/lotteries?filters[isActive]=true');
  }

  /**
   * Obtener una lotería específica
   */
  getLotteryById(id: number): Observable<StrapiResponse<Lottery>> {
    return this.get<StrapiResponse<Lottery>>(`/lotteries/${id}`);
  }

  /**
   * Obtener sorteos abiertos de una lotería
   */
  getOpenDraws(lotteryId: number): Observable<StrapiCollectionResponse<LotteryDraw>> {
    return this.get<StrapiCollectionResponse<LotteryDraw>>(
      `/lottery-draws?filters[lottery][id]=${lotteryId}&filters[status]=open&populate=lottery`
    );
  }

  /**
   * Obtener sorteos por fecha
   */
  getDrawsByDate(date: string): Observable<StrapiCollectionResponse<LotteryDraw>> {
    return this.get<StrapiCollectionResponse<LotteryDraw>>(
      `/lottery-draws?filters[drawDate]=${date}&populate=lottery`
    );
  }

  /**
   * Realizar una apuesta de lotería
   */
  placeBet(request: PlaceLotteryBetRequest): Observable<{ data: PlaceLotteryBetResponse }> {
    return this.post<{ data: PlaceLotteryBetResponse }>('/loterias/place-bet', request);
  }

  /**
   * Obtener resultados de sorteos con resultado publicado
   */
  getResults(date?: string): Observable<StrapiCollectionResponse<LotteryDraw>> {
    let endpoint = '/lottery-draws?filters[status]=result_published&populate=lottery';

    if (date) {
      endpoint += `&filters[drawDate]=${date}`;
    }

    return this.get<StrapiCollectionResponse<LotteryDraw>>(endpoint);
  }
}
