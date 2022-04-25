import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
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

  const register = async () => {
	  errMessage.innerHTML = "";
	  
	  if (registerEmail.endsWith('gmail.com'))
	  {
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
  	}
		
	if (auth.currentUser)
	{
		if (!registerEmail.endsWith('gmail.com'))
		{
			errMessage.style.color = "red";
			errMessage.innerHTML = "E-mail address must be @wichita.gov";
		}
		else
		{
			sendEmailVerification(auth.currentUser);
			errMessage.innerHTML = "Verification e-mail has been sent. Verify and then sign-out above. Then use the login page to sign in to redirect to the home page.";
			errMessage.style.color = "green";
			signOut(auth);
		}
	}
  };

  return (
    <div className="App">
      <div>
        <h3>Create Account</h3>
        <input
          placeholder="E-Mail"
          onChange={(event) => {
            setRegisterEmail(event.target.value);
          }}
        />
        <p></p>
        <input
          type={passwordShown ? "text" : "password"}
          placeholder="Password"
          onChange={(event) => {
            setRegisterPassword(event.target.value);
          }}
        />
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
