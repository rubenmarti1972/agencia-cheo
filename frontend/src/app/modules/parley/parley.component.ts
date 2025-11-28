import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ParleyService } from '../../services';
import { Sport, Match, Market, PlaceParleyTicketResponse } from '../../models';

@Component({
  selector: 'app-parley',
  imports: [ReactiveFormsModule, DecimalPipe, RouterLink],
  templateUrl: './parley.component.html',
  styleUrl: './parley.component.scss'
})
export class ParleyComponent implements OnInit {
  private readonly parleyService = inject(ParleyService);
  private readonly fb = inject(FormBuilder);

  // State
  sports = signal<Sport[]>([]);
  matches = signal<Match[]>([]);
  selectedMarkets = signal<Market[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  successTicket = signal<PlaceParleyTicketResponse | null>(null);

  // Form
  betForm: FormGroup;

  // Computed
  totalOdds = computed(() => {
    const markets = this.selectedMarkets();
    if (markets.length === 0) return 1;
    return markets.reduce((acc, market) => acc * market.odds, 1);
  });

  potentialWin = computed(() => {
    const amount = this.betForm.get('betAmount')?.value;
    if (!amount || amount <= 0) return 0;
    return amount * this.totalOdds();
  });

  // Form validation state
  isFormValid = computed(() => {
    return this.betForm.valid && this.selectedMarkets().length >= 2;
  });

  constructor() {
    this.betForm = this.fb.group({
      betAmount: [null, [Validators.required, Validators.min(1)]],
      userName: ['', [Validators.required, Validators.minLength(3)]],
      userCedula: ['', [Validators.required, Validators.pattern(/^[VEJ]-?\d{6,8}$/i)]],
      userPhone: ['', [Validators.required, Validators.pattern(/^(0414|0424|0412|0416|0426)\d{7}$/)]]
    });
  }

  ngOnInit(): void {
    this.loadUpcomingMatches();
  }

  /**
   * Filtrar markets por tipo
   */
  getMarketsByType(markets: Market[], marketType: string): Market[] {
    return markets.filter(m => m.marketType === marketType);
  }

  /**
   * Eliminar market del carrito
   */
  removeMarket(marketId: number): void {
    const current = this.selectedMarkets();
    this.selectedMarkets.set(current.filter(m => m.id !== marketId));
    this.error.set(null);
  }

  /**
   * Establecer monto rápido
   */
  setQuickAmount(amount: number): void {
    this.betForm.patchValue({ betAmount: amount });
  }

  loadUpcomingMatches(): void {
    this.loading.set(true);
    this.error.set(null);

    this.parleyService.getUpcomingMatches().subscribe({
      next: (response) => {
        // Filtrar solo markets activos en cada partido
        const matchesWithActiveMarkets = response.data.map(match => ({
          ...match,
          markets: match.markets?.filter(market => market.isActive) || []
        }));
        this.matches.set(matchesWithActiveMarkets);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar partidos. Intenta nuevamente.');
        this.loading.set(false);
        console.error('Error loading matches:', err);
      }
    });
  }

  toggleMarket(market: Market, match: Match): void {
    const current = this.selectedMarkets();
    const existingIndex = current.findIndex(m => m.id === market.id);

    if (existingIndex >= 0) {
      // Remove market
      this.selectedMarkets.set(current.filter(m => m.id !== market.id));
    } else {
      // Check if already have a selection from this match
      const matchSelection = current.find(m => m.match?.id === match.id);
      if (matchSelection) {
        this.error.set('No puedes seleccionar múltiples mercados del mismo partido');
        setTimeout(() => this.error.set(null), 3000);
        return;
      }

      // Add market (with match info)
      this.selectedMarkets.set([...current, { ...market, match }]);
      this.error.set(null);
    }
  }

  isMarketSelected(marketId: number): boolean {
    return this.selectedMarkets().some(m => m.id === marketId);
  }

  placeBet(): void {
    if (!this.isFormValid()) {
      this.error.set('Por favor completa todos los campos correctamente');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const formValue = this.betForm.value;
    const request = {
      marketIds: this.selectedMarkets().map(m => m.id),
      betAmount: formValue.betAmount,
      userName: formValue.userName || undefined,
      userPhone: formValue.userPhone || undefined
    };

    this.parleyService.placeTicket(request).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.successTicket.set(response.data);
        this.selectedMarkets.set([]);
        this.betForm.reset();
      },
      error: (err) => {
        this.loading.set(false);
        const errorMsg = err.message || 'Error al crear el parley. Intenta nuevamente.';
        this.error.set(errorMsg);
        console.error('Error placing parley:', err);
      }
    });
  }

  goBack(): void {
    this.successTicket.set(null);
    this.selectedMarkets.set([]);
    this.betForm.reset();
    this.loadUpcomingMatches();
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-VE', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Helper para mostrar errores de validación
   */
  getFieldError(fieldName: string): string | null {
    const field = this.betForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return null;

    if (field.errors['required']) return 'Este campo es obligatorio';
    if (field.errors['min']) return 'El monto mínimo es Bs. 1';
    if (field.errors['minlength']) return 'Nombre muy corto';
    if (field.errors['pattern']) {
      if (fieldName === 'userCedula') return 'Formato: V-12345678 o E-12345678';
      if (fieldName === 'userPhone') return 'Formato: 04121234567';
    }
    return null;
  }
}
