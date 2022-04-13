import React, { Component, useState, useEffect } from "react";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Courses from "./Pages/Courses";
import Form from "./Pages/Form";
import ViewData from "./Pages/ViewData";
import Login from "./Pages/login";
import Register from "./Pages/register";
import Reset from "./Pages/reset";
import Attendance from "./Pages/Attendance";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Redirect,
} from "react-router-dom";
import { auth } from "./firebase-config";
import { signOut, onAuthStateChanged } from "firebase/auth";
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  InputLabel,
  AlertTitle,
  TextField,
  Alert,
  OutlinedInput,
  Button,
  Checkbox,
  Box,
  Paper,
} from "@mui/material";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />

        {/* Pages exist in the content div */}
        <Paper className="content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset" element={<Reset />} />
            <Route path="/home" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/form" element={<Form />} />
            <Route path="/viewdata" element={<ViewData />} />
            <Route
              path="/courses/:pageCourseID/attendance"
              element={<Attendance />}
            />
          </Routes>
        </Paper>
      </div>
    </Router>
  );
}

export default App;
