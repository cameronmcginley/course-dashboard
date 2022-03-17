import React, { Component, useState, useEffect } from "react";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import FirebaseForm from "../Components/FirebaseForm";

const Form = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  if (!user) {
    navigate("/login");
  }

  return <FirebaseForm formType="userSignIn" collectionName="sign-ins" />;
};

export default Form;
