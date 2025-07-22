// Fun Assignment, Implement this.

import { Hono } from "hono";
import drizzle from "../db/drizzle.js";
import { students } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import dayjs from "dayjs";

const studentsRouter = new Hono();

studentsRouter.get("/", async (c) => {
  const allStudents = await drizzle.select().from(students);
  return c.json(allStudents);
});

studentsRouter.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const result = await drizzle.query.students.findFirst({
    where: eq(students.id, id)
  });
  if (!result) {
    return c.json({ error: "Student not found" }, 404);
  }
  return c.json(result);
});

studentsRouter.post(
  "/",
  zValidator(
    "json",
    z.object({
      firstname: z.string().min(1),
      lastname: z.string().min(1),
      studentId: z.string().length(8),
      birthDate: z.string().transform((data) => dayjs(data).toDate()),
      sex: z.string().length(1)
    })
  ),
  async (c) => {
    const { firstname, lastname, studentId, birthDate, sex } = c.req.valid("json");
    const result = await drizzle
      .insert(students)
      .values({
        firstname,
        lastname,
        student_id: studentId,
        birthdate: birthDate,
        sex,
      })
      .returning();
    return c.json({ success: true, students: result[0] }, 201);
  }
);

studentsRouter.patch(
  "/:id",
  zValidator(
    "json",
    z.object({
      firstname: z.string().min(1).optional(),
      lastname: z.string().min(1).optional(),
      studentId: z.string().length(8).optional(),
      birthDate: z.string().transform((data) => dayjs(data).toDate()).optional(),
      sex: z.string().length(1).optional()
    })
  ),
  async (c) => {
    const id = Number(c.req.param("id"));
    const { firstname, lastname, studentId, birthDate, sex } = c.req.valid("json");
    
    const updateData: any = {};
    if (firstname !== undefined) updateData.firstname = firstname;
    if (lastname !== undefined) updateData.lastname = lastname;
    if (studentId !== undefined) updateData.student_id = studentId;
    if (birthDate !== undefined) updateData.birthdate = birthDate;
    if (sex !== undefined) updateData.sex = sex;
    
    const updated = await drizzle.update(students).set(updateData).where(eq(students.id, id)).returning();
    if (updated.length === 0) {
      return c.json({ error: "Student not found" }, 404);
    }
    return c.json({ success: true, students: updated[0] });
  }
);

studentsRouter.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const deleted = await drizzle.delete(students).where(eq(students.id, id)).returning();
  if (deleted.length === 0) {
    return c.json({ error: "Student not found" }, 404);
  }
  return c.json({ success: true, students : deleted[0] });
});

export default studentsRouter;
