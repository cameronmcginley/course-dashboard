import React, { Component, useState, useEffect } from "react";
import Navbar from './Navbar';
import Home from './Home';
import Courses from './Courses';
import Form from './Form';
import ViewData from './ViewData';
import Login from "./login";
import Register from "./register";
import Reset from "./reset";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Redirect
} from "react-router-dom";
import Attendance from "./Attendance";
import { auth } from "./firebase-config";
import { 
	signOut,
	onAuthStateChanged
} from "firebase/auth";

function App() {
  const [user, setUser] = useState({});

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  const logout = async () => {
    await signOut(auth);
  };
  
  return (
    <Router>
      <div className="App">
    		<h4> User Logged In: </h4>
			  {user?.email}
			  <button onClick={logout}>Sign Out</button>
        <Navbar />
        <div className="content">
          <Routes>
	    <Route path="/login" element={<Login/>} />
	    <Route path="/register" element={<Register/>} />
	    <Route path="/reset" element={<Reset/>} />
            <Route path="/home" element={<Home/>} />
            <Route path="/courses" element={<Courses/>} />
            <Route path="/form" element={<Form/>} />
            <Route path="/viewdata" element={<ViewData/>} />
            <Route path="/courses/:pageCourseID/attendance" element={<Attendance/>} />
          </Routes>
        </div>
      </div> 
    </Router>
  );
}



export default App;
