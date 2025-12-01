import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function parseSearchQuery(input: string) {
  const tagMatches = input.match(/"([^"]+)"/g);

  const tags = tagMatches
    ? tagMatches.map(t => t.replace(/"/g, '').trim())
    : [];
  const name = input.replace(/"([^"]+)"/g, '').replace(/\s+/g, ' ').trim();

  return { name, tags };
}
