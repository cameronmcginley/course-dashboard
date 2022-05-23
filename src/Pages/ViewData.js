import React from "react";
import { useState } from "react";
import { emailVerified } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import FirebaseDataTable from "../Components/FirebaseDataTable";
import DialogHandler from "../Components/DialogBox/DialogHandler";
import "../App.css";
import { Box } from "@mui/material";

const Home = () => {
  return (
    <div className="tableSplit">
      {/* CSV Export */}
      <Box sx={{ mt: 5 }}>
        <DialogHandler
          type="csvExport"
          DialogTitle="Export Sign In Data to CSV"
        />
      </Box>

      <DialogHandler type="deleteData" DialogTitle="Delete Data" />

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
