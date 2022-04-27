import React, { useState } from "react";
import { auth } from "../firebase-config";
import { signOut, onAuthStateChanged } from "firebase/auth";
import "../App.css";
import { Link } from "react-router-dom";
import { Typography, Tooltip, Button, Paper, SwipeableDrawer, Box, List, ListItem, Divider, ListItemIcon, ListItemText } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { useMediaQuery } from 'react-responsive'

const Navbar = () => {
  const [user, setUser] = useState({});

  

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  const logout = async () => {
    await signOut(auth);
  };

  const isMobile = useMediaQuery({ query: '(max-resolution: 768px)'})

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
        <ListItem button onClick={logout}>
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
      {isMobile &&
        <Paper className="navbarphone" square={true}>
          <p><b>WPD Course Sign In Dashboard</b></p>

          {/* Only show the drawer button if signed in */}
          {user && (<>
          <Button onClick={toggleDrawer("right", true)}><MenuIcon/></Button>
          <SwipeableDrawer
            anchor={"right"}
            open={state["right"]}
            onClose={toggleDrawer("right", false)}
            onOpen={toggleDrawer("right", true)}
          >
            {list("right")}
          </SwipeableDrawer>
          </>)}
        </Paper>
      }
      {!isMobile &&
        <Paper className="navbar" square={true}>
          {/* <h1>Demo Application</h1> */}
          <div className="nav-title">
            <p><b>WPD Course Sign In Dashboard</b></p>
          </div>

          {/* Only show nav links and account info if signed in */}
          {user && (<>
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
            </>)}
        </Paper>
      }
    </>
  );
};

export default Navbar;
