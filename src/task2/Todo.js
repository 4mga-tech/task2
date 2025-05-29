import React, { useState } from "react";
import "./Todo.css";

function Todo() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAdd = () => {
    if (input.trim() === "") return;

    if (editingIndex !== null) {
      const updated = [...tasks];
      updated[editingIndex] = input;
      setTasks(updated);
      setEditingIndex(null);
    } else {
      setTasks([...tasks, input]);
    }

    setInput("");
  };

  const handleEdit = (index) => {
    setInput(tasks[index]);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  return (
    <div className="todo-container">
      <div className="todo-input">
        <input
          type="text"
          value={input}
          placeholder="Enter task"
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleAdd}>
          {editingIndex !== null ? "Fix" : "Add"}
        </button>
      </div>
      <ul className="todo-list">
        {tasks.map((task, index) => (
          <li key={index} className="todo-item">
            <span>{task}</span>
            <div>
              <button onClick={() => handleEdit(index)}>Fix</button>
              <button onClick={() => handleDelete(index)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
