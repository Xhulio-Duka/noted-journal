import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const journalPost = pgTable('journal_post', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('userId').notNull(),
  author: text('author').notNull().default('Unknown'),
  name: text('name').notNull(),
  content: text('content').notNull(),
  image: text('image').notNull().default(''),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
})
