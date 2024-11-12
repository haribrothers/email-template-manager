import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'templates',
    pathMatch: 'full'
  },
  {
    path: 'templates',
    loadComponent: () => import('./pages/templates/templates.component')
      .then(m => m.TemplatesComponent)
  },
  {
    path: 'partials',
    loadComponent: () => import('./pages/partials/partials.component')
      .then(m => m.PartialsComponent)
  },
  {
    path: 'variables',
    loadComponent: () => import('./pages/variables/variables.component')
      .then(m => m.VariablesComponent)
  }
];