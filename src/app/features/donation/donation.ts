import {Component, ElementRef, ViewChild} from '@angular/core';
import {NgIf} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MyStripeService} from './service/my-stripe-service';
import {AlertService} from '../../core/services/alert-service';
import {Dialog} from 'primeng/dialog';
import {ProgressSpinner} from 'primeng/progressspinner';

@Component({
  selector: 'app-donation',
  imports: [
    NgIf,
    ReactiveFormsModule,
    Dialog,
    ProgressSpinner,
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


  constructor(private fb: FormBuilder, private stripeService: MyStripeService, private alert: AlertService) {
    this.infoForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]+$/)]],
      gift: ['', Validators.required],
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)  ]] // Selon pays
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

    setTimeout(()=>{
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

  pay(){

  }

}
