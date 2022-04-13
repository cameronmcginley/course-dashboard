import React from "react";
import { useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import FirebaseDataTable from "../Components/FirebaseDataTable";
import AlertDialog from "../Components/AlertDialog";
import '../App.css'

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  if (!user) {
    navigate("/login");
  }

  return (
    <div className="tableSplit">
      {/* CSV Export */}
      <AlertDialog type="csvExport"/>

      <AlertDialog type="deleteData"/>
      
      {/* Table with User Signin Data */}
      {/* Headers must be defined in src/Functions/FirebaseDataTable/TableHeaders.js */}
      {/* Collection = name of firebase collection */}
      {/* sortKey = field (from firebase) to sort by */}
      <FirebaseDataTable
        type={"sign-ins"}
        accessor={"sign-ins"}
        sortKey={"sortKey"}
      />
    </div>
  );
};

export default Home;
