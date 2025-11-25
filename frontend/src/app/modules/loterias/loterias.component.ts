import { Component } from '@angular/core';

@Component({
  selector: 'app-loterias',
  template: `
    <div class="module-page">
      <div class="container">
        <h1>Loterías Venezolanas</h1>
        <p class="text-secondary">Módulo en construcción - Próximamente podrás apostar a las mejores loterías de Venezuela</p>

        <div class="card mt-xl">
          <h3>Funcionalidades Planeadas:</h3>
          <ul>
            <li>Ver loterías activas (Zulia, Triple Zulia, etc.)</li>
            <li>Seleccionar sorteos abiertos</li>
            <li>Apostar a números (2-4 dígitos)</li>
            <li>Recibir código de ticket</li>
            <li>Ver multiplicadores de pago (70x típicamente)</li>
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
      background: var(--color-primary-50);
      border-left: 4px solid var(--color-primary);
      border-radius: var(--radius-md);
    }
  `]
})
export class LoteriasComponent {}
