import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { NgIf} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MyStripeService} from './service/my-stripe-service';
import {AlertService} from '../../core/services/alert-service';
import {Dialog} from 'primeng/dialog';
import {PaymentService} from '../../core/services/payment-service';
import {PaymentIntentReq} from '../../core/dtos/paymentIntentReq';
import {GoogleMapsLoaderService} from '../../core/services/google-maps-loader-service';
import {DatePicker} from 'primeng/datepicker';
import {minMaxDateValidator} from '../../shared/validator/min-max-date.validator';
import {Router} from '@angular/router';
import {AutoFocus} from 'primeng/autofocus';


declare const google: any;

@Component({
  selector: 'app-donation',
  imports: [
    NgIf,
    ReactiveFormsModule,
    Dialog,
    FormsModule,
    DatePicker,
    AutoFocus,
  ],
  templateUrl: './donation.html',
  styleUrl: './donation.css',
  standalone: true
})
export class Donation implements OnInit{

  infoForm!: FormGroup;
  paymentMethod: PaymentMethod ='CARD_DIRECT';

  selectedPanel: 'support' | 'facture' | 'update' | 'stripe' | null = null;
  showStripeDialog = false;
  private cardMounted = false;
  isLoading = false;
  minDate!: Date;
  maxDate!: Date;
  reportForm!: FormGroup;

  @ViewChild('cardNumberEl') cardNumberEl!: ElementRef;
  @ViewChild('cardExpiryEl') cardExpiryEl!: ElementRef;
  @ViewChild('cardCvcEl') cardCvcEl!: ElementRef;


  constructor(private fb: FormBuilder,
              private stripeService: MyStripeService,
              private paymentService: PaymentService,
              private alert: AlertService,
              private googleMapsLoader: GoogleMapsLoaderService,
              private router: Router
  ) {
    this.infoForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]+$/)]],
      reason: ['', Validators.required],
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]], // Selon pays
      address: ['', [Validators.required]]
    });

    this.reportForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      minDate:['', [Validators.required]],
      maxDate:['', [Validators.required]],
    },
      { validators: minMaxDateValidator})
  }


  @ViewChild('addressInput')
  set address(el: ElementRef<HTMLInputElement> | undefined) {
    if (!el) return;

    this.googleMapsLoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(
        el.nativeElement,
        {
          types: ['address'],
          componentRestrictions: {country: 'fr'},
          fields: ['formatted_address', 'address_components', 'geometry']
        });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place?.formatted_address) return;

        this.infoForm.patchValue({address: place.formatted_address});

      });
    });
  }

  selectPaymentMethod(method: PaymentMethod) {
    this.paymentMethod = method;
  }


  openPanel(type: 'support' | 'facture' | 'update') {
    this.selectedPanel = type;
  }

  closePanel() {
    this.selectedPanel = null;
  }

  submit() {


    if(!this.paymentMethod){
      this.alert.warn("Merci de selection un mode de paiement")
      return;
    }

    this.isLoading = true;

    if (this.infoForm.invalid) {
      this.infoForm.markAllAsTouched();
      return;
    }
    if(this.paymentMethod === 'STRIPE_CHECKOUT'){
      console.log("submit: "+ "STRIPE_CHECKOUT")
      this.redirectToCheckout()
    }
    if(this.paymentMethod === 'CARD_DIRECT'){
      console.log("submit: "+ "CARD_DIRECT")
      this.cardMounted = false;
      this.showStripeDialog = true;
    }
    this.isLoading = false;
  }

  /**
   * Called by p-dialog (onShow)
   */

  onStripeDialogOpen() {

    this.isLoading = true;
      this.stripeService.init$().subscribe(() => {
        this.stripeService.mountAll(
          this.cardNumberEl.nativeElement,
          this.cardExpiryEl.nativeElement,
          this.cardCvcEl.nativeElement
        );
        this.isLoading = false
      });
  }

  /**
   * Called by p-dialog (onHide)
   */


  onStripeDialogHide() {
    this.stripeService.unmountAll();
  }


  redirectToCheckout() {
    this.isLoading = true;

    const payload: PaymentIntentReq = {
      amount: this.infoForm.value.amount * 100,
      currency: 'eur',
      reason: this.infoForm.value.reason,
      billingDetails: {
        firstname: this.infoForm.value.firstname,
        lastname: this.infoForm.value.lastname,
        email: this.infoForm.value.email,
        phone: this.infoForm.value.phone,
        address: this.googleMapsLoader.parseAddress(this.infoForm.value.address)
      }
    };

    console.log("redirectToCheckout: {}", payload)

    this.paymentService.createCheckoutSession(payload)
      .subscribe({
        next: ({ url }) => {
          window.location.href = url; // Redirect to stripe
        },
        error: () => {
          this.isLoading = false;
          this.alert.error('Erreur lors de la redirection Stripe');
        }
      });

  }
  payDirect() {

    if (this.isLoading) return;
    this.isLoading = true;

    const amount = this.infoForm.value.amount * 100;
    const addressParsed = this.googleMapsLoader.parseAddress(this.infoForm.value.address)

    const payload: PaymentIntentReq = {
      clientSecret: undefined,
      amount: amount,
      currency: 'eur',
      reason: this.infoForm.value.reason,
      billingDetails: {
        firstname: this.infoForm.value.firstname,
        lastname: this.infoForm.value.lastname,
        email: this.infoForm.value.email,
        phone: this.infoForm.value.phone,
        address: addressParsed
      }
    };

    console.log("payDirect: {}", payload)

    // Sending backend
    this.paymentService.createPaymentIntent(payload)
      .subscribe({
        next: ({ clientSecret }) => {

          payload.clientSecret = clientSecret;

          // Stripe Confirmation
          this.stripeService.confirmPayment$(payload)
            .subscribe(result => {
              this.isLoading = false;

              const paymentIntentId = result.paymentIntentId;

              if (result.success) {
                this.alert.success('Paiement réussi');
                this.showStripeDialog = false;
                this.resetForm()
                this.router.navigate(['/success'],
                  {
                    queryParams: { payment_intent: paymentIntentId }
                  })

              } else {
                this.alert.error('Une erreur est survenue');
                this.router.navigate(['/cancel'],
                  {
                    queryParams: { payment_intent: paymentIntentId }
                  })
              }
            });
        },
        error: err => {
          this.isLoading = false;
          console.error(err);
          this.alert.error('Erreur lors du paiement');
        }
      });
  }


  private resetForm() {
    this.infoForm.reset()
  }

  submitReportForm() {

  }

  ngOnInit(): void {
    this.setYearLimits();
  }

  setYearLimits(){

    const today = new Date();
    const year = today.getFullYear();

    this.minDate = new Date(year,0,1);
    this.maxDate = today

  }

}
