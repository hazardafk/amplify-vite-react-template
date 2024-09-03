import React, { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Link } from "react-router-dom";

const client = generateClient<Schema>();

function TodoTool({ todos, createTodo, deleteTodo }: { todos: Array<Schema["Todo"]["type"]>, createTodo: () => void, deleteTodo: (id: string) => void }) {
  return (
    <div>
      <h2>Todo Tool</h2>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <TodoItem todo={todo} deleteTodo={deleteTodo} />
        ))}
      </ul>
    </div>
  );
}

type TodoItemProps = {
  todo: {
    content?: string | null;
    readonly id: string;
    readonly createdAt: string;
    readonly updatedAt: string;
  };
  deleteTodo: (id: string) => void;
};

const TodoItem = React.memo(({ todo, deleteTodo }: TodoItemProps) => (
  <li onClick={() => deleteTodo(todo.id)} key={todo.id}>
    {todo.content}
  </li>
));

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [showTodoTool, setShowTodoTool] = useState(false);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  return (
    <Authenticator>
      {({ signOut }) => (
        <main>
          <h1>My App</h1>
          <button onClick={() => setShowTodoTool(true)}>Open Todo Tool</button>
          {showTodoTool && <TodoTool todos={todos} createTodo={createTodo} deleteTodo={deleteTodo} />}

          <div>
            <h2>Navigation</h2>
            <Link to="/about"><button>About Us</button></Link>
            <Link to="/contact"><button>Contact Us</button></Link>
          </div>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
