import React, { useState } from "react";
import { auth } from "../firebase-config";
import { signOut, onAuthStateChanged } from "firebase/auth";
import "../App.css";
import { Link } from "react-router-dom";
import { Tabs, Tab, IconButton, Typography, Tooltip, Button, Paper, SwipeableDrawer, Box, List, ListItem, Divider, ListItemIcon, ListItemText } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';

function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={(event) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

const Navbar = (props) => {
  const [user, setUser] = useState({});

  

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  const logout = async () => {
    await signOut(auth);
  };

  const isMobile = useMediaQuery('(max-width:768px)')

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
              <Button color="primary" variant="text" href="/" sx={window.location.pathname === "/" && { borderBottom:1 }}>
                Home
              </Button>
              <Button color="primary" variant="text" href="/courses" sx={window.location.pathname === "/courses" && { borderBottom:1 }}>
                Courses
              </Button>
              <Button color="primary" variant="text" href="/viewdata" sx={window.location.pathname === "/viewdata" && { borderBottom:1 }}>
                View Data
              </Button>
              {/* <Tabs>
                <LinkTab label="Home" href="/" />
                <LinkTab label="Courses" href="/courses" />
                <LinkTab label="View Data" href="/viewdata" />
              </Tabs> */}
            </div>

            <div className="nav-account">
              {/* Dark mode button stored here also */}
              {/* https://stackoverflow.com/questions/67030576/i-have-this-error-that-say-cannot-update-a-components-while-rendering-a-differe */}
              <IconButton sx={{ mr: ".5rem" }} onClick={() => props.handleDarkModeChange(!props.isDarkTheme)}>
                <DarkModeIcon />
              </IconButton>

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
