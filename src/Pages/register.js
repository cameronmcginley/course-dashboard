import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, Box, Container, Grid } from "@mui/material";

function Register() {
  const navigate = useNavigate();
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [user, setUser] = useState({});
  const [errMessage, setErrMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
  
  const register = async () => {
	  setErrMessage("");
	  setSuccessMessage("");
	  
	  if (registerEmail.endsWith('wichita.gov'))
	  {
	  	const user = await createUserWithEmailAndPassword(
	  		auth,
	  		registerEmail,
	  		registerPassword
	  	).then().catch(error => {
		  	switch (error.code) {
		  		case 'auth/email-already-in-use':
					setErrMessage("User with given e-mail address already exists.");
           			break;
			  	case 'auth/invalid-email':
            		setErrMessage("E-mail address invalid.");
					break;
				default:
		  	}
	  	});
  	}
	else
	{
		setErrMessage("E-mail address must be @wichita.gov");
	}
		
	if (auth.currentUser)
	{
		sendEmailVerification(auth.currentUser);
		setSuccessMessage("Verification e-mail has been sent. Please check your email. After verifying, navigate to login page to sign-in.");
		signOut(auth);
	}
  };

  return (
	  <>
	<Container className="App" maxWidth="xs">
		<Box
		sx={{
			paddingTop: 4,
			paddingBottom: 4,
		}}
		>
			<p style={{ color: "red" }}>{errMessage}</p>
			<p style={{ color: "green" }}>{successMessage}</p>
			
			<Box sx={{ mt: 1 }}>
				<h1>Create Admin Account</h1>

				<TextField
				margin="normal"
				required
				fullWidth
				label="Email Address"
				autoFocus
				onInput={(e) => setRegisterEmail(e.target.value)}
				/>

				<TextField
				margin="normal"
				required
				fullWidth
				label="Password"
				type={passwordShown ? "text" : "password"}
				onInput={(e) => setRegisterPassword(e.target.value)}
				/>

				<Button onClick={togglePassword}>Show Password</Button>

				<Button
				onClick={register}
				fullWidth
				variant="contained"
				sx={{ mt: 3, mb: 2 }}
				>
				Create Admin Account
				</Button>

				<Grid container>
				<Grid item xs>
					<Link to="/login" variant="body2">
					{"Login Here"}
					</Link>
				</Grid>
				</Grid>
			</Box>
		</Box>
	</Container>
	</>
  );
}

export default Register;
