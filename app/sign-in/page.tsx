'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth/client'

export default function SignInPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')
    try {
      const result = mode === 'sign-in'
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({ name, email, password })

      if (result.error) {
        setError(result.error.message || 'Unable to authenticate. Check your details and try again.')
        return
      }

      router.push('/')
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to authenticate. Check your details and try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-12 text-foreground">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to noted</Link>
        <div className="mt-10">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Noted journal</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{mode === 'sign-in' ? 'Welcome back.' : 'Create your account.'}</h1>
          <p className="mt-3 text-muted-foreground">Use Neon Auth to publish and manage your notes.</p>
        </div>
        <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
          {mode === 'sign-up' && <input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" className="h-11 rounded-md border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring" />}
          <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" className="h-11 rounded-md border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring" />
          <input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" className="h-11 rounded-md border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring" />
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={pending}>{pending ? 'Working…' : mode === 'sign-in' ? 'Sign in' : 'Create account'}</Button>
        </form>
        <button type="button" onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')} className="mt-5 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
          {mode === 'sign-in' ? 'Need an account? Create one' : 'Already registered? Sign in'}
        </button>
      </div>
    </main>
  )
}
