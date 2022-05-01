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
import { useState, Fragment } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Paper, Box } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const lightTheme = createTheme({
  palette: {
    background: {
      default: "#f6f6f6"
    }
  }
});

function App() {
  // For generating test data
  // makeData()

  const handleDarkModeChange = () => {
    // Write to local storage
    console.log("Writing to localstorage, DarkMode: ", (!isDarkTheme).toString())
    // console.log(localStorage.getItem("DarkMode"))
    localStorage.setItem("DarkMode", (!isDarkTheme).toString());

    // Toggle dark mode
    setIsDarkTheme(!isDarkTheme)
    // console.log(isDarkTheme)
  }
  
  const [isDarkTheme, setIsDarkTheme] = useState(localStorage.getItem("DarkMode") === "true" ? true : false);
  const [user, setUser] = useState({});
  
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  return (
    <Fragment>
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <Box className="App">
          {/* Navbar has dark mode button, call this func when clicked */}
          <Navbar isDarkTheme={isDarkTheme} handleDarkModeChange={handleDarkModeChange} />

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
        </Box>
      </Router>
    </ThemeProvider>
    </Fragment>
  );
}

export default App;
