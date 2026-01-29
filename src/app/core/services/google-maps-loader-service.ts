import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsLoaderService {


  private loaded = false;
  private loading!: Promise<void>;
  apiKey = environment.googleMapsApiKey;

  load(): Promise<void> {
    if (this.loaded) return Promise.resolve();
    if (this.loading) return this.loading;

    this.loading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js' +
        `?key=${this.apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.loaded = true;
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });

    return this.loading;

  }

  parseAdress(fullAdress: string){
    if(!fullAdress){
      return {
        line1: null,
        city: null,
        country: null,
        postal_code: null,
        state: null,
        line2: null,
      };
    }

    const parts = fullAdress.split(',').map(p => p.trim());

    return {
      line1: parts[0] || null,
      city: parts[1] || null,
      country: parts[2] || null,
      postal_code: null,
      state: null,
      line2: null,
    }
  }

}
