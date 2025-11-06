'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { motion } from 'framer-motion'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't call useTheme until mounted to avoid context errors
  if (!mounted) {
    return <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
  }

  return <ThemeToggleInner />
}

function ThemeToggleInner() {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'dark' ? 180 : 0,
          scale: theme === 'dark' ? 0 : 1,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="absolute"
      >
        <Sun className="w-5 h-5 text-amber-500" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'light' ? -180 : 0,
          scale: theme === 'light' ? 0 : 1,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="absolute"
      >
        <Moon className="w-5 h-5 text-indigo-400" />
      </motion.div>
    </motion.button>
  )
}
