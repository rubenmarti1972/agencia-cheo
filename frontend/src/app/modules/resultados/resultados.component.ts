import { Component } from '@angular/core';

@Component({
  selector: 'app-resultados',
  template: `
    <div class="module-page">
      <div class="container">
        <h1>Resultados 📊</h1>
        <p class="text-secondary">Módulo en construcción - Próximamente podrás ver todos los resultados</p>

        <div class="card mt-xl">
          <h3>Funcionalidades Planeadas:</h3>
          <ul>
            <li>Resultados diarios de loterías</li>
            <li>Resultados de todos los juegos de animalitos</li>
            <li>Estado y resultados de partidos deportivos</li>
            <li>Filtro por fecha</li>
            <li>Búsqueda por tipo de juego</li>
            <li>Historial de resultados</li>
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
      background: linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-surface) 100%);
      border-left: 4px solid var(--color-accent);
      border-radius: var(--radius-md);
    }
  `]
})
export class ResultadosComponent {}
