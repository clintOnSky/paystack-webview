import * as React from "react";
export interface PaystackResponse {
  status: string;
  data: {
    event: string;
    transactionRef: TransactionRef;
  };
  transactionRef?: TransactionRef; // Optional duplicate property (handle based on usage)
}

export interface TransactionRef {
  message: string;
  redirecturl: string;
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  trxref: string;
}

export type Currency = "NGN" | "GHS" | "USD" | "ZAR";

export type PaymentChannels = "bank" | "card" | "qr" | "ussd" | "mobile_money";

interface Response {
  status: string;
}
interface SuccessResponse extends Response {
  transactionRef?: string;
  data?: any;
}

export interface PayStackProps {
  paystackKey: string;
  billingEmail: string;
  firstName?: string;
  lastName?: string;
  // Use phone instead of billingMobile if you encounter issues
  billingMobile?: string;
  amount: string | number;
  currency?: Currency;
  channels?: PaymentChannels[];
  refNumber?: string;
  billingName?: string;
  subaccount?: string;
  handleWebViewMessage?: (string: string) => void;
  onCancel: (Response: Response) => void;
  onSuccess: (SuccessResponse: SuccessResponse) => void;
  autoStart?: boolean;
  activityIndicatorColor?: string;
  ref: React.ReactElement;
}

export interface PayStackRef {
  startTransaction: () => void;
  endTransaction: () => void;
}
