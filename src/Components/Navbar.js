import React, { useState } from "react";
import { auth } from "../firebase-config";
import { signOut, onAuthStateChanged } from "firebase/auth";
import "../App.css";
import { Link } from "react-router-dom";
import { Typography, Tooltip, Button, Paper, SwipeableDrawer, Box, List, ListItem, Divider, ListItemIcon, ListItemText } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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




  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem>
          <ListItemText primary={user?.email}/>
        </ListItem>
        <ListItem button>
          <ListItemText primary={"Sign Out"} />
        </ListItem>
        <Divider />
        <ListItem button component={Link} to="/">
          <ListItemText primary={"Home"}/>
        </ListItem>
        <ListItem button component={Link} to="/courses">
          <ListItemText primary={"Courses"} />
        </ListItem>
        <ListItem button component={Link} to="/viewdata">
          <ListItemText primary={"View Data"} />
        </ListItem>
      </List>
    </Box>
  );





  return (
    <>
      {/* Call the phone-navbar for <768 pixel width */}
      {dimensions.width < 768 &&
        <Paper className="navbarphone" square={true}>
          <p>WPD Course Sign In Dashboard</p>
          <Button onClick={toggleDrawer("right", true)}>{"right"}</Button>
          <SwipeableDrawer
            anchor={"right"}
            open={state["right"]}
            onClose={toggleDrawer("right", false)}
            onOpen={toggleDrawer("right", true)}
          >
            {list("right")}
          </SwipeableDrawer>
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
              {/* {user?.email} */}
              {/* Display user email when mouseover accoutn icon */}
              <Tooltip title={<Typography fontSize={'1rem'}>{user?.email}</Typography>}>
                <AccountCircleIcon  />
              </Tooltip>

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
