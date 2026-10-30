'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Edit3, ImagePlus, LogIn, Menu, Moon, PenLine, Search, Sun, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth/client'
import { createPost, deletePost as deleteSavedPost, updatePost } from '@/app/actions/posts'

type Post = { id: number | string; name: string; content: string; image: string; author: string; date: string; owned?: boolean }

const defaultPosts: Post[] = [
  { id: 1, name: 'The quiet revolution in edge computing', content: 'Edge infrastructure is moving from an optimization to a first principle. The next generation of products will feel instant because they are built closer to the people using them.', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85', author: 'Maya Chen', date: 'Oct 28, 2026' },
  { id: 2, name: 'Why small models are having a big moment', content: 'The most useful model is often the one that can run beside your product. Smaller, faster systems are opening a new chapter for private and responsive software.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85', author: 'Jon Bell', date: 'Oct 22, 2026' },
  { id: 3, name: 'A field guide to thoughtful tooling', content: 'Tools should reduce cognitive load, not add to it. Here are a few principles we use when turning complicated workflows into calm, focused experiences.', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85', author: 'Maya Chen', date: 'Oct 14, 2026' },
]

export default function JournalPage({ initialSignedIn, currentAuthor, initialPosts = [] }: { initialSignedIn: boolean; currentAuthor: string; initialPosts?: Post[] }) {
  const [posts, setPosts] = useState([...initialPosts, ...defaultPosts])
  const [selected, setSelected] = useState<Post | null>(null)
  const [isEditorOpen, setEditorOpen] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(initialSignedIn)
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState({ name: '', content: '', image: '' })
  const [darkMode, setDarkMode] = useState(false)
  const [themeReady, setThemeReady] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const visiblePosts = useMemo(() => posts.filter((post) => `${post.name} ${post.content}`.toLowerCase().includes(query.toLowerCase())), [posts, query])

  useEffect(() => {
    const savedTheme = document.cookie.match(/(?:^|; )theme=(dark|light)/)?.[1]
    const nextTheme = savedTheme ? savedTheme === 'dark' : document.documentElement.classList.contains('dark')
    setDarkMode(nextTheme)
    setThemeReady(true)
  }, [])

  useEffect(() => {
    if (!themeReady) return
    document.documentElement.classList.toggle('dark', darkMode)
    document.documentElement.classList.toggle('light', !darkMode)
    document.cookie = `theme=${darkMode ? 'dark' : 'light'}; path=/; max-age=31536000; SameSite=Lax`
  }, [darkMode, themeReady])

  const shownDarkMode = themeReady && darkMode

  function openEditor(post?: Post) {
    if (!isSignedIn) {
      window.location.href = '/sign-in'
      return
    }
    setDraft(post ? { name: post.name, content: post.content, image: post.image } : { name: '', content: '', image: '' })
    setSelected(post ?? null); setEditorOpen(true)
  }

  async function savePost() {
    if (!draft.name.trim() || !draft.content.trim()) return
    if (selected && typeof selected.id === 'string') {
      const saved = await updatePost(selected.id, draft)
      setPosts(posts.map((post) => post.id === selected.id ? { ...post, ...draft, date: new Date(saved.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) } : post))
    } else if (!selected) {
      const saved = await createPost(draft)
      setPosts([{ id: saved.id, ...draft, author: currentAuthor, owned: true, date: new Date(saved.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }, ...posts])
    } else {
      setPosts(posts.map((post) => post.id === selected.id ? { ...post, ...draft } : post))
    }
    setEditorOpen(false); setSelected(null); setDraft({ name: '', content: '', image: '' })
  }

  async function deletePost(id: number | string) {
    if (typeof id === 'string') await deleteSavedPost(id)
    setPosts(posts.filter((post) => post.id !== id)); setSelected(null)
  }

  async function handleSignOut() {
    await authClient.signOut()
    setIsSignedIn(false)
  }

  return <div className="min-h-screen bg-background text-foreground">
    <header className="sticky top-0 z-10 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
        <div className="flex min-h-16 items-center justify-between gap-3 py-3">
          <Link href="/" className="flex shrink-0 items-center gap-3 font-semibold tracking-tight"><span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">n</span><span>noted</span></Link>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex"><Link href="/" className="text-foreground">Journal</Link><Link href="/about" className="hover:text-foreground">About</Link></nav>
          <div className="flex min-w-0 items-center gap-1 sm:gap-2"><Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)} aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}>{darkMode ? <Sun /> : <Moon />}</Button>{isSignedIn ? <Button variant="ghost" size="sm" onClick={handleSignOut}>Sign out</Button> : <Link href="/sign-in" className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground sm:px-3"><LogIn data-icon="inline-start" /><span className="hidden sm:inline">Sign in</span></Link>}<Button size="sm" className="shrink-0 px-2 sm:px-3" onClick={() => openEditor()} aria-label="Write"><PenLine data-icon="inline-start" /><span className="hidden sm:inline">Write</span></Button><Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenuOpen}><span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>{mobileMenuOpen ? <X /> : <Menu />}</Button></div>
        </div>
        {mobileMenuOpen && <nav className="flex flex-col gap-1 border-t border-border py-3 text-sm text-muted-foreground md:hidden"><Link href="/" onClick={() => setMobileMenuOpen(false)} className="rounded-md px-3 py-2 hover:bg-accent hover:text-foreground">Journal</Link><Link href="/about" onClick={() => setMobileMenuOpen(false)} className="rounded-md px-3 py-2 hover:bg-accent hover:text-foreground">About</Link></nav>}
      </div>
    </header>
    <main>
      <section className="mx-auto max-w-6xl px-5 pb-14 pt-20 lg:px-8 lg:pt-28"><div className="max-w-3xl"><p className="mb-5 text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">A community tech journal</p><h1 className="text-5xl font-semibold tracking-[-0.05em] md:text-7xl">Ideas worth <span className="text-muted-foreground">passing on.</span></h1><p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">Noticed is a home for clear, considered notes about the technology shaping our days.</p></div><div className="mt-14 flex flex-col justify-between gap-5 border-t border-border pt-5 sm:flex-row sm:items-center"><div className="flex items-center gap-2 text-sm text-muted-foreground"><span className="size-2 rounded-full bg-emerald-500" /> {posts.length} notes in the journal</div><div className="relative w-full sm:w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the journal" className="h-10 w-full rounded-md border border-border bg-muted/30 pl-10 pr-3 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring" /></div></div></section>
      <section className="mx-auto grid max-w-6xl gap-6 px-5 pb-24 md:grid-cols-2 lg:grid-cols-3 lg:px-8">{visiblePosts.map((post, index) => <article key={post.id} className={`group flex flex-col overflow-hidden rounded-xl border border-border bg-card ${index === 0 ? 'md:col-span-2 lg:col-span-2' : ''}`}><button className="text-left" onClick={() => setSelected(post)}><div className={`overflow-hidden bg-muted ${index === 0 ? 'aspect-[2/1]' : 'aspect-[1.45/1]'}`}><img src={post.image} alt="" className="size-full object-cover transition duration-500 group-hover:scale-105" /></div><div className="p-6"><div className="mb-8 flex items-center justify-between text-xs text-muted-foreground"><span>{post.date}</span><span>By {post.author}</span></div><h2 className="text-2xl font-medium tracking-tight group-hover:underline">{post.name}</h2><p className="mt-3 line-clamp-2 leading-7 text-muted-foreground">{post.content}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">Read note <ArrowRight data-icon="inline-end" /></span></div></button>{isSignedIn && post.owned && <div className="flex gap-2 border-t border-border px-6 py-3"><Button variant="ghost" size="sm" onClick={() => openEditor(post)}><Edit3 data-icon="inline-start" /> Edit</Button><Button variant="ghost" size="sm" onClick={() => deletePost(post.id)}><Trash2 data-icon="inline-start" /> Delete</Button></div>}</article>)}</section>
    </main>
    {selected && !isEditorOpen && <div className="fixed inset-0 z-20 flex items-center justify-center bg-background/80 p-5 backdrop-blur-sm" onClick={() => setSelected(null)}><article className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-xl border border-border bg-card shadow-2xl" onClick={(e) => e.stopPropagation()}><div className="relative aspect-video"><img src={selected.image} alt="" className="size-full object-cover" /><Button variant="secondary" size="icon" className="absolute right-4 top-4" onClick={() => setSelected(null)} aria-label="Close"><X /></Button></div><div className="p-7"><p className="text-sm text-muted-foreground">{selected.date} · {selected.author}</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">{selected.name}</h2><p className="mt-5 whitespace-pre-wrap text-lg leading-8 text-muted-foreground">{selected.content}</p></div></article></div>}
    {isEditorOpen && <div className="fixed inset-0 z-20 flex items-center justify-center bg-background/80 p-5 backdrop-blur-sm"><div className="w-full max-w-xl rounded-xl border border-border bg-card p-7 shadow-2xl"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">{selected ? 'Edit note' : 'New note'}</p><h2 className="text-2xl font-semibold">Share an idea</h2></div><Button variant="ghost" size="icon" onClick={() => setEditorOpen(false)} aria-label="Close"><X /></Button></div><div className="mt-6 flex flex-col gap-4"><input autoFocus value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Title" className="h-11 rounded-md border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring" /><textarea value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} placeholder="What are you noticing?" rows={6} className="rounded-md border border-border bg-background p-3 outline-none focus:ring-2 focus:ring-ring" /><input value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} placeholder="Image URL (optional)" className="h-11 rounded-md border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring" /><p className="text-xs text-muted-foreground"><ImagePlus className="mr-1 inline-block" /> Add an image URL from your favorite source.</p><Button onClick={savePost}>Publish note</Button></div></div></div>}
    <footer className="border-t border-border"><div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8"><p>© 2026 noted journal</p><div className="flex gap-5"><Link href="/about" className="hover:text-foreground">About</Link></div></div></footer>
  </div>
}
