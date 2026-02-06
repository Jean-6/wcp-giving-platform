import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {PaymentIntentRes} from '../../core/dtos/paymentIntentRes';
import {PaymentService} from '../../core/services/payment-service';
import {DecimalPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-payment-cancel',
  imports: [
    RouterLink,
    DecimalPipe,
    NgIf
  ],
  templateUrl: './payment-cancel.html',
  styleUrl: './payment-cancel.css',
  standalone: true
})
export class PaymentCancel implements OnInit{

  sessionId!: string;
  session: any;
  isLoading: boolean = false;
  paymentIntent: PaymentIntentRes | null = null;
  paymentMethod: PaymentMethod | null = null;

  constructor(private route: ActivatedRoute,
              private paymentService: PaymentService) {}

  ngOnInit(): void {


    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    const paymentIntentId = this.route.snapshot.queryParamMap.get('payment_intent');


    /*
        if (sessionId) {
          this.loadCheckoutSession(sessionId);
        } else*/
    if (paymentIntentId) {
      this.loadPaymentIntent(paymentIntentId);
    }/* else {
      console.error("Aucun identifiant de paiement trouvé");
    }*/
  }

  loadPaymentIntent(paymentIntentId: string) {
    this.isLoading = true;
    this.paymentService.getPaymentIntent(paymentIntentId)
      .subscribe({
        next: (pi) => {
          this.paymentIntent = pi;
          this.paymentMethod = 'CARD_DIRECT';
          console.log(this.paymentIntent)
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }


  get amountInEuro(): number{
    return (this.paymentIntent?.amount ?? 0) / 100;
  }

  get createdDate(): number | null {
    return this.paymentIntent?.created
      ? this.paymentIntent.created * 1000
      : null;
  }



}
