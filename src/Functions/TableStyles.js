import React, { Fragment } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import styled from "styled-components";

// Dependencies for data
import moment from "moment";
import QRCode from "../Components/QRCode";
import PrintQRReport from "../Components/PrintQRReport";
import { IconButton, Box } from "@mui/material";

// Must create header data for each type of table used
const TableStyles = (style) => {
  if (style === "default") {
    // return ({ gridRow: '1 / 8', m: "1rem", width: "95%",})
    return ({ gridRow: '1 / 8', width: "100%" })
  }

  if (style === "attendance") {
    return ({ maxWidth: "25%",})
  }
  
 
};

export default TableStyles;
