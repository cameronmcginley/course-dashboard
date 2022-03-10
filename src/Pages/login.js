import { useState } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
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
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
	  if (user)
	  {
		navigate('/Home');
	  }
      console.log(user);
    } catch (error) {
      console.log(error.message);
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