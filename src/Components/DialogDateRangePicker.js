import React, { Component, useEffect, useState } from "react";
import { CSVLink } from "react-csv";

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  FieldValue,
  query,
  limit,
  orderBy,
  startAfter,
  startAt,
  endBefore,
  limitToLast,
  setState,
  where,
} from "firebase/firestore";
import { db } from "../firebase-config";
import moment from "moment";
import { FirebaseReadQueries } from "../Functions/FirebaseReadQueries";
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
} from "@mui/material";
import FirebaseDataTableSearch from "./FirebaseDataTableSearch";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import {
  subDays,
  startOfYear,
  addYears,
  endOfYear,
  isSameDay,
  endOfDay,
} from "date-fns";
import AlertDialog from './AlertDialog';
import { Calendar } from 'react-date-range';

export default function DialogDateRangePicker(props) {
  // For date range picker
  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);

  // For single date picker
  const [date, setDate] = useState(null)

  return (
    <div>
      {props.isSingleDate
      ?
      <>
        <Calendar onChange={item => setDate(item)} date={date} />

        <Button
          className="dateRangeSelect"
          onClick={() => {
            // Pass the dateRange to parent (DialogDeleteData component)
            props.sendDateRangeUp(date);
          }}
        >
          Select
        </Button>
      </>
      :
      <>
        <DateRangePicker
          onChange={(item) => setDateRange([item.selection])}
          showSelectionPreview={true}
          moveRangeOnFirstSelection={false}
          months={1}
          ranges={dateRange}
          direction="horizontal"
          staticRanges={[
            ...defaultStaticRanges,
            {
              label: "This Year",
              range: () => ({
                startDate: startOfYear(new Date()),
                endDate: endOfDay(new Date()),
              }),
              isSelected(range) {
                const definedRange = this.range();
                return (
                  isSameDay(range.startDate, definedRange.startDate) &&
                  isSameDay(range.endDate, definedRange.endDate)
                );
              },
            },
            {
              label: "Last Year",
              range: () => ({
                startDate: startOfYear(addYears(new Date(), -1)),
                endDate: endOfYear(addYears(new Date(), -1)),
              }),
              isSelected(range) {
                const definedRange = this.range();
                return (
                  isSameDay(range.startDate, definedRange.startDate) &&
                  isSameDay(range.endDate, definedRange.endDate)
                );
              },
            },
          ]}
        />

        <Button
          className="dateRangeSelect"
          onClick={() => {
            // Pass the dateRange to parent (DialogDeleteData component)
            props.sendDateRangeUp(dateRange);
          }}
        >
          Select
        </Button>
      </>
      }
    </div>
  );
}
