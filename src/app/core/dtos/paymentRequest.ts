import {BillingDetails} from './billingDetails';


export interface PaymentRequest {
  clientSecret?: string;
  amount: number;
  currency: string;
  reason: string;
  billingDetails: BillingDetails;
}
