import React, { useState, useEffect } from 'react';

function App() {
  const [taskDescription, setTaskDescription] = useState('');
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null); // ⭐ Track which todo is being edited

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/todos');
      if (response.ok) {
        const todos = await response.json();
        setTodos(todos);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!taskDescription.trim()) return;

    try {
      const newTodo = {
        taskID: Date.now().toString(), // Unique ID
        taskDescription,
      };

      const response = await fetch('http://localhost:8080/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });

      if (response.ok) {
        setTodos([...todos, newTodo]);
        setTaskDescription('');
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const deleteTodo = async (taskID) => {
    try {
      const response = await fetch(`http://localhost:8080/api/todos/${taskID}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTodos(todos.filter((todo) => todo.taskID !== taskID));
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const startEditing = (todo) => {
    setEditingTodo(todo);
    setTaskDescription(todo.taskDescription);
  };

  const updateTodo = async () => {
    if (!editingTodo) return;

    try {
      const updatedTodo = {
        taskID: editingTodo.taskID,
        taskDescription,
      };

      const response = await fetch(`http://localhost:8080/api/todos/${editingTodo.taskID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodo),
      });

      if (response.ok) {
        fetchTodos();
        setEditingTodo(null);
        setTaskDescription('');
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div className="App">
      <h1>Todo App</h1>
      <form onSubmit={editingTodo ? (e) => { e.preventDefault(); updateTodo(); } : handleAddTodo}>
        <input
          type="text"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder="Enter a todo"
        />
        <button type="submit">{editingTodo ? 'Update Todo' : 'Add Todo'}</button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo.taskID}>
            {todo.taskDescription}
            <button onClick={() => startEditing(todo)}>Edit</button>
            <button onClick={() => deleteTodo(todo.taskID)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
