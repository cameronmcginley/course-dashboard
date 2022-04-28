import React from "react";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Courses from "./Pages/Courses";
import Form from "./Pages/Form";
import ViewData from "./Pages/ViewData";
import Login from "./Pages/login";
import Register from "./Pages/register";
import Reset from "./Pages/reset";
import Attendance from "./Pages/Attendance";
import makeData from "./Functions/makeData";
import "./App.css";
import { auth } from "./firebase-config";
import { useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Paper } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
function App() {
  // For generating test data
  // makeData()
  
  const [user, setUser] = useState({});
  
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  return (
    // <ThemeProvider theme={darkTheme}>
      <Router>
        <div className="App">
          <Navbar />

          {/* Pages exist in the content div */}
          <Paper className="content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset" element={<Reset />} />
              <Route path="/" element={<Home />} />
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
    // </ThemeProvider>
  );
}

export default App;
