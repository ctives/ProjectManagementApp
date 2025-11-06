'use client'

import { useState, useEffect, useCallback } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isClient, setIsClient] = useState(false)

  // Handle SSR - only run on client
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Initialize from localStorage
  useEffect(() => {
    if (!isClient) return

    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error)
    }
  }, [key, isClient])

  // Update localStorage when state changes
  const setValue = useCallback((value: T) => {
    try {
      setStoredValue(value)
      if (isClient) {
        window.localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error)
    }
  }, [key, isClient])

  return [storedValue, setValue]
}
