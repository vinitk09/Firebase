import React, { useEffect, useState } from "react";
import { useFirebase } from "../context/Firebase";
import { Card, Button, Container, Row, Col } from "react-bootstrap";

const TaskCard = ({ title, description, id, onDelete }) => {
  return (
    <Col md={4} className="mb-4">
      <Card>
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>{description}</Card.Text>
          <Button variant="danger" onClick={() => onDelete(id)}>
            Delete
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
};

const HomePage = () => {
  const firebase = useFirebase();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    firebase
      .fetchTasks()
      .then((fetchedTasks) => setTasks(fetchedTasks))
      .catch((error) => setError(error.message));
  }, [firebase]);

  const handleDelete = (taskId) => {
    firebase
      .deleteTask(taskId)
      .then(() =>
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
      )
      .catch((error) => setError(error.message));
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Task Management</h2>
      {error && <p className="text-danger text-center">{error}</p>}
      {tasks.length > 0 ? (
        <Row>
          {tasks.map((task) => (
            <TaskCard key={task.id} {...task} onDelete={handleDelete} />
          ))}
        </Row>
      ) : (
        <p className="text-center">No tasks available.</p>
      )}
    </Container>
  );
};

export default HomePage;
