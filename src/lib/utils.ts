import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- ADD THIS FUNCTION ---
/**
 * Formats a phone number string:
 * - Translates Arabic numerals to English.
 * - Removes whitespace.
 * - Removes '+2' prefix if present.
 * - Returns the formatted string or null if input is invalid/empty.
 */
export function formatPhoneNumber(
  phone: string | null | undefined
): string | null {
  if (!phone) {
    return null; // Handle null or undefined input
  }

  const arabicNumeralsMap: { [key: string]: string } = {
    "٠": "0",
    "١": "1",
    "٢": "2",
    "٣": "3",
    "٤": "4",
    "٥": "5",
    "٦": "6",
    "٧": "7",
    "٨": "8",
    "٩": "9",
  };

  let formatted = phone.toString(); // Ensure it's a string

  // 1. Translate Arabic numerals to English
  formatted = formatted.replace(
    /[٠-٩]/g,
    (match) => arabicNumeralsMap[match] || match
  );

  // 2. Remove whitespace
  formatted = formatted.replace(/\s+/g, "");

  // 3. Remove '+2' prefix if found
  if (formatted.startsWith("+2")) {
    formatted = formatted.substring(2);
  }

  // 4. Remove any non-digit characters that might remain (optional but good practice)
  formatted = formatted.replace(/\D/g, "");

  // Return the cleaned number (validation will happen in the component)
  return formatted;
}
// --- END OF ADDED FUNCTION ---

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Normalize unicode characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
}
