import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PaymentIntentReq} from '../dtos/paymentIntentReq';
import {CheckoutSessionRes} from '../dtos/checkoutSessionRes';
import {Session} from '../dtos/session';
import {PaymentIntentRes} from '../dtos/paymentIntentRes';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {

  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createIntent(amount: number,currency = 'eur'): Observable<{ clientSecret: string }> {
    return this.http.post< { clientSecret : string } >( `${this.API_URL}/create-intent`, {amount: amount, currency: 'eur'})
  }

  createPaymentIntent(payload: PaymentIntentReq) {
    return this.http.post<{ clientSecret: string }>(`${this.API_URL}/api/payment/`, payload);
  }

  createCheckoutSession(payload: PaymentIntentReq): Observable<CheckoutSessionRes>{
    return this.http.post<CheckoutSessionRes>(`${this.API_URL}/api/payment/create-session`, payload);
  }

  getSession(sessionId: string): Observable<Session>{
    return this.http.get<Session>(`${this.API_URL}/api/stripe/session/${sessionId}`);
  }

  getPaymentIntent(id: string): Observable<PaymentIntentRes> {
    return this.http.get<PaymentIntentRes>(`${this.API_URL}/api/stripe/payment-intent/${id}`);
  }
}
