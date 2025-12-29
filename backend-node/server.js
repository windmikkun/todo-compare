import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let nextId = 1;
const todos = [];

app.get("/api/nodeTodos", (req, res) => {
  res.json(todos);
});

app.post("/api/nodeTodos", (req, res) => {
  const title = String(req.body?.title ?? "").trim();
  if (!title) return res.status(400).json({ message: "title is required" });

  const todo = { id: nextId++, title, completed: false };
  todos.push(todo);
  res.status(201).json(todo);
});

app.delete("/api/nodeTodos/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1) return res.status(404).json({ message: "not found" });

  todos.splice(idx, 1);
  res.status(204).send("");
});


app.listen(3000, () => console.log("Node API listening on http://localhost:3000"));
