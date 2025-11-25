import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnimalitosService } from '../../services';
import { Animalito, AnimalitosGame, AnimalitosDraw, PlaceAnimalitosBetResponse } from '../../models';

@Component({
  selector: 'app-animalitos',
  imports: [ReactiveFormsModule, DecimalPipe, RouterLink],
  templateUrl: './animalitos.component.html',
  styleUrl: './animalitos.component.scss'
})
export class AnimalitosComponent implements OnInit {
  private readonly animalitosService = inject(AnimalitosService);
  private readonly fb = inject(FormBuilder);

  // State
  animalitos = signal<Animalito[]>([]);
  games = signal<AnimalitosGame[]>([]);
  selectedGame = signal<AnimalitosGame | null>(null);
  openDraws = signal<AnimalitosDraw[]>([]);
  selectedDraw = signal<AnimalitosDraw | null>(null);
  selectedAnimalito = signal<Animalito | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  successTicket = signal<PlaceAnimalitosBetResponse | null>(null);

  // Form
  betForm: FormGroup;

  // Computed
  potentialWin = computed(() => {
    const amount = this.betForm.get('betAmount')?.value;
    const game = this.selectedGame();

    if (!amount || !game || amount <= 0) {
      return 0;
    }

    return amount * game.payoutMultiplier;
  });

  constructor() {
    this.betForm = this.fb.group({
      betAmount: [0, [Validators.required, Validators.min(1)]],
      userName: [''],
      userPhone: ['', [Validators.pattern(/^\d{10,11}$/)]]
    });
  }

  ngOnInit(): void {
    this.loadGamesAndAnimalitos();
  }

  loadGamesAndAnimalitos(): void {
    this.loading.set(true);
    this.error.set(null);

    // Load games and animalitos in parallel
    Promise.all([
      this.animalitosService.getAllGames().toPromise(),
      this.animalitosService.getAllAnimalitos().toPromise()
    ]).then(([gamesResponse, animalitosResponse]) => {
      this.games.set(gamesResponse?.data || []);
      this.animalitos.set(animalitosResponse?.data || []);
      this.loading.set(false);
    }).catch((err) => {
      this.error.set('Error al cargar datos. Intenta nuevamente.');
      this.loading.set(false);
      console.error('Error loading data:', err);
    });
  }

  selectGame(game: AnimalitosGame): void {
    this.selectedGame.set(game);
    this.selectedDraw.set(null);
    this.selectedAnimalito.set(null);
    this.successTicket.set(null);
    this.error.set(null);

    // Update validators
    this.betForm.get('betAmount')?.setValidators([
      Validators.required,
      Validators.min(game.minBetAmount),
      Validators.max(game.maxBetAmount)
    ]);
    this.betForm.get('betAmount')?.updateValueAndValidity();

    // Load open draws
    this.loadOpenDraws(game.id);
  }

  loadOpenDraws(gameId: number): void {
    this.loading.set(true);

    this.animalitosService.getOpenDraws(gameId).subscribe({
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

  selectDraw(draw: AnimalitosDraw): void {
    this.selectedDraw.set(draw);
    this.selectedAnimalito.set(null);
    this.successTicket.set(null);
    this.error.set(null);
  }

  selectAnimalito(animalito: Animalito): void {
    this.selectedAnimalito.set(animalito);
    this.error.set(null);
  }

  placeBet(): void {
    if (this.betForm.invalid || !this.selectedDraw() || !this.selectedAnimalito()) {
      return;
    }

    const draw = this.selectedDraw()!;
    const animalito = this.selectedAnimalito()!;
    const formValue = this.betForm.value;

    this.loading.set(true);
    this.error.set(null);

    const request = {
      drawId: draw.id,
      animalitoNumber: animalito.number,
      betAmount: formValue.betAmount,
      userName: formValue.userName || undefined,
      userPhone: formValue.userPhone || undefined
    };

    this.animalitosService.placeBet(request).subscribe({
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
    } else if (this.selectedAnimalito()) {
      this.selectedAnimalito.set(null);
    } else if (this.selectedDraw()) {
      this.selectedDraw.set(null);
    } else if (this.selectedGame()) {
      this.selectedGame.set(null);
      this.openDraws.set([]);
    }
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  getDrawStatusText(draw: AnimalitosDraw): string {
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

  getDrawStatusClass(draw: AnimalitosDraw): string {
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
