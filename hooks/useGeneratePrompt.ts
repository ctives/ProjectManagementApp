'use client'

import { useState, useCallback } from 'react'
import type { GeneratePromptResponse, GeneratePromptError, AIGenerationState } from '@/types/openai'

export function useGeneratePrompt() {
  const [state, setState] = useState<AIGenerationState>({
    isLoading: false,
    error: null,
    prompt: null,
  })

  const generatePrompt = useCallback(async (taskTitle: string): Promise<string> => {
    // Reset state
    setState({
      isLoading: true,
      error: null,
      prompt: null,
    })

    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskTitle }),
      })

      // Parse response
      const data = (await response.json()) as GeneratePromptResponse | GeneratePromptError

      // Check if response is successful
      if (!response.ok) {
        const errorData = data as GeneratePromptError
        throw new Error(errorData.error || 'Failed to generate prompt')
      }

      const successData = data as GeneratePromptResponse
      const prompt = successData.prompt

      // Update state with success
      setState({
        isLoading: false,
        error: null,
        prompt,
      })

      return prompt
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while generating the prompt'

      // Update state with error
      setState({
        isLoading: false,
        error: errorMessage,
        prompt: null,
      })

      // Re-throw for caller to handle
      throw error
    }
  }, [])

  const clearError = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
    }))
  }, [])

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      prompt: null,
    })
  }, [])

  return {
    ...state,
    generatePrompt,
    clearError,
    reset,
  }
}
