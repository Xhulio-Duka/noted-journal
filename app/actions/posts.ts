'use server'

import { and, desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth/server'
import { db } from '@/lib/db'
import { journalPost } from '@/lib/db/schema'

async function getUserId() {
  const session = await auth.getSession()
  if (!session?.data?.user) throw new Error('Unauthorized')
  return session.data.user.id
}

export async function getPosts() {
  return db.select().from(journalPost).orderBy(desc(journalPost.createdAt))
}

export async function createPost(input: { name: string; content: string; image?: string }) {
  const session = await auth.getSession()
  if (!session?.data?.user) throw new Error('Unauthorized')
  const userId = session.data.user.id
  const author = session.data.user.name || session.data.user.email
  const [post] = await db.insert(journalPost).values({ userId, author, name: input.name, content: input.content, image: input.image ?? '' }).returning()
  return post
}

export async function updatePost(id: string, input: { name: string; content: string; image?: string }) {
  const userId = await getUserId()
  const [post] = await db.update(journalPost).set({ name: input.name, content: input.content, image: input.image ?? '' }).where(and(eq(journalPost.id, id), eq(journalPost.userId, userId))).returning()
  if (!post) throw new Error('Unauthorized')
  revalidatePath('/')
  return post
}

export async function deletePost(id: string) {
  const userId = await getUserId()
  await db.delete(journalPost).where(and(eq(journalPost.id, id), eq(journalPost.userId, userId)))
  revalidatePath('/')

}
