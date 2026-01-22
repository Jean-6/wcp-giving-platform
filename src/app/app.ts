import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
//import {PaymentForm} from './features/payment-form/payment-form';
import {NgIf} from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet,NgIf],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App{
  protected title = 'wcp-giving-platform';
  isImageLoaded = false;


  //@ViewChild(PaymentForm,{ static: false }) modalChild!: PaymentForm;

  openChild(event: any): void{
    //this.modalChild.openModal();
  }

  onImageLoad() {
    //this.isImageLoaded=true;
  }
}
