import { auth } from '@/lib/auth/server'
import { getPosts } from '@/app/actions/posts'
import JournalPage from '@/components/journal-page'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const { data: session } = await auth.getSession()
  const user = session?.user
  const savedPosts = await getPosts()
  const posts = savedPosts.map((post) => ({
    id: post.id,
    name: post.name,
    content: post.content,
    image: post.image,
    author: post.author,
    owned: user?.id === post.userId,
    date: post.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  }))
  return <JournalPage initialSignedIn={Boolean(user)} currentAuthor={user ? user.name || user.email : 'You'} initialPosts={posts} />
}
