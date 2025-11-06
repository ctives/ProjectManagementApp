export interface GeneratePromptRequest {
  taskTitle: string
}

export interface GeneratePromptResponse {
  prompt: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface GeneratePromptError {
  error: string
  code?: string
}

export interface AIGenerationState {
  isLoading: boolean
  error: string | null
  prompt: string | null
}
