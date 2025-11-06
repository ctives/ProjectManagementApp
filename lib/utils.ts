import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return crypto.getRandomValues(new Uint8Array(16)).reduce((acc, byte) => {
    return acc + ('0' + byte.toString(16)).slice(-2)
  }, '')
}

export const columnColors: Record<string, { bg: string; text: string; header: string }> = {
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    text: 'text-purple-900 dark:text-purple-300',
    header: 'bg-slate-800 dark:bg-slate-700 text-white shadow-lg',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-900 dark:text-blue-300',
    header: 'bg-slate-800 dark:bg-slate-700 text-white shadow-lg',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    text: 'text-emerald-900 dark:text-emerald-300',
    header: 'bg-slate-800 dark:bg-slate-700 text-white shadow-lg',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-900 dark:text-amber-300',
    header: 'bg-slate-800 dark:bg-slate-700 text-white shadow-lg',
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    text: 'text-rose-900 dark:text-rose-300',
    header: 'bg-slate-800 dark:bg-slate-700 text-white shadow-lg',
  },
  cyan: {
    bg: 'bg-cyan-50 dark:bg-cyan-900/20',
    text: 'text-cyan-900 dark:text-cyan-300',
    header: 'bg-slate-800 dark:bg-slate-700 text-white shadow-lg',
  },
}
