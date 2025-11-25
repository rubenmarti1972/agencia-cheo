import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { LotteryService, AnimalitosService, ParleyService } from '../../services';
import { LotteryDraw, AnimalitosDraw, Match } from '../../models';
import { forkJoin } from 'rxjs';

type ResultType = 'all' | 'loterias' | 'animalitos' | 'partidos';

@Component({
  selector: 'app-resultados',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.scss'
})
export class ResultadosComponent implements OnInit {
  private readonly lotteryService = inject(LotteryService);
  private readonly animalitosService = inject(AnimalitosService);
  private readonly parleyService = inject(ParleyService);
  private readonly fb = inject(FormBuilder);

  // State
  lotteryResults = signal<LotteryDraw[]>([]);
  animalitosResults = signal<AnimalitosDraw[]>([]);
  matchResults = signal<Match[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  activeFilter = signal<ResultType>('all');

  // Form
  filterForm: FormGroup;

  constructor() {
    const today = new Date().toISOString().split('T')[0];
    this.filterForm = this.fb.group({
      date: [today]
    });
  }

  ngOnInit(): void {
    this.loadResults();

    // Reload results when date changes
    this.filterForm.get('date')?.valueChanges.subscribe(() => {
      this.loadResults();
    });
  }

  loadResults(): void {
    this.loading.set(true);
    this.error.set(null);

    const date = this.filterForm.get('date')?.value;

    // Load all results in parallel
    forkJoin({
      lotteries: this.lotteryService.getResults(date),
      animalitos: this.animalitosService.getResults(date),
      matches: this.parleyService.getFinishedMatches(date)
    }).subscribe({
      next: (results) => {
        this.lotteryResults.set(results.lotteries.data);
        this.animalitosResults.set(results.animalitos.data);
        this.matchResults.set(results.matches.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar resultados. Intenta nuevamente.');
        this.loading.set(false);
        console.error('Error loading results:', err);
      }
    });
  }

  setFilter(type: ResultType): void {
    this.activeFilter.set(type);
  }

  shouldShowLotteries(): boolean {
    return this.activeFilter() === 'all' || this.activeFilter() === 'loterias';
  }

  shouldShowAnimalitos(): boolean {
    return this.activeFilter() === 'all' || this.activeFilter() === 'animalitos';
  }

  shouldShowMatches(): boolean {
    return this.activeFilter() === 'all' || this.activeFilter() === 'partidos';
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  formatMatchDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-VE', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getAnimalitosGameName(draw: AnimalitosDraw): string {
    return draw.game?.name || 'Animalitos';
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}
