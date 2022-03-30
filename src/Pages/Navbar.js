import React, { Component, useState, useEffect } from "react";
import "./Navbar.css";
import { auth } from "../firebase-config";
import { signOut, onAuthStateChanged } from "firebase/auth";

const Navbar = () => {
  const [user, setUser] = useState({});

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="navbar">
      <h4> User Logged In: </h4>
      {user?.email}
      <button onClick={logout}>Sign Out</button>
      <h1>Demo Application</h1>
      <ul>
        <li>
          <a href="/home">Home</a>
        </li>
        <li>
          <a href="/courses">Courses</a>
        </li>
        {/* <li>
          <a href="/form">Form</a>
        </li> */}
        <li>
          <a href="/viewdata">View Data</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
