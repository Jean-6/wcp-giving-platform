import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgIf} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MyStripeService} from './service/my-stripe-service';
import {AlertService} from '../../core/services/alert-service';
import {Dialog} from 'primeng/dialog';
import {PaymentService} from '../../core/services/payment-service';
import {PaymentRequest} from '../../core/dtos/PaymentRequest';
import {GoogleMapsLoaderService} from '../../core/services/google-maps-loader-service';

declare const google: any;

@Component({
  selector: 'app-donation',
  imports: [
    NgIf,
    ReactiveFormsModule,
    Dialog,
    //ProgressSpinner,
  ],
  templateUrl: './donation.html',
  styleUrl: './donation.css',
  standalone: true
})
export class Donation {

  infoForm!: FormGroup;
  selectedPanel: 'support' | 'facture' | 'update' | 'stripe' | null = null;
  showStripeDialog = false;
  private cardMounted = false;
  isLoading = false;

  @ViewChild('cardNumberEl') cardNumberEl!: ElementRef;
  @ViewChild('cardExpiryEl') cardExpiryEl!: ElementRef;
  @ViewChild('cardCvcEl') cardCvcEl!: ElementRef;


  constructor(private fb: FormBuilder,
              private stripeService: MyStripeService,
              private paymentService: PaymentService,
              private alert: AlertService,
              private googleMapsLoader: GoogleMapsLoaderService
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

        console.log('Adresse Google:', place);
      });
    });
  }

  openPanel(type: 'support' | 'facture' | 'update') {
    this.selectedPanel = type;
  }

  closePanel() {
    this.selectedPanel = null;
  }

  submit() {

    this.isLoading = true;

    if (this.infoForm.invalid) {
      this.infoForm.markAllAsTouched();
      return;
    }
    console.log('Formulaire valide :', this.infoForm.value);
    this.cardMounted = false;
    this.showStripeDialog = true;

    this.isLoading = false;

  }

  /**
   * Called by p-dialog (onShow)
   */

  onStripeDialogOpen() {

    this.isLoading = true;

    setTimeout(() => {
      this.stripeService.init$().subscribe(() => {
        this.stripeService.mountAll(
          this.cardNumberEl.nativeElement,
          this.cardExpiryEl.nativeElement,
          this.cardCvcEl.nativeElement
        );
        this.isLoading = false
      });
    })
  }

  /**
   * Called by p-dialog (onHide)
   */

  closeStripeDialog() {
    this.showStripeDialog = false
    this.stripeService.unmountAll();
    this.isLoading = false
  }

  pay() {

    this.isLoading = true

    console.log(this.infoForm.value)

    const amount = this.infoForm.value.amount * 100


    this.paymentService.createIntent(amount)
      .subscribe({
        next: ({clientSecret}) => {

          const payload: PaymentRequest = {
            clientSecret: clientSecret,
            amount: amount,
            currency: 'eur',
            reason: this.infoForm.value.reason,
            billingDetails: {
              firstname: this.infoForm.value.firstname,
              lastname: this.infoForm.value.lastname,
              email: this.infoForm.value.email,
              phone: this.infoForm.value.phone,
              address: this.infoForm.value.address
            }
          };

          this.stripeService.confirmPayment$(payload)
            .subscribe({
              next: result => {
                this.isLoading = false;
                if (result.success) {
                  this.resetForm();
                  this.closeStripeDialog();
                  this.alert.success('Paiement réussi');
                } else {
                  this.alert.error('Une erreur est survenue');
                }
              }
            });
        }, error: err => {
          this.isLoading = false;
          console.error(err);
          this.alert.error('Error when paying');
        }
      });

  }

  private resetForm() {
    this.infoForm.reset()
  }

}
