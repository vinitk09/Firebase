import React, { useState, useEffect } from "react";
import { useFirebase } from "../context/Firebase";
import {
  Container,
  Form,
  Button,
  Alert,
  Modal,
  Table,
  Pagination,
} from "react-bootstrap";

const AddTask = () => {
  const firebase = useFirebase();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showTasks, setShowTasks] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5; // Number of tasks per page

  const [editingTask, setEditingTask] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Fetch tasks from Firestore
  const fetchTasks = async () => {
    try {
      const fetchedTasks = await firebase.fetchTasks();
      setTasks(fetchedTasks);
      setFilteredTasks(fetchedTasks); // Initialize filteredTasks with all tasks
    } catch (err) {
      setError(err.message);
    }
  };

  // Add a new task
  const handleAddTask = async () => {
    try {
      await firebase.createTask(title, description);
      setSuccess("Task added successfully!");
      setTitle("");
      setDescription("");
      fetchTasks(); // Refresh task list
    } catch (err) {
      setError(err.message);
      setSuccess(null);
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId) => {
    try {
      await firebase.deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      setSuccess("Task deleted successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  // Start editing a task
  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTitle(task.title);
    setNewDescription(task.description);
  };

  // Save the updated task
  const handleUpdateTask = async () => {
    try {
      await firebase.updateTask(editingTask.id, {
        title: newTitle,
        description: newDescription,
      });
      setEditingTask(null);
      setNewTitle("");
      setNewDescription("");
      fetchTasks(); // Refresh task list
      setSuccess("Task updated successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(term.toLowerCase()) ||
        task.description.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredTasks(filtered);
    setCurrentPage(1); // Reset to the first page on new search
  };

  // Pagination: Calculate tasks for the current page
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Task Management</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form>
        <Form.Group className="mb-3" controlId="taskTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="taskDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <Button
          variant="primary"
          className="w-100 mb-3"
          onClick={handleAddTask}
        >
          Add Task
        </Button>
        <Button
          variant="info"
          className="w-100 mb-3"
          onClick={() => setShowTasks(!showTasks)}
        >
          {showTasks ? "Hide All Tasks" : "List All Tasks"}
        </Button>
      </Form>

      {showTasks && (
        <>
          <Form.Control
            type="text"
            placeholder="Search by title or description"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="mb-3"
          />

          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.map((task, index) => (
                <tr key={task.id}>
                  <td>{indexOfFirstTask + index + 1}</td>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>
                    <Button
                      variant="warning"
                      className="me-2"
                      onClick={() => handleEditTask(task)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-4">
              {[...Array(totalPages).keys()].map((page) => (
                <Pagination.Item
                  key={page + 1}
                  active={page + 1 === currentPage}
                  onClick={() => setCurrentPage(page + 1)}
                >
                  {page + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
};

export default AddTask;
