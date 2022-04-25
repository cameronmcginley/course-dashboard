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
  const [errMessage, setErrMessage] = useState(null);
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  onAuthStateChanged(auth, (currentUser) => {
	  setUser(currentUser);
	  if (user != null)
	  {
		  if (user.emailVerified)
		  {
			  navigate('/Home');
		  }
		  else if (user.emailVerified == false)
		  {
			  setErrMessage("User account not verified. Will not redirect to the home page until user is verified.");
		  }
	  }
  });

  const login = async () => {
	setErrMessage("");
    signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
    ).then().catch(error => {
	  switch (error.code) {
      case 'auth/user-not-found':
        setErrMessage("User with given e-mail address not found.");
        break;
      case 'auth/user-disabled':
        setErrMessage("The account with that email address has been disabled.");
        break;
      case 'auth/wrong-password':
        setErrMessage("The password given is incorrect.");
        break;
      case 'auth/invalid-email':
        setErrMessage("E-mail address invalid.");
        break;
      default:
	  }
    });
  };

  return (
	<div className="App">

		<div>
			<h3>User Login</h3>
			<input placeholder="E-Mail" onChange={ (event) => { setLoginEmail(event.target.value); } } />
			<p></p>
			<input type={passwordShown ? "text" : "password"} placeholder="Password" onChange={ (event) => { setLoginPassword(event.target.value); } } />
			<p></p>
			<button onClick={togglePassword}>Show Password</button>
			<p></p>
			<button onClick={login}>Login</button>
			<p></p>
			<p style={{ color: "red" }}>
				{errMessage}
			</p>
			<p></p>
			<div>
				Forgot Password? <Link to="/reset">Send Reset Email</Link> now.
			</div>
			<div>
				Don't have an account? <Link to="/register">Register</Link> now.
			</div>
		</div>
      
	</div>
  );
}

export default Login;
