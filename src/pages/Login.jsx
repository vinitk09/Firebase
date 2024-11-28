import React, { useState } from "react";
import { useFirebase } from "../context/Firebase";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const firebase = useFirebase();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleEmailPasswordSignUp = async () => {
    try {
      await firebase.signupUserWithEmailAndPassword(email, password);
      navigate("/tasks"); // Redirect to tasks page
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await firebase.signinWithGoogle();
      navigate("/tasks"); // Redirect to tasks page
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Login / Register</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="primary"
              className="w-100 mb-3"
              onClick={handleEmailPasswordSignUp}
            >
              Register
            </Button>
            <Button
              variant="success"
              className="w-100"
              onClick={handleGoogleSignIn}
            >
              Sign in with Google
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
