import { Injectable } from '@angular/core';
import {loadStripe, Stripe} from '@stripe/stripe-js';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  private stripePromise = loadStripe(environment.stripePublicKey);

  constructor() { }

  public getStripe(): Promise<Stripe | null>{
    return this.stripePromise;
  }

}
