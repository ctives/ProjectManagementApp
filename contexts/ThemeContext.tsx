'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize state based on what the script in layout.tsx set
  const getInitialTheme = (): Theme => {
    if (typeof window === 'undefined') return 'light'

    // Check if the dark class is already on the document (from layout.tsx script)
    if (document.documentElement.classList.contains('dark')) {
      return 'dark'
    }

    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme) {
      return savedTheme
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  }

  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [mounted, setMounted] = useState(false)

  // Mark as mounted after hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Update document class and localStorage when theme changes
  useEffect(() => {
    const root = document.documentElement

    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Only save to localStorage after mount to avoid hydration issues
    if (mounted) {
      localStorage.setItem('theme', theme)
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  // Prevent flash of incorrect theme
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
