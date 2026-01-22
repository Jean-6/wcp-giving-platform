import { Component } from '@angular/core';
import {NgIf} from '@angular/common';
import {StripeService} from 'ngx-stripe';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-donation',
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './donation.html',
  styleUrl: './donation.css',
  standalone: true
})
export class Donation {

  infoForm!: FormGroup;

  selectedPanel: 'support' | 'facture' | 'update' | null = null;

  constructor(private fb: FormBuilder) {
    this.infoForm = this.fb.group({
      amount: ['',
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern(/^[0-9]+$/)
        ]
      ],
      gift: ['', Validators.required],
      firstname: ['',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/)
        ]
      ],
      lastname: [
        '', [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/)
        ]
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{8,15}$/) // Ajuste selon ton pays ]
       ]
      ]
    });
  }

  openPanel(type: 'support' | 'facture' | 'update') {
    this.selectedPanel = type;
  }

  closePanel() {
    this.selectedPanel = null;
  }


  submit() {
    if (this.infoForm.invalid) {
      this.infoForm.markAllAsTouched();
      return;
    }
    console.log('Formulaire valide :', this.infoForm.value);

  }
}
