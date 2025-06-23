import React, { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";
import { Button, Modal, ConfigProvider } from "antd";
import { createStyles, useTheme } from "antd-style";
import "./Todo.css";


const useStyle = createStyles(({ token }) => ({
  'my-modal-body': {
    background: token.blue1,
    padding: token.paddingSM,
  },
  'my-modal-mask': {
    boxShadow: `inset 0 0 15px #fff`,
  },
  'my-modal-header': {
    borderBottom: `1px dotted ${token.colorPrimary}`,
  },
  'my-modal-footer': {
    color: token.colorPrimary,
  },
  'my-modal-content': {
    border: '1px solid #333',
  },
}));

function Todo() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { styles } = useStyle();
  const token = useTheme();

  const classNames = {
    body: styles['my-modal-body'],
    mask: styles['my-modal-mask'],
    header: styles['my-modal-header'],
    footer: styles['my-modal-footer'],
    content: styles['my-modal-content'],
  };

  const modalStyles = {
    header: {
      borderLeft: `5px solid ${token.colorPrimary}`,
      borderRadius: 0,
      paddingInlineStart: 5,
    },
    body: {
      boxShadow: 'inset 0 0 5px #999',
      borderRadius: 5,
    },
    mask: {
      backdropFilter: 'blur(10px)',
    },
    footer: {
      borderTop: '1px solid #333',
    },
    content: {
      boxShadow: '0 0 30px #999',
    },
  };

  useEffect(() => {
    axiosInstance
      .get("/todos?_limit=10", {
        baseURL: "https://jsonplaceholder.typicode.com",
      })
      .then((response) => {
        const todos = response.data.map((todo) => todo.title);
        setTasks(todos);
      })
      .catch((error) => {
        console.error("Error fetching todos:", error);
      });
  }, []);

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
    setIsModalVisible(false);
  };

  const handleEdit = (index) => {
    setInput(tasks[index]);
    setEditingIndex(index);
    setIsModalVisible(true);
  };

  const handleDelete = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  return (
    <div className="todo-container">
      <h2>My Todo List</h2>
      <div className="todo-input">
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          {editingIndex !== null ? "Fix Task" : "Add Task"}
        </Button>
      </div>

      <ul className="todo-list">
        {tasks.map((task, index) => (
          <li key={index} className="todo-item">
            <span>{task}</span>
            <div>
              <Button onClick={() => handleEdit(index)}>Fix</Button>
              <Button danger onClick={() => handleDelete(index)}>Delete</Button>
            </div>
          </li>
        ))}
      </ul>

      <ConfigProvider modal={{ classNames, styles: modalStyles }}>
        <Modal
          title={editingIndex !== null ? "Edit Task" : "Add New Task"}
          open={isModalVisible}
          onOk={handleAdd}
          onCancel={() => {
            setEditingIndex(null);
            setInput("");
            setIsModalVisible(false);
          }}
        >
          <input
            type="text"
            value={input}
            placeholder="Enter task"
            onChange={(e) => setInput(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </Modal>
      </ConfigProvider>
    </div>
  );
}

export default Todo;
