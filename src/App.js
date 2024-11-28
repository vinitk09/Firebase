import React from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./pages/Login";
import AddTask from "./pages/AddTask";
import MyNavbar from "./components/Navbar"; // Import the Navbar component

function App() {
  return (
    <div>
      <MyNavbar /> {/* Add the Navbar here */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/tasks" element={<AddTask />} />
      </Routes>
    </div>
  );
}

export default App;
