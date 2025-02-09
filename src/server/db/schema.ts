// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const posts = sqliteTable(
  "posts",
  {
    id: int({ mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text({ length: 256 }),
    createdAt: int({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int({ mode: "timestamp" }).$onUpdate(() => new Date()),
  },
  (post) => [index("name_index").on(post.name)],
);
