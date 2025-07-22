import { Hono } from "hono";
// import booksRouter from "./books.js";
import studentsRouter from "./students.js";
import { bearerAuth } from "hono/bearer-auth";
import { env } from "hono/adapter";

const apiRouter = new Hono();

apiRouter.get("/", (c) => {
  return c.json({ message: "Book Store API" });
});

apiRouter.use(
  "*",
  bearerAuth({
    verifyToken: async (token, c) => {
      const { API_SECRET } = env<{ API_SECRET: string }>(c);
      return token === API_SECRET;
    },
  })
);

// apiRouter.route("/books", booksRouter);
apiRouter.route("/students", studentsRouter);

export default apiRouter;
