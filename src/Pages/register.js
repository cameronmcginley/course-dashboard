import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase-config";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [user, setUser] = useState({});
  const [passwordShown, setPasswordShown] = useState(false);
  
  const errMessage = document.getElementById("errorMessage");

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

 const register = async () => {
      const user = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      ).then().catch(error => {
	    switch (error.code) {
	      case 'auth/email-already-in-use':
                    errMessage.innerHTML = "User with given e-mail address already exists.";
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

  const logout = async () => {
    await signOut(auth);
  };
  
  return (
	<div className="App">

		<div>
			<h3>Create Account</h3>
			<input placeholder="E-Mail" onChange={ (event) => { setRegisterEmail(event.target.value); } } />
			<p></p>
			<input type={passwordShown ? "text" : "password"} placeholder="Password" onChange={ (event) => { setRegisterPassword(event.target.value); } } />
			<p></p>
			<button onClick={togglePassword}>Show Password</button>
			<p></p>
			<button onClick={register}>Create Account</button>
			<p></p>
			<div id="errorMessage"></div>
			<p></p>
			<div>
				Already have an account? <Link to="/login">Login</Link> now.
			</div>
		</div>
      
	</div>
  );
}

export default Register;
