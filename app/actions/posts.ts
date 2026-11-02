'use server'

import { and, desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth/server'
import { db } from '@/lib/db'
import { journalPost } from '@/lib/db/schema'

function noteInput(input: { name: string; content: string; image?: string }) {
  const name = input.name.trim()
  const content = input.content.trim()
  const image = (input.image ?? '').trim()
  if (!name || !content) throw new Error('A title and a note are required.')
  if (name.length > 200) throw new Error('Title is too long.')
  if (content.length > 20000) throw new Error('Note is too long.')
  if (image.length > 2000) throw new Error('Image URL is too long.')
  if (image && !/^https?:\/\//i.test(image)) throw new Error('Image must be an http or https URL.')
  return { name, content, image }
}

async function getUserId() {
  const session = await auth.getSession()
  if (!session?.data?.user) throw new Error('You need to sign in to change notes.')
  return session.data.user.id
}

export async function getPosts() {
  return db.select().from(journalPost).orderBy(desc(journalPost.createdAt))
}

export async function createPost(input: { name: string; content: string; image?: string }) {
  const session = await auth.getSession()
  if (!session?.data?.user) throw new Error('You need to sign in to publish a note.')
  const userId = session.data.user.id
  const author = session.data.user.name || session.data.user.email
  const note = noteInput(input)
  const [post] = await db.insert(journalPost).values({ userId, author, ...note }).returning()
  revalidatePath('/')
  return post
}

export async function updatePost(id: string, input: { name: string; content: string; image?: string }) {
  const userId = await getUserId()
  const note = noteInput(input)
  const [post] = await db.update(journalPost).set(note).where(and(eq(journalPost.id, id), eq(journalPost.userId, userId))).returning()
  if (!post) throw new Error('You can only edit your own notes.')
  revalidatePath('/')
  return post
}

export async function deletePost(id: string) {
  const userId = await getUserId()
  const deleted = await db.delete(journalPost).where(and(eq(journalPost.id, id), eq(journalPost.userId, userId))).returning({ id: journalPost.id })
  if (deleted.length === 0) throw new Error('You can only delete your own notes.')
  revalidatePath('/')

}
