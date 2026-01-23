import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    ToastModule,
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};
