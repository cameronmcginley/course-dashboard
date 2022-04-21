import React, { useState } from "react";

import { Button, Box } from "@mui/material";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import {
  startOfYear,
  addYears,
  endOfYear,
  isSameDay,
  endOfDay,
} from "date-fns";
import { Calendar } from "react-date-range";

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
  const [date, setDate] = useState(null);

  return (
    <Box textAlign="center" sx={{ mt: 2, mb: 3 }}>
      {props.isSingleDate ? (
        <>
          <Calendar onChange={(item) => setDate(item)} date={date} />

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
      ) : (
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
            variant="outlined"
            className="dateRangeSelect"
            onClick={() => {
              // Pass the dateRange to parent (DialogDeleteData component)
              props.sendDateRangeUp(dateRange);
            }}
          >
            Select
          </Button>
        </>
      )}
    </Box>
  );
}
