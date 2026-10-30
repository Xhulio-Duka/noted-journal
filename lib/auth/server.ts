import { createNeonAuth } from '@neon/auth/next/server'

function origin(value?: string) {
  if (!value) return undefined
  return value.startsWith('http://') || value.startsWith('https://') ? value : `https://${value}`
}

const trustedOrigins = [
  'http://localhost:3000',
  'https://tech-blog-app-development-b6.vercel.app',
  origin(process.env.VERCEL_URL),
  origin(process.env.VERCEL_PROJECT_PRODUCTION_URL),
  origin(process.env.V0_RUNTIME_URL),
  origin(process.env.V0_DEV_APP_URL),
  origin(process.env.V0_BUILD_URL),
  origin(process.env.V0_SANDBOX_URL),
].filter((value): value is string => Boolean(value))

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  trustedOrigins,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET || 'v0-development-cookie-secret-change-me',
  },
})
