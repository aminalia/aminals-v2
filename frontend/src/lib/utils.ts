import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isBigInt(value: string) {
  try {
    BigInt(value);
    return true;
  } catch {
    return false;
  }
}
