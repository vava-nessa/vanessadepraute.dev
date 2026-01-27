/**
 * @file utils.ts
 * @description 🛠️ Utility functions for the application
 *
 * This file contains general-purpose utility functions used across the codebase.
 * Currently focused on className merging for Tailwind CSS.
 *
 * @functions
 *   → cn → Merges className strings with Tailwind conflict resolution
 *
 * @exports cn
 *
 * @see https://ui.shadcn.com/ - shadcn/ui library conventions
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 📖 Merges className strings with intelligent Tailwind CSS conflict resolution
 *
 * This utility combines clsx (for conditional classes) and tailwind-merge (for deduplication).
 * It ensures that later classes override earlier ones properly, even with Tailwind modifiers.
 *
 * Example:
 * ```ts
 * cn("px-4 py-2", "px-6") // → "py-2 px-6" (px-6 overrides px-4)
 * cn("text-red-500", condition && "text-blue-500") // Conditional classes work
 * ```
 *
 * @param inputs - ClassValue arguments (strings, objects, arrays, etc.)
 * @returns Merged className string with conflicts resolved
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
