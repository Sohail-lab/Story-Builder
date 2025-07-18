import { NextRequest, NextResponse } from 'next/server';
import { createGeminiService, GeminiServiceError } from '@/services/gemini-service';
import { PlayerProfileSchema } from '@/types';

// Rate limiting (simple in-memory store - use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const clientData = rateLimitStore.get(clientId);
  
  if (!clientData || now > clientData.resetTime) {
    // Reset or initialize rate limit
    rateLimitStore.set(clientId, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS
    });
    return true;
  }
  
  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  clientData.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    
    // Check rate limit
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded. Please try again later.' 
        },
        { status: 429 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    
    // Validate player profile
    let playerProfile;
    try {
      playerProfile = PlayerProfileSchema.parse(body.playerProfile);
    } catch {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid player profile data' 
        },
        { status: 400 }
      );
    }
    
    // Get API key from environment
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Gemini API key not configured');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Story generation service is not configured' 
        },
        { status: 500 }
      );
    }
    
    // Create Gemini service instance
    const geminiService = createGeminiService(apiKey, {
      maxRetries: 2,
      timeoutMs: 45000 // 45 seconds for server-side generation
    });
    
    // Generate story
    const story = await geminiService.generateStory(playerProfile);
    
    // Return successful response
    return NextResponse.json({
      success: true,
      data: story
    });
    
  } catch (error) {
    console.error('Story generation error:', error);
    
    // Handle specific Gemini service errors
    if (error instanceof GeminiServiceError) {
      const statusCode = error.code === 'CONFIGURATION_ERROR' ? 500 : 
                        error.code === 'VALIDATION_ERROR' ? 400 : 
                        error.retryable ? 503 : 500;
      
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          retryable: error.retryable
        },
        { status: statusCode }
      );
    }
    
    // Handle unexpected errors
    return NextResponse.json(
      { 
        success: false, 
        error: 'An unexpected error occurred while generating your story' 
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Method not allowed' 
    },
    { status: 405 }
  );
}

// Health check endpoint
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}