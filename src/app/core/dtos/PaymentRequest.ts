import {BillingDetails} from './BillingDetails';


export interface PaymentRequest {
  clientSecret?: string;
  amount: number;
  currency: string;
  reason: string;
  billingDetails: BillingDetails;
}
