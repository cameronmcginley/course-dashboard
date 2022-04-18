import React from "react";
import { useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import FirebaseDataTable from "../Components/FirebaseDataTable";
import FirebaseDataTable2 from "../Components/FirebaseDataTable2";
import FirebaseForm from "../Components/FirebaseForm";
import DialogHandler from "../Components/DialogBox/DialogHandler";
import '../App.css'
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  InputLabel,
  AlertTitle,
  TextField,
  Alert,
  OutlinedInput,
  Button,
  Box,
  CircularProgress,
  Paper,
} from "@mui/material";

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
      <FirebaseDataTable2
        type={"courses"}
        accessor={"courses"}
        sortKey={"courseName"}
      />

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
      
    </div>
  );
};

export default Home;
