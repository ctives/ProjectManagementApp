// Simple in-memory rate limiting for development
// For production with multiple instances, use Upstash Redis

const requests = new Map<string, number[]>()

interface RateLimitResult {
  success: boolean
  remaining: number
  limit: number
  reset?: number
}

export function rateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 3600000 // 1 hour
): RateLimitResult {
  const now = Date.now()
  const windowStart = now - windowMs

  // Get user's request timestamps
  let userRequests = requests.get(identifier) || []

  // Remove expired timestamps
  userRequests = userRequests.filter((timestamp) => timestamp > windowStart)

  // Check if limit exceeded
  const success = userRequests.length < limit

  if (success) {
    // Add current request
    userRequests.push(now)
  }

  // Update the map
  requests.set(identifier, userRequests)

  // Calculate reset time (when oldest request expires)
  const oldestRequest = userRequests[0]
  const resetTime = oldestRequest ? oldestRequest + windowMs : now + windowMs

  return {
    success,
    remaining: Math.max(0, limit - userRequests.length),
    limit,
    reset: resetTime,
  }
}

// Cleanup old entries periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now()
  const windowMs = 3600000

  for (const [identifier, timestamps] of requests.entries()) {
    const validTimestamps = timestamps.filter((ts) => now - ts < windowMs)
    if (validTimestamps.length === 0) {
      requests.delete(identifier)
    } else {
      requests.set(identifier, validTimestamps)
    }
  }
}, 600000) // Cleanup every 10 minutes
