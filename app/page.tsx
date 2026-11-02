import { cookies } from 'next/headers'
import { auth } from '@/lib/auth/server'
import { getPosts } from '@/app/actions/posts'
import JournalPage from '@/components/journal-page'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const theme = (await cookies()).get('theme')?.value
  const user = await currentUser()
  const savedPosts = await savedJournalPosts()
  const posts = savedPosts.map((post) => ({
    id: post.id,
    name: post.name,
    content: post.content,
    image: post.image,
    author: post.author,
    owned: user?.id === post.userId,
    date: new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  }))

  return (
    <JournalPage
      initialSignedIn={Boolean(user)}
      initialDark={theme === 'dark'}
      currentAuthor={user ? user.name || user.email : 'You'}
      initialPosts={posts}
    />
  )
}

async function currentUser() {
  if (!process.env.NEON_AUTH_BASE_URL) return undefined
  try {
    const { data: session } = await auth.getSession()
    return session?.user
  } catch {
    return undefined
  }
}

async function savedJournalPosts() {
  if (!process.env.DATABASE_URL) return []
  try {
    return await getPosts()
  } catch {
    return []
  }
}
