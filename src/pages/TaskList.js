import React, { useEffect, useState } from "react";
import { useFirebase } from "../context/Firebase";

const TaskList = () => {
  const { fetchTasks, deleteTask } = useFirebase();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchAllTasks = async () => {
      const taskList = await fetchTasks();
      setTasks(taskList);
    };

    fetchAllTasks();
  }, [fetchTasks]);

  const handleDelete = async (id) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div>
      <h2>Task List</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
