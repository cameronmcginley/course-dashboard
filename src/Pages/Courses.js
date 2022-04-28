import React from "react";
import { useState } from "react";
import { emailVerified } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import FirebaseDataTable from "../Components/FirebaseDataTable";
// import FirebaseDataTable2 from "../Components/FirebaseDataTable2";
import DialogHandler from "../Components/DialogBox/DialogHandler";
import "../App.css";
import { Box, Container } from "@mui/material";

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
      {/* <FirebaseDataTable2
        type={"courses"}
        accessor={"courses"}
        sortKey={"courseName"}
      /> */}

      {/* Course entry form, contained in popout box */}
      <Box sx={{ mt: 5 }}>
        <DialogHandler type="courseEntry" />
      </Box>

      {/* Table with User Signin Data */}
      {/* Headers must be defined in src/Functions/FirebaseDataTable/TableHeaders.js */}
      {/* Collection = name of firebase collection */}
      {/* sortKey = field (from firebase) to sort by */}
      {/* <FirebaseDataTable
        type={"courses"}
        accessor={"courses"}
        sortKey={"courseName"}
      /> */}

      <FirebaseDataTable
        type={"courses"}
        accessor={"courses"}
        sortKey={"courseName"}
        dataType={"courses"}
        dataTypeHeader={"courses-header"}
        tableTitle={"Course Information"}
      />
    </div>
  );
};

export default Home;
