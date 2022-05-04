import React from "react";
import { useState } from "react";
import { emailVerified} from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import FirebaseDataTable from "../Components/FirebaseDataTable";
import DialogHandler from "../Components/DialogBox/DialogHandler";
import "../App.css";
import { Box } from "@mui/material";

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
    <div className="tableSplit">
      {/* CSV Export */}
      <Box sx={{ mt: 5 }}>
        <DialogHandler type="csvExport" DialogTitle="Export Sign In Data to CSV"/>
      </Box>

      <DialogHandler type="deleteData" DialogTitle="Delete Data"/>

      {/* Table with User Signin Data */}
      {/* Headers must be defined in src/Functions/FirebaseDataTable/TableHeaders.js */}
      {/* Collection = name of firebase collection */}
      {/* sortKey = field (from firebase) to sort by */}
      {/* <FirebaseDataTable
        type={"sign-ins"}
        accessor={"sign-ins"}
        sortKey={"sortKey"}
      /> */}

    <FirebaseDataTable
        type={"sign-ins"}
        accessor={"sign-ins"}
        sortKey={"sortKey"}
        dataType={"sign-ins"}
        dataTypeHeader={"sign-ins-header"}
        tableTitle={"Sign In Data"}
      />


    </div>
  );
};

export default Home;
