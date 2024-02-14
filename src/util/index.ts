import { format, differenceInHours, isAfter } from "date-fns";

export const formatCurrency = (amount: number) => {
  const Pound = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: amount > 100 ? 0 : 2,
  });

  return Pound.format(amount);
};

export const formatToDate = (date: Date) => {
  return format(date, "dd/MM/yyyy");
};

export const expiresSoon = (date: Date) => {
  return differenceInHours(new Date(), date) < 12;
};

export const hasExpired = (date: Date) => {
  return isAfter(new Date(), date);
};

export function removeUndefinedFields<T extends {}>(obj: T): T {
  const result: Partial<T> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      if (
        value !== undefined &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        result[key] = value;
      }
    }
  }

  return result as T;
}

export const formatToSortCode = (input: string) => {
  const digitsOnly = input.replace(/\D/g, "");

  const digitsWithoutDashes = digitsOnly.replace("-", "");

  return [
    digitsOnly.substring(0, 2) ?? false,
    digitsWithoutDashes.length > 2 ? "-" : false,
    digitsOnly.substring(2, 4) ?? false,
    digitsWithoutDashes.length > 4 ? "-" : false,
    digitsOnly.substring(4),
  ]
    .filter(Boolean)
    .join("");
};

export const removeAllWhitespace = (input: string) => input.replace(/\s/g, "");
