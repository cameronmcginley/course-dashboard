import React, { Component, useState, useEffect } from "react";
import Navbar from './Navbar';
import Home from './Home';
import Courses from './Courses';
import Form from './Form';
import ViewData from './ViewData';
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Redirect
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/courses" element={<Courses/>} />
            <Route path="/form" element={<Form/>} />
            <Route path="/viewdata" element={<ViewData/>} />
          </Routes>
        </div>
      </div> 
    </Router>
  );
}



export default App;