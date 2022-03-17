import React, { Component, useState, useEffect, useRef } from "react";

// Define a custom filter filter function!
export function FilterGreaterThan(rows, id, filterValue) {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
}

export default FilterGreaterThan;
