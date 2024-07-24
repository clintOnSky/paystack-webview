import { PaymentChannels } from "utils/types/paystack";

type AmountValue = string | number;

function isDecimal(input: string | number): boolean {
  if (typeof input === "number") {
    return input % 1 !== 0;
  }
  if (typeof input === "string") {
    console.log("🚀 Input Value", input, isInt(input));
    return isInt(input) || isFloat(input);
  }
  return false;
}

function isFloat(input: string | number): boolean {
  if (typeof input === "number") {
    return input % 1 !== 0;
  }
  if (typeof input === "string") {
    return /^-?\d+\.\d+$/.test(input);
  }
  return false;
}

function isInt(input: string | number): boolean {
  if (typeof input === "number") {
    return Number.isInteger(input);
  }
  if (typeof input === "string") {
    return /^-?\d+$/.test(input);
  }
  return false;
}

function toFloat(input: string | number): number {
  if (typeof input === "number") {
    return input;
  }
  if (typeof input === "string") {
    const parsed = parseFloat(input);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }
  throw new Error("Invalid input, cannot convert to float");
}

function toInt(input: string | number): number {
  if (typeof input === "number") {
    return Math.trunc(input);
  }
  if (typeof input === "string") {
    const parsed = parseInt(input, 10);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }
  throw new Error("Invalid input, cannot convert to integer");
}

// This is the end of AI generated functions

function isNumber(value: any): boolean {
  return typeof value === "number";
}

function isString(value: any): boolean {
  return typeof value === "string";
}

export function isValidStringAmount(stringAmount: string): boolean {
  if (isString(stringAmount) && stringAmount?.endsWith(".")) {
    return false;
  }
  return isDecimal(stringAmount);
}

export function isValidDecimalMonetaryValue(
  amountValue: AmountValue | any
): boolean {
  if (!isNumber(amountValue) && !isString(amountValue)) {
    console.log("Value is not a string or a number");
    return false;
  }

  return isNumber(amountValue) || isValidStringAmount(amountValue);
}

export function isNegative(amountValue: AmountValue): boolean {
  if (typeof amountValue === "string") {
    return amountValue.startsWith("-");
  }
  return amountValue < 0;
}

export function toNumber(string: string): number {
  if (isFloat(string)) {
    return toFloat(string);
  }

  if (isInt(string)) {
    return toInt(string);
  }
  return +string;
}

export function toString(amountValue: AmountValue) {
  return isNumber(amountValue) ? amountValue.toString() : amountValue;
}

export function toAmountInKobo(amountValue: AmountValue) {
  if (typeof amountValue === "string") {
    return toNumber(amountValue) * 100;
  }
  return amountValue * 100;
}

export const getAmountValueInKobo = (amount: AmountValue): number => {
  if (isValidDecimalMonetaryValue(amount)) {
    return toAmountInKobo(amount);
  }
  console.log("Invalid monetary value");
  return 0;
};

export const getChannels = (channelsArrary: PaymentChannels[]) => {
  if (channelsArrary?.length > 0) {
    const channelsString = JSON.stringify(channelsArrary);
    return `channels: ${channelsString},`;
  }
  return "";
};
