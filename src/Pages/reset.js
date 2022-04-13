import { useState } from "react";
import {
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase-config";
import { Link } from "react-router-dom";

function Reset() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState({});
  
  const sentMessage = document.getElementById("successMessage");

  const resetPass = async () => {
    sendPasswordResetEmail(auth, email).then(() => {
	  sentMessage.innerHTML = "Password reset email sent successfully.";
	  sentMessage.style.color = "green";
	  }).catch(error => {
	    switch (error.code) {
	      case 'auth/user-not-found':
            sentMessage.innerHTML = "User with given e-mail address not found.";
		        sentMessage.style.color = "red";
		    break;
		  case 'auth/invalid-email':
            sentMessage.innerHTML = "E-mail address invalid.";
		        sentMessage.style.color = "red";
            break;
		  default:
	    }
	  });
  };
  
  return (
	<div className="App">

		<div>
			<h3>Password Reset</h3>
			<input placeholder="E-Mail" value={email} onChange={(event) => { setEmail(event.target.value); }} />
			<p></p>
			<button onClick={resetPass}>Send Reset E-Mail</button>
			<p></p>
			<div id="successMessage"></div>
			<p></p>
			<div>
				Don't have an account? <Link to="/register">Register</Link> now.
			</div>
			<div>
				Already have an account? <Link to="/login">Login</Link> now.
			</div>
		</div>
      
	</div>
  );
}

export default Reset;
