import React, { useState } from "react";
import { auth } from "../firebase-config";
import { signOut, onAuthStateChanged } from "firebase/auth";
import "../App.css";
import { Button, Paper } from "@mui/material";

function debounce(fn, ms) {
  let timer
  return _ => {
    clearTimeout(timer)
    timer = setTimeout(_ => {
      timer = null
      fn.apply(this, arguments)
    }, ms)
  };
}

const Navbar = () => {
  const [user, setUser] = useState({});

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  const logout = async () => {
    await signOut(auth);
  };


  const [dimensions, setDimensions] = React.useState({ 
    height: window.innerHeight,
    width: window.innerWidth
  })

  // Debounce of 1s, only updates page size that often
  React.useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })
    }, 1000)

    // This listens for page size changes
    window.addEventListener('resize', debouncedHandleResize)

    // Must remove the listener, else they stack up and crash the app
    return _ => {
      window.removeEventListener('resize', debouncedHandleResize)
    }
  })

  return (
    <>
      {/* Call the phone-navbar for <768 pixel width */}
      {dimensions.width < 768 &&
        <Paper className="navbar" square={true}>

        </Paper>
      }
      {dimensions.width >= 768 &&
        <Paper className="navbar" square={true}>
          {/* <h1>Demo Application</h1> */}
          <div className="nav-title">
            <p>
              <b>WPD Course Sign In Dashboard</b>
            </p>
          </div>

          <div className="nav-links">
            <Button color="primary" variant="text" href="/">
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
      }
    </>
  );
};

export default Navbar;
