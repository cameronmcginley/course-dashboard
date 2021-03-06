import React from "react";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Courses from "./Pages/Courses";
import ViewData from "./Pages/ViewData";
import Attendance from "./Pages/Attendance";
import SignIn from "./Pages/SignIn";
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
    global.config.debug && console.log("Writing to localstorage, DarkMode: ", (!isDarkTheme).toString())
    localStorage.setItem("DarkMode", (!isDarkTheme).toString());

    // Toggle dark mode
    setIsDarkTheme(!isDarkTheme)
  }
  
  const [isDarkTheme, setIsDarkTheme] = useState(localStorage.getItem("DarkMode") === "true" ? true : false);

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
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/viewdata" element={<ViewData />} />
              <Route
                path="/courses/:pageCourseID/attendance"
                element={<Attendance />}
              />
              <Route
                path="/courses/:pageCourseID/signin"
                element={<SignIn />}
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
