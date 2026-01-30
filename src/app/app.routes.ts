import { Routes } from '@angular/router';
import {Donation} from './features/donation/donation';
import {PaymentSuccess} from './features/payment-success/payment-success';
import {PaymentCancel} from './features/payment-cancel/payment-cancel';

export const routes: Routes = [

  {
    path: 'donation',
    component: Donation
  },
  {
    path: 'payment/success',
    component: PaymentSuccess,
  },
  {
    path:'payment/cancel',
    component: PaymentCancel,
  },
  {
    path: '',
    redirectTo: 'donation',
    pathMatch: 'full',
  },

];
