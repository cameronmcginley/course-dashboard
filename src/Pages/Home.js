import React from "react";
import { useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-config";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({});

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });
  
  if (!user) {
	  navigate('/login')
  }
  
  return (
    <div className="home">
        <h1>Hello</h1>
    </div>
  );
}
 
export default Home;
