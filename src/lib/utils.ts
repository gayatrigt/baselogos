import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge classes with tailwind-merge with clsx full feature */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to truncate the address
export const truncateAddress = (address: string | null) => {
  if (!address) return '0x00...0000';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};
