import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { TicketLookupResponse } from '../models';

/**
 * Servicio para consultar tickets de cualquier tipo
 */
@Injectable({
  providedIn: 'root'
})
export class TicketService extends ApiService {
  /**
   * Buscar un ticket por su código
   * Busca en lottery-bet, animalitos-bet y parley-ticket
   */
  findByCode(ticketCode: string): Observable<{ data: TicketLookupResponse }> {
    return this.get<{ data: TicketLookupResponse }>(`/ticket/${ticketCode}`);
  }
}
