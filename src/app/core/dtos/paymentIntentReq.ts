import {BillingDetails} from './billingDetails';


export interface PaymentIntentReq {
  clientSecret?: string;
  amount: number;
  currency: string;
  reason: string;
  billingDetails: BillingDetails;
}
