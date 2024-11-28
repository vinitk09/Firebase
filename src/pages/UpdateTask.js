import React, { useState } from "react";
import { useFirebase } from "../context/FirebaseContext";

const UpdateTask = ({ taskId, currentTitle, currentDescription }) => {
  const { updateTask } = useFirebase();
  const [title, setTitle] = useState(currentTitle);
  const [description, setDescription] = useState(currentDescription);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateTask(taskId, { title, description });
      alert("Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error.message);
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      <h2>Update Task</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <button type="submit">Update Task</button>
    </form>
  );
};

export default UpdateTask;
