import React, { useState } from "react";
import { auth } from "../firebase-config";
import { useNavigate, reload, emailVerified } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import FirebaseForm from "../Components/FirebaseForm";

const Form = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  if (!auth.currentUser)
  {
	  navigate('/login');
  }
  else if (!auth.currentUser.emailVerified)
  {
	  navigate('/login');
  }

  return <FirebaseForm formType="userSignIn" collectionName="sign-ins" />;
};

export default Form;
