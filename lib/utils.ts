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
    bg: 'bg-purple-50',
    text: 'text-purple-900',
    header: 'bg-slate-800 text-black shadow-lg',
  },
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-900',
    header: 'bg-slate-800 text-black shadow-lg',
  },
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-900',
    header: 'bg-slate-800 text-black shadow-lg',
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-900',
    header: 'bg-slate-800 text-black shadow-lg',
  },
  rose: {
    bg: 'bg-rose-50',
    text: 'text-rose-900',
    header: 'bg-slate-800 text-black shadow-lg',
  },
  cyan: {
    bg: 'bg-cyan-50',
    text: 'text-cyan-900',
    header: 'bg-slate-800 text-black shadow-lg',
  },
}
