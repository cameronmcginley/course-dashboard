import { useState } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged, emailVerified, reload } from "firebase/auth";
import { auth } from "../firebase-config";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, Box, Container, Grid } from "@mui/material";

function Login() {
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [user, setUser] = useState({});
  const [passwordShown, setPasswordShown] = useState(false);

  const errMessage = document.getElementById("errorMessage");

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  onAuthStateChanged(auth, () => {
	auth.currentUser.reload();
	if (auth.currentUser.emailVerified)
	{
		navigate('/Home');
	}
	else
	{
		errMessage.innerHTML = "User account not verified. Will not redirect to the home page until user is verified.";
		errMessage.style.color = "red";
	}
  });

  const login = async () => {
	errMessage.innerHTML = "";
    const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
    ).then().catch(error => {
	    switch (error.code) {
			  case 'auth/user-not-found':
          errMessage.innerHTML = "User with given e-mail address not found.";
				  errMessage.style.color = "red";
          break;
		  	case 'auth/user-disabled':
          errMessage.innerHTML = "The account with that email address has been disabled.";
			    errMessage.style.color = "red";
          break;
		  	case 'auth/wrong-password':
          errMessage.innerHTML = "The password given is incorrect.";
				  errMessage.style.color = "red";
          break;
		  	case 'auth/invalid-email':
          errMessage.innerHTML = "E-mail address invalid.";
				  errMessage.style.color = "red";
			    break;
		  	default:
	  	}
    });
  };

  return (
    <Container className="App" maxWidth="xs">
      <Box
        sx={{
          paddingTop: 4,
          paddingBottom: 4,
        }}
      >
        <h1>Sign in</h1>
        <Box component="form" onSubmit={login} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoFocus
            onInput={(e) => setLoginEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type={passwordShown ? "text" : "password"}
            onInput={(e) => setLoginPassword(e.target.value)}
          />
          <Button onClick={togglePassword}>Show Password</Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/reset" variant="body2">
                {"Forgot password"}
              </Link>
            </Grid>
            <Grid item>
              <Link to="/register" variant="body2">
                {"Register account"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
