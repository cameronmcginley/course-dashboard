import React from "react";
import { useState } from "react";
import { emailVerified } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Home = () => {
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

  return (
    <div className="home">
      <h1>Hello</h1>
    </div>
  );
};

export default Home;
