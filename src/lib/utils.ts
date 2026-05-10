import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ANIM = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: {
    top: { duration: 1.75, ease: "easeInOut" as const },
    mid: { duration: 2.5, delay: 0.5, ease: "easeInOut" as const },
    bottom: { duration: 2.5, delay: 0.5, ease: "easeInOut" as const },
  },
};

export function getRecipeImageFromStoredBase64String(base64: string): string {
  const [, encoded] = base64.split(",");
  const decoded = atob(encoded);
  const bytes = new Uint8Array(decoded.length);
  for (let i = 0; i < decoded.length; i++) {
    bytes[i] = decoded.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: "image/jpeg" });
  return URL.createObjectURL(blob);
}
