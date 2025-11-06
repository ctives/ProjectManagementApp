import { NextRequest, NextResponse } from 'next/server'
import { openai, SYSTEM_PROMPT } from '@/lib/openai'
import { rateLimit } from '@/lib/ratelimit'
import type { GeneratePromptRequest, GeneratePromptResponse } from '@/types/openai'

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'anonymous'

    // Check rate limit (10 requests per hour)
    const rateLimitResult = rateLimit(ip, 10, 3600000)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Maximum 10 requests per hour.',
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'Retry-After': Math.ceil((rateLimitResult.reset! - Date.now()) / 1000).toString(),
          },
        }
      )
    }

    // Parse request body
    const body = (await request.json()) as GeneratePromptRequest

    // Validate task title
    const { taskTitle } = body

    if (!taskTitle || typeof taskTitle !== 'string') {
      return NextResponse.json(
        {
          error: 'Task title is required and must be a string',
        },
        { status: 400 }
      )
    }

    // Sanitize and validate task title
    const sanitizedTitle = taskTitle.trim()

    if (sanitizedTitle.length === 0) {
      return NextResponse.json(
        {
          error: 'Task title cannot be empty',
        },
        { status: 400 }
      )
    }

    if (sanitizedTitle.length > 200) {
      return NextResponse.json(
        {
          error: 'Task title too long (maximum 200 characters)',
        },
        { status: 400 }
      )
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `Convert this task title into a detailed, actionable prompt for Claude Code:\n\nTask Title: "${sanitizedTitle}"`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    // Extract generated prompt
    const generatedPrompt = completion.choices[0]?.message?.content

    if (!generatedPrompt) {
      console.error('No content in OpenAI response', completion)
      return NextResponse.json(
        {
          error: 'Failed to generate prompt. Please try again.',
        },
        { status: 500 }
      )
    }

    const response: GeneratePromptResponse = {
      prompt: generatedPrompt.trim(),
      usage: {
        prompt_tokens: completion.usage?.prompt_tokens || 0,
        completion_tokens: completion.usage?.completion_tokens || 0,
        total_tokens: completion.usage?.total_tokens || 0,
      },
    }

    return NextResponse.json(response, {
      headers: {
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
      },
    })
  } catch (error) {
    console.error('Error generating prompt:', error)

    // Check if it's an OpenAI API error
    if (error instanceof Error) {
      if (error.message.includes('API')) {
        return NextResponse.json(
          {
            error: 'OpenAI service error. Please check your API key and try again.',
          },
          { status: 500 }
        )
      }

      return NextResponse.json(
        {
          error: error.message || 'An error occurred while generating the prompt',
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        error: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    )
  }
}
