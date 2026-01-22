import { Routes } from '@angular/router';
import {Donation} from './features/donation/donation';

export const routes: Routes = [

  {
    path: 'donation',
    component: Donation
  },
  {
    path: '',
    redirectTo: 'donation',
    pathMatch: 'full',
  }
];
