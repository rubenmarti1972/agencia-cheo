import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LotteryService } from '../../services';
import { Lottery, LotteryDraw, PlaceLotteryBetResponse } from '../../models';

@Component({
  selector: 'app-loterias',
  imports: [ReactiveFormsModule, DecimalPipe, RouterLink],
  templateUrl: './loterias.component.html',
  styleUrl: './loterias.component.scss'
})
export class LoteriasComponent implements OnInit {
  private readonly lotteryService = inject(LotteryService);
  private readonly fb = inject(FormBuilder);

  // State signals
  lotteries = signal<Lottery[]>([]);
  selectedLottery = signal<Lottery | null>(null);
  openDraws = signal<LotteryDraw[]>([]);
  selectedDraw = signal<LotteryDraw | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  successTicket = signal<PlaceLotteryBetResponse | null>(null);

  // Form
  betForm: FormGroup;

  // Computed
  potentialWin = computed(() => {
    const amount = this.betForm.get('betAmount')?.value;
    const lottery = this.selectedLottery();

    if (!amount || !lottery || amount <= 0) {
      return 0;
    }

    return amount * lottery.payoutMultiplier;
  });

  constructor() {
    this.betForm = this.fb.group({
      betNumber: ['', [
        Validators.required,
        Validators.pattern(/^\d{2,4}$/),
        Validators.minLength(2),
        Validators.maxLength(4)
      ]],
      betAmount: [0, [Validators.required, Validators.min(1)]],
      userName: [''],
      userPhone: ['', [Validators.pattern(/^\d{10,11}$/)]]
    });
  }

  ngOnInit(): void {
    this.loadLotteries();
  }

  loadLotteries(): void {
    this.loading.set(true);
    this.error.set(null);

    this.lotteryService.getAllLotteries().subscribe({
      next: (response) => {
        this.lotteries.set(response.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar las loterías. Intenta nuevamente.');
        this.loading.set(false);
        console.error('Error loading lotteries:', err);
      }
    });
  }

  selectLottery(lottery: Lottery): void {
    this.selectedLottery.set(lottery);
    this.selectedDraw.set(null);
    this.successTicket.set(null);
    this.error.set(null);

    // Update validators based on lottery limits
    this.betForm.get('betAmount')?.setValidators([
      Validators.required,
      Validators.min(lottery.minBetAmount),
      Validators.max(lottery.maxBetAmount)
    ]);
    this.betForm.get('betAmount')?.updateValueAndValidity();

    // Load open draws for this lottery
    this.loadOpenDraws(lottery.id);
  }

  loadOpenDraws(lotteryId: number): void {
    this.loading.set(true);

    this.lotteryService.getOpenDraws(lotteryId).subscribe({
      next: (response) => {
        this.openDraws.set(response.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar sorteos. Intenta nuevamente.');
        this.loading.set(false);
        console.error('Error loading draws:', err);
      }
    });
  }

  selectDraw(draw: LotteryDraw): void {
    this.selectedDraw.set(draw);
    this.successTicket.set(null);
    this.error.set(null);
  }

  placeBet(): void {
    if (this.betForm.invalid || !this.selectedDraw()) {
      return;
    }

    const draw = this.selectedDraw()!;
    const formValue = this.betForm.value;

    this.loading.set(true);
    this.error.set(null);

    const request = {
      drawId: draw.id,
      betNumber: formValue.betNumber,
      betAmount: formValue.betAmount,
      userName: formValue.userName || undefined,
      userPhone: formValue.userPhone || undefined
    };

    this.lotteryService.placeBet(request).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.successTicket.set(response.data);
        this.betForm.reset();
      },
      error: (err) => {
        this.loading.set(false);
        const errorMsg = err.message || 'Error al realizar la apuesta. Intenta nuevamente.';
        this.error.set(errorMsg);
        console.error('Error placing bet:', err);
      }
    });
  }

  goBack(): void {
    if (this.successTicket()) {
      this.successTicket.set(null);
      this.betForm.reset();
    } else if (this.selectedDraw()) {
      this.selectedDraw.set(null);
    } else if (this.selectedLottery()) {
      this.selectedLottery.set(null);
      this.openDraws.set([]);
    }
  }

  formatTime(time: string): string {
    // Format HH:MM:SS to HH:MM AM/PM
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  getDrawStatusText(draw: LotteryDraw): string {
    switch (draw.status) {
      case 'open':
        return 'Abierto';
      case 'closed':
        return 'Cerrado';
      case 'result_published':
        return 'Finalizado';
      default:
        return draw.status;
    }
  }

  getDrawStatusClass(draw: LotteryDraw): string {
    switch (draw.status) {
      case 'open':
        return 'badge-success';
      case 'closed':
        return 'badge-warning';
      case 'result_published':
        return 'badge-info';
      default:
        return 'badge-info';
    }
  }
}
