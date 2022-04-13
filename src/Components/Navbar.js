import React, { Component, useState, useEffect } from "react";
import { auth } from "../firebase-config";
import { signOut, onAuthStateChanged } from "firebase/auth";
import Button from '@mui/material/Button';
import '../App.css'

const Navbar = () => {
  const [user, setUser] = useState({});

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <div className="navbar">

      {/* <h1>Demo Application</h1> */}

      <div className="nav-links">
        <Button color="primary" variant="text" href="/home">Home</Button>
        <Button color="primary" variant="text" href="/courses">Courses</Button>
        <Button color="primary" variant="text" href="/viewdata">View Data</Button>
      </div>

      <div className="nav-account">
        {user?.email}
        <Button color="primary" sx={{ ml: 2 }} variant="contained" onClick={logout}>Sign Out</Button>
      </div>

    </div>
  );
};

export default Navbar;