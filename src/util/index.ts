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
