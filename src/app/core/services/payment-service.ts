import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PaymentRequest} from '../dtos/paymentRequest';
import {CheckoutSessionRes} from '../dtos/checkoutSessionRes';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {

  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createIntent(amount: number,currency = 'eur'): Observable<{ clientSecret: string }> {
    return this.http.post< { clientSecret : string } >( `${this.API_URL}/create-intent`, {amount: amount, currency: 'eur'})
  }

  createPaymentIntent(payload: PaymentRequest) {
    return this.http.post<{ clientSecret: string }>(`${this.API_URL}/api/payment/`, payload);
  }

  createCheckoutSession(payload: PaymentRequest): Observable<CheckoutSessionRes>{
    return this.http.post<CheckoutSessionRes>(`${this.API_URL}/api/payment/create-session`, payload);
  }

}
