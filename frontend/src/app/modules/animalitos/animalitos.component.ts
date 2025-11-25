import { Component } from '@angular/core';

@Component({
  selector: 'app-animalitos',
  template: `
    <div class="module-page">
      <div class="container">
        <h1>Animalitos 🐘</h1>
        <p class="text-secondary">Módulo en construcción - Próximamente podrás jugar a los animalitos</p>

        <div class="card mt-xl">
          <h3>Funcionalidades Planeadas:</h3>
          <ul>
            <li>Catálogo completo de 36 animalitos</li>
            <li>Múltiples juegos por día (9am, 12pm, 4pm, 7pm)</li>
            <li>Seleccionar animalito de la suerte (1-36)</li>
            <li>Ver multiplicadores (30x típicamente)</li>
            <li>Recibir código de ticket</li>
            <li>Resultados en tiempo real</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .module-page {
      min-height: calc(100vh - 80px);
      padding: var(--spacing-2xl) 0;
      background: var(--color-background);
    }

    ul {
      list-style: none;
      padding: 0;
    }

    li {
      padding: var(--spacing-sm);
      margin-bottom: var(--spacing-sm);
      background: var(--color-accent);
      color: var(--color-secondary-dark);
      border-left: 4px solid var(--color-secondary);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-medium);
    }
  `]
})
export class AnimalitosComponent {}
