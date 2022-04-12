import { useState } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase-config";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [user, setUser] = useState({});
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  const login = async () => {
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
	
	if (user)
	{
	  navigate('/home');
	}
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
			<div id="errorMessage"></div>
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
