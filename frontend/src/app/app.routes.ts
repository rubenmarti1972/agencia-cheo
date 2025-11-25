import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Inicio - Agencia Cheo'
  },
  {
    path: 'loterias',
    loadComponent: () => import('./modules/loterias/loterias.component').then(m => m.LoteriasComponent),
    title: 'Loterías - Agencia Cheo'
  },
  {
    path: 'animalitos',
    loadComponent: () => import('./modules/animalitos/animalitos.component').then(m => m.AnimalitosComponent),
    title: 'Animalitos - Agencia Cheo'
  },
  {
    path: 'parley',
    loadComponent: () => import('./modules/parley/parley.component').then(m => m.ParleyComponent),
    title: 'Parley Deportivo - Agencia Cheo'
  },
  {
    path: 'consultar-ticket',
    loadComponent: () => import('./modules/ticket/ticket.component').then(m => m.TicketComponent),
    title: 'Consultar Ticket - Agencia Cheo'
  },
  {
    path: 'resultados',
    loadComponent: () => import('./modules/resultados/resultados.component').then(m => m.ResultadosComponent),
    title: 'Resultados - Agencia Cheo'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
