import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const DATA_PATH = path.join(process.cwd(), "node_todos.json");

function loadTodos() {
  if (!fs.existsSync(DATA_PATH)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveTodos(todos) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(todos, null, 2));
}

let todos = loadTodos();
let nextId = todos.length ? Math.max(...todos.map((t) => t.id)) + 1 : 1;

app.get("/api/nodeTodos", (req, res) => {
  res.json(todos);
});

app.post("/api/nodeTodos", (req, res) => {
  const title = String(req.body?.title ?? "").trim();
  if (!title) return res.status(400).json({ message: "title is required" });

  const todo = { id: nextId++, title, completed: false };
  todos.push(todo);
  saveTodos(todos);
  res.status(201).json(todo);
});

app.delete("/api/nodeTodos/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1) return res.status(404).json({ message: "not found" });

  todos.splice(idx, 1);
  saveTodos(todos);
  res.status(204).send("");
});


app.listen(3000, () => console.log("Node API listening on http://localhost:3000"));
