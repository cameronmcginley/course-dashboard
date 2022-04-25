import React, { useState } from "react";
import { auth } from "../firebase-config";
import { signOut, onAuthStateChanged } from "firebase/auth";
import "../App.css";
import { Button, Paper } from "@mui/material";

const Navbar = () => {
  const [user, setUser] = useState({});

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <Paper className="navbar" square={true}>
      {/* <h1>Demo Application</h1> */}
      <div className="nav-title">
        <p>
          <b>WPD Course Sign In Dashboard</b>
        </p>
      </div>

      <div className="nav-links">
        <Button color="primary" variant="text" href="/home">
          Home
        </Button>
        <Button color="primary" variant="text" href="/courses">
          Courses
        </Button>
        <Button color="primary" variant="text" href="/viewdata">
          View Data
        </Button>
      </div>

      {auth.currentUser && (
        <div className="nav-account">
          {user?.email}
          <Button
            color="primary"
            sx={{ ml: 2 }}
            variant="contained"
            onClick={logout}
          >
            Sign Out
          </Button>
        </div>
      )}
    </Paper>
  );
};

export default Navbar;
