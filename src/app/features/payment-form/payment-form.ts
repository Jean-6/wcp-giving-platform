import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Modal} from 'bootstrap';
import {
  Stripe, StripeCardCvcElement,
  StripeCardElement,
  StripeCardExpiryElement,
  StripeCardNumberElement,
  StripeElements
} from '@stripe/stripe-js';
import {StripeService} from '../../services/stripe-service';


@Component({
  standalone: true,
  selector: 'app-payment-form',
  imports: [CommonModule],
  templateUrl: './payment-form.html',
  styleUrl: './payment-form.css'
})
export class PaymentForm implements AfterViewInit,OnDestroy{

  stripe!: Stripe | null;
  elements!: StripeElements;

  cardNumber!: StripeCardNumberElement;
  cardExpiry!: StripeCardExpiryElement;
  cardCvc!:StripeCardCvcElement;

  card!: StripeCardElement;

  @ViewChild('modalEl') modalRef!: ElementRef;
  private modalInstance!: Modal;

  constructor(private stripeService : StripeService) {}


  async ngAfterViewInit() {
    this.stripe = await this.stripeService.getStripe();

    if(!this.stripe){
      console.error('Payment platform lot loaded');
      return;
    }

    this.elements = this.stripe.elements();
    this.cardNumber= this.elements.create('cardNumber');
    this.cardExpiry= this.elements.create('cardExpiry');
    this.cardCvc= this.elements.create('cardCvc');

    this.cardNumber.mount('#card-number-element');
    this.cardExpiry.mount('#card-expiry-element');
    this.cardCvc.mount("#card-cvc-element");

    if (this.modalRef?.nativeElement) {
      this.modalInstance = new Modal(this.modalRef.nativeElement);
    }
  }

  openModal(): void {
    this.modalInstance?.show();
  }

  closeModal(): void {
    console.log('Trying to close modal');
    this.modalInstance?.hide();
  }

  ngOnDestroy(): void {
    this.cardNumber.destroy();
    this.cardExpiry.destroy();
    this.cardCvc.destroy();
  }

  submit($event: MouseEvent) {

  }
}

