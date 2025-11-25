import { Component } from '@angular/core';

@Component({
  selector: 'app-parley',
  template: `
    <div class="module-page">
      <div class="container">
        <h1>Parley Deportivo ⚽</h1>
        <p class="text-secondary">Módulo en construcción - Próximamente podrás crear tus parleys deportivos</p>

        <div class="card mt-xl">
          <h3>Funcionalidades Planeadas:</h3>
          <ul>
            <li>Múltiples deportes (Béisbol, Fútbol, NBA, etc.)</li>
            <li>Ver partidos programados y en vivo</li>
            <li>Mercados variados (Moneyline, Spread, Over/Under)</li>
            <li>Seleccionar múltiples picks para el parley</li>
            <li>Cálculo automático de cuota total (producto de odds)</li>
            <li>Ver ganancia potencial en tiempo real</li>
            <li>Recibir código de ticket</li>
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
      background: var(--color-secondary-50);
      border-left: 4px solid var(--color-secondary);
      border-radius: var(--radius-md);
    }
  `]
})
export class ParleyComponent {}
