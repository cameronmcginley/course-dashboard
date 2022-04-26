import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase-config";
import { Link } from "react-router-dom";
import { TextField, Button, Box, Container, Grid } from "@mui/material";

function Reset() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState({});
  const [sentMessage, setSentMessage] = useState(null);
  const [errMessage, setErrMessage] = useState(null);


  const resetPass = async () => {
	setSentMessage("");
	setErrMessage("");
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setSentMessage("Password reset email sent successfully.");
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/user-not-found":
            setErrMessage("User with given e-mail address not found.");
            break;
          case "auth/invalid-email":
            setErrMessage("E-mail address invalid.");
            break;
          default:
        }
      });
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
			<p style={{ color: "green" }}>{sentMessage}</p>
			
			<Box sx={{ mt: 1 }}>
				<h1>Sign in</h1>

				<TextField
				margin="normal"
				required
				fullWidth
				label="Email Address"
				autoFocus
				onInput={(e) => setEmail(e.target.value)}
				/>

				<Button
				onClick={resetPass}
				fullWidth
				variant="contained"
				sx={{ mt: 3, mb: 2 }}
				>
				Send Reset Password Email
				</Button>

				<Grid container>
				<Grid item xs>
					<Link to="/login" variant="body2">
					{"Login Here"}
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
	</>
  );
}

export default Reset;
