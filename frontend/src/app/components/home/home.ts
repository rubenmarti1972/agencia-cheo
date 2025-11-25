import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {
  // Categorías de apuestas
  categories = [
    {
      title: 'Loterías',
      description: 'Apuesta a las mejores loterías de Venezuela',
      icon: '🎟️',
      route: '/loterias',
      color: 'primary'
    },
    {
      title: 'Animalitos',
      description: 'Elige tu animalito de la suerte (1-36)',
      icon: '🐘',
      route: '/animalitos',
      color: 'accent'
    },
    {
      title: 'Parley Deportivo',
      description: 'Combina tus apuestas deportivas y multiplica tus ganancias',
      icon: '⚽',
      route: '/parley',
      color: 'secondary'
    }
  ];
}
