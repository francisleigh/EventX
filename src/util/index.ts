import { cx } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

type ClassNameValue = string | undefined;
/**
 * Concatenate and merge tailwind class names
 *
 * @param {...string} inputs
 * @returns
 */
export const cn = (...inputs: ClassNameValue[]) => {
  return twMerge(cx(inputs));
};
