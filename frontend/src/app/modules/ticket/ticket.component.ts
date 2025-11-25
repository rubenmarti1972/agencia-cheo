import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TicketService } from '../../services';
import { TicketLookupResponse } from '../../models';

@Component({
  selector: 'app-ticket',
  imports: [ReactiveFormsModule],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.scss'
})
export class TicketComponent {
  private readonly ticketService = inject(TicketService);
  private readonly fb = inject(FormBuilder);

  ticketForm: FormGroup;
  loading = signal(false);
  ticketResult = signal<TicketLookupResponse | null>(null);
  error = signal<string | null>(null);

  constructor() {
    this.ticketForm = this.fb.group({
      ticketCode: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  searchTicket(): void {
    if (this.ticketForm.invalid) {
      return;
    }

    const ticketCode = this.ticketForm.value.ticketCode.trim().toUpperCase();

    this.loading.set(true);
    this.error.set(null);
    this.ticketResult.set(null);

    this.ticketService.findByCode(ticketCode).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.ticketResult.set(response.data);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Ticket no encontrado. Verifica el código e intenta nuevamente.');
        console.error('Error buscando ticket:', err);
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'won':
        return 'badge-success';
      case 'lost':
        return 'badge-error';
      case 'pending':
        return 'badge-warning';
      default:
        return 'badge-info';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'won':
        return 'GANADOR';
      case 'lost':
        return 'PERDEDOR';
      case 'pending':
        return 'PENDIENTE';
      case 'void':
        return 'ANULADO';
      default:
        return status.toUpperCase();
    }
  }
}
