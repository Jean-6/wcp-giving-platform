import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'payment-form',
    loadComponent: ()=> import('./features/payment-form/payment-form')
      .then(m => m.PaymentForm)
  },

  {
    //path: '',
    //redirectTo: 'payment-form',
    //pathMatch: 'full',
  }
];
