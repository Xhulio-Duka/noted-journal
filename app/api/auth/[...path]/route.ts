import { auth } from '@/lib/auth/server'
import { NextRequest, NextResponse } from 'next/server'

const handlers = auth.handler()

function withAuthConfig(handler: (request: NextRequest, context: { params: Promise<{ path: string[] }> }) => Promise<Response>) {
  return async (request: NextRequest, context: { params: Promise<{ path: string[] }> }) => {
    if (!process.env.NEON_AUTH_BASE_URL) {
      return NextResponse.json(
        { message: 'Sign-in is unavailable until Neon Auth is configured.', code: 'AUTH_NOT_CONFIGURED' },
        { status: 503 },
      )
    }
    return handler(request, context)
  }
}

export const GET = withAuthConfig(handlers.GET)
export const POST = withAuthConfig(handlers.POST)
export const PUT = withAuthConfig(handlers.PUT)
export const DELETE = withAuthConfig(handlers.DELETE)
export const PATCH = withAuthConfig(handlers.PATCH)
