import * as t from "drizzle-orm/pg-core";

export const students = t.pgTable("students", {
  id: t.serial("id").primaryKey(),
  firstname: t
    .varchar("firstname", { length: 255 })
    .notNull(),
  lastname: t
    .varchar("lastname", { length: 255 })
    .notNull(),
  student_id: t
    .varchar("student_id", { length: 8 })
    .notNull(),
  birthdate: t.timestamp("birthdate").notNull(),
  sex: t
    .varchar("sex", { length: 1 })
    .notNull(),
});
