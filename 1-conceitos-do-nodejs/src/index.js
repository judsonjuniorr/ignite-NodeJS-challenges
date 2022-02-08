const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function getTodo(request) {
  return request.user.todos.filter((item) => item.id == request.params.id)[0];
}

function getTodoIndex(request) {
  return request.user.todos.findIndex((item) => item.id == request.params.id);
}

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(400).json({ error: "User Not Found" });
  }

  request.user = user;

  return next();
}

function checksExistsTodo(request, response, next) {
  const isDelete = request.method === "DELETE";
  const todo = isDelete ? getTodoIndex(request) : getTodo(request);

  if ((!todo && !isDelete) || todo === -1)
    return response.status(404).json({ error: "Todo Not Found" });

  request.todo = todo;

  next();
}

app.post("/users", (request, response) => {
  const { username, name } = request.body;

  if (users.some((user) => user.username === username)) {
    return response.status(400).json({ error: "User already exists" });
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(user);

  return response.status(201).json(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  return response.json(request.user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  request.user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put(
  "/todos/:id",
  checksExistsUserAccount,
  checksExistsTodo,
  (request, response) => {
    const { title, deadline } = request.body;

    const { todo } = request;

    todo.title = title;
    todo.deadline = new Date(deadline);

    return response.json(todo);
  }
);

app.patch(
  "/todos/:id/done",
  checksExistsUserAccount,
  checksExistsTodo,
  (request, response) => {
    const { todo } = request;

    todo.done = !todo.done;

    return response.json(todo);
  }
);

app.delete(
  "/todos/:id",
  checksExistsUserAccount,
  checksExistsTodo,
  (request, response) => {
    const { todo: todoIndex } = request;

    request.user.todos.splice(todoIndex, 1);

    return response.status(204).send();
  }
);

module.exports = app;
