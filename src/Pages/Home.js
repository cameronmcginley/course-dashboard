import React from "react";
import { useState } from "react";
import { emailVerified } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import "../App.css";
import ReactMarkdown from 'react-markdown'

const markdown = `
# Wichita Police Department - Course Sign In Dashboard
This website serves as the dashboard for course instructors and administrators to handle QR Codes and sign-in data for courses.

## Course Tracker
---
The course tracker, found in the courses tab, is a table storing all data related to all courses. Here, an instructor can create a new course and input the desired fields, and a unique QR Code will be generated in the course's "info page". This info page also stores information such as the instructor, agencies, and synopsis.

Courses can be searched either by name, or by ID. It is worth noting that when searching by ID, you must enter the exact course ID for it to pop up.

### Course Adding
Adding new courses can be done via the "Add New Course" button. The user will be given a number of fields to fill in, all of which are optional (but recommended) except for Course Name and ID, which are required. Course IDs must be unique, and an error message will let the user know if this is not the case with their suggested ID. Course IDs can also be automatically obtained when selecting the checkbox, where the ID will be given an incrementing number.

The possible fields when adding a course are:

 1. Course Name (required)
 2. Course ID (required)
 3. Instructor(s)
 4. Sponsor Agency (defaults to WPD)
 5. Instructor Agency (defaults to WPD)
 6. Coodinator
 7. Synopsis

## QR Codes
---
QR Codes are unique to each course, and will never change (regardless of time or date) **unless** a user modifies a course's name and/or ID. This code is what users will scan from the WPD Course Sign In iOS App to sign into a course. 

There are two methods for displaying this code to be scanned: either displaying the code on a screen (from the course's info page), or printing the code onto a paper. A small print icon will be displayed on the courses table, and on the info page, which will generate a report containing the QR code which can be saved as a PDF or printed. Since the code does not change **unless** a user modifies a course's name and/or ID, this paper does not need to be re-printed.

## Course Information Page
---
As mentioned previously, this page holds information for a specific course. This page is opened via the link found in the course table. It is denoted by its web URL, e.g. "/courses/90/attendance" where 90 is the course ID. This is one of the reasons course IDs must be unique.

### Course Editing
Users are able to modify any fields of a course from this page using the "Edit Course" button. The fields available for editing are the same ones mentioned above in the "Course Adding" section. Note: all sign-in data associated with this course will NOT be modified if the course is modified.

### Course Deleting
In addition to editing the values of a course, a course can also be permanently deleted from this info page. Note: all sign-in data associated with this course will NOT be deleted if the course is deleted.

### Signing In
As mentioned in the QR Codes section, this page contains the respective QR Code for this course. A user can scan this via the WPD Course Sign In iOS App to sign in. Additionally, a user can sign in via the User ID Form to the left of the code. Just enter your ID and hit submit! This is helpful should someone not have their phone available.

### Attendance List
The table at the bottom of this screen simply shows the IDs of everyone who has signed into this course (either via the User ID Form or the iOS app) on the current date.

## Sign In Data Viewer
---
Found in the "view data" tab, this table will present all sign-in data, from all courses. You can search though this table by IDs, course attended, dates, or whether the data has been archived. When searching by dates, you must select a "start" and "end" date to provide a range. Or, you can select from the left side preset date-ranges, such as "last year", "this motnh", etc.

First and last names are not associated in any way with out database, all data is handled by unique user IDs instead.

### Exporting Data
This data can also be exported to a .CSV file, which is an Excel readable text file. This is done through the "Export to CSV" button. The same searches can be performed here, and the desired data will be downloaded.

### Archiving Data
An additional feature when exporting data is "archiving". Should you select this option, all data that was exported (if you continue with the export after selecting the option) will be given a status of "archived". This does not change any data, but is useful in seeing which data has or has not been exported from the database.

### Deleting Data
Deleting data, from the "Delete Archived Data" button, is only performed on already archived data. This is to prevent deletion of data from our database which has not been transferred to WPD systems. Deleting data is done by selecting a date from the prompt, and ALL archived data before and ON this date will be permanently deleted.

## Account & Login System
---
Dean

## Additional Features
---
### Dark Mode
A moon icon in the upper right will toggle between dark and light designs for the web application

### Mobile Viewing
This website is readily available on mobile web browsers in addition to its intended use on laptops or desktops. As data tables can be quite large, they are independently scrollable from the webpage. Navigation links and buttons can be found in the upper right hamburger icon.
`;

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
    <div className="home">
      {/* <h1>Hello</h1> */}
      <ReactMarkdown>
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default Home;
