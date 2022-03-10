import { useState } from "react";
import {
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import { auth } from "./firebase-config";
import { Link } from "react-router-dom";

function Reset() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState({});
  
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  return (
	<div className="App">

		<div>
			<h3>Password Reset</h3>
			<input placeholder="E-Mail" value={ email } onChange={ (event) => { setEmail(event.target.value); } } />
			<p></p>
			<button onClick={ sendPasswordResetEmail(auth, email) }>Send Reset E-Mail</button>
			<p></p>
			<div>
				Don't have an account? <Link to="/register">Register</Link> now.
			</div>
		</div>
      
	</div>
  );
}

export default Reset;