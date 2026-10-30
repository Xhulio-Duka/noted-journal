import Link from 'next/link'

export default function AboutPage() {
  return <main className="min-h-screen bg-background text-foreground"><div className="mx-auto max-w-3xl px-5 py-16 lg:py-24"><Link href="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to journal</Link><p className="mt-20 text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">About noted</p><h1 className="mt-5 text-5xl font-semibold tracking-[-0.05em]">A calmer place for tech thinking.</h1><div className="mt-8 flex flex-col gap-6 text-lg leading-8 text-muted-foreground"><p>Noticed is an independent community journal for people who build, study, and care about technology.</p><p>We believe the best notes are specific, generous, and useful long after the headline disappears. Share what you&apos;re learning, and leave the internet a little clearer than you found it.</p></div></div></main>
}
