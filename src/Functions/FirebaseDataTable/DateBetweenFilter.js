import React, { Component, useState, useEffect, useRef } from "react";

// Custom date between filter
export function DateBetweenFilter(rows, id, filterValues) {
  const sd = filterValues[0] ? new Date(filterValues[0]) : undefined;
  const ed = filterValues[1] ? new Date(filterValues[1]) : undefined;

  if (ed || sd) {
    return rows.filter((r) => {
      const cellDate = new Date(r.values[id]);

      if (ed && sd) {
        return cellDate >= sd && cellDate <= ed;
      } else if (sd) {
        return cellDate >= sd;
      } else if (ed) {
        return cellDate <= ed;
      }
    });
  } else {
    return rows;
  }
}

export default DateBetweenFilter;
