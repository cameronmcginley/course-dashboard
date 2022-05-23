# Course Sign-In Dashboard

This website serves as the dashboard for course instructors and administrators to handle QR Codes and sign-in data for courses. Notes for deploying to the web can be found at the bottom.

## Course Tracker

---

The course tracker, found in the courses tab, is a table storing all data related to all courses. Here, an instructor can create a new course and input the desired fields, and a unique QR Code will be generated in the course's "info page". This info page also stores information such as the instructor, agencies, and synopsis.

Courses can be searched either by name, or by ID. It is worth noting that when searching by ID, you must enter the exact course ID for it to pop up.

### Course Adding

Adding new courses can be done via the "Add New Course" button. The user will be given a number of fields to fill in, all of which are optional (but recommended) except for Course Name and ID, which are required. Course IDs must be unique, and an error message will let the user know if this is not the case with their suggested ID. Course IDs can also be automatically obtained when selecting the checkbox, where the ID will be given an incrementing number.

The possible fields when adding a course are:

1.  Course Name (required)
2.  Course ID (required)
3.  Instructor(s)
4.  Sponsor Agency
5.  Instructor Agency
6.  Coordinator
7.  Synopsis

## QR Codes

---

QR Codes are unique to each course, and will never change (regardless of time or date) **unless** a user modifies a course's name and/or ID. This code is what users will scan from the Course Sign-In iOS App to sign into a course.

There are two methods for displaying this code to be scanned: either displaying the code on a screen (from the course's info page), or printing the code onto a paper. A small print icon will be displayed on the courses table, and on the info page, which will generate a report containing the QR code which can be saved as a PDF or printed. Since the code does not change **unless** a user modifies a course's name and/or ID, this paper does not need to be re-printed.

## Course Information Page

---

As mentioned previously, this page holds information for a specific course. This page is opened via the link found in the course table. It is denoted by its web URL, e.g. "/courses/90/attendance" where 90 is the course ID. This is one of the reasons course IDs must be unique.

### Course Editing

Users are able to modify any fields of a course from this page using the "Edit Course" button. The fields available for editing are the same ones mentioned above in the "Course Adding" section. Note: all sign-in data associated with this course will NOT be modified if the course is modified.

### Course Deleting

In addition to editing the values of a course, a course can also be permanently deleted from this info page. Note: all sign-in data associated with this course will NOT be deleted if the course is deleted.

### Signing In

As mentioned in the QR Codes section, this page contains the respective QR Code for this course. A user can scan this via the Course Sign-In iOS App to sign in. Additionally, a user can sign in via the User ID Form to the left of the code. Just enter your ID and hit submit! This is helpful should someone not have their phone available.

### Attendance List

The table at the bottom of this screen simply shows the IDs of everyone who has signed into this course (either via the User ID Form or the iOS app) on the current date.

## Sign In Data Viewer

---

Found in the "view data" tab, this table will present all sign-in data, from all courses. You can search though this table by IDs, course attended, dates, or whether the data has been archived. When searching by dates, you must select a "start" and "end" date to provide a range. Or, you can select from the left side preset date-ranges, such as "last year", "this motnh", etc.

First and last names are not associated in any way with our database, all data is handled by unique user IDs instead.

### Exporting Data

This data can also be exported to a .CSV file, which is an Excel readable text file. This is done through the "Export to CSV" button. The same searches can be performed here, and the desired data will be downloaded.

### Archiving Data

An additional feature when exporting data is "archiving". Should you select this option, all data that was exported (if you continue with the export after selecting the option) will be given a status of "archived". This does not change any data, but is useful in seeing which data has or has not been exported from the database.

### Deleting Data

Deleting data, from the "Delete Archived Data" button, is only performed on already archived data. This is to prevent deletion of data from our database which has not been transferred to systems. Deleting data is done by selecting a date from the prompt, and ALL archived data before and ON this date will be permanently deleted.

## Account & Login System (Removed in this version)

---

### Login Page

When logging into an account, there are a few cases that are checked to make sure the account is valid. The following are all the error cases this web app watches for when attempting to log in:

- The account must be one that has already been registered. If the account does not exist, an error message will display to the screen stating that a user with that email was not found. If this is the case, the user will need to try again with a different email or create a new account with that email address.

- If the user has entered an incorrect password, an error message will be displayed to the screen. The user can try again or click the “reset password” button and enter their email address to be sent a link to reset the password.

- An account must be verified to redirect to the application’s main pages. If the user has not been verified, they will still be loggedin but will not be able to access any of the main pages of the application until they have accepted the email verification.

- An account can be disabled through the firebase website where the application is hosted. If a user tries to login to an account that has been disabled an error message will display to the screen. If this is the case talk to an administrator and see why the account was suspended.

- The entry into the email address text box must be a valid email address and follow the format for an email. This means that it must have an “@” symbol and also include an extension, for example “.gov”. If this criterion is not met, an error message will display to the screen.

When a user has entered a correct email and password combination, they will be redirected to the home page of the application. From here courses can be viewed and created and the data can be viewed, queried, and exported.

### Create Account Page

When creating an account, there are a few restrictions and errors that can occur if not followed. The following are all the possible cases to watch for when registering with a new account:

- The email address can be restricted to a certain extesion, e.g. "gmail.com". If any other email type is entered, there will be an error message displayed to the screen.

- The email address must be one that is not already registered to an account. If an email entered that is already registered to an account, an error message will display to the screen.

- The entry into the email address text box must be a valid email address and follow the format for an email. This means that it must have an “@” symbol and also include an extension, for example “.gov”. If this criterion is not met, an error message will display to the screen.

If a valid email has been entered and a password is set, when then “create account” button is clicked there will be a green message appear on the screen notifying that a verification email has been sent to the given email address. The user must validate their email address to login and redirect to the application’s pages.

### Reset Password Page

When sending an email to reset a password, there are two things that are checked before attempting to send the email. The following are the errors that are checked for:

- The account must be one that has already been registered. If the account does not exist, an error message will display to the screen stating that a user with that email was not found. If this is the case, the user will need to try again with a different email or create a new account with that email address.

- The entry into the email address text box must be a valid email address and follow the format for an email. This means that it must have an “@” symbol and also include an extension, for example “.gov”. If this criterion is not met, an error message will display to the screen.

Once a valid email address has been entered, a green message will appear on the screen saying that the email has been sent to the given address. The user can then go to the given email account and click the link sent to them to reset the password.

## Additional Features

---

### Dark Mode

A moon icon in the upper right will toggle between dark and light designs for the web application.

### Mobile Viewing

This website is readily available on mobile web browsers in addition to its intended use on laptops or desktops. As data tables can be quite large, they are independently scrollable from the webpage. Navigation links and buttons can be found in the upper right hamburger icon.

## Usage and Deployment Notes

---

### Deploying to Live Website

Website URL found in firebase console.

- Custom domains can be purchased there &nbsp;

Requirements

1. Git
   - Install at: https://git-scm.com/downloads
2. Node.js
   - Install at: https://nodejs.org/en/download/
3. Firebase CLI
   - Execute command in Commpand Prompt after installing Node.js:\
     `npm install -g firebase-tools`
   - More Firebase CLI info found at: https://firebase.google.com/docs/cli

Steps

1. Clone the GitHub repository

   - Open "Command Prompt" on Windows
   - Move to the desired folder you would like to put this repository into
     - Can copy a filepath from File Explorer using the command:\
       `cd "<filepath>"`
   - Execute the command:\
     `git clone <url of the github repository>`
   - More detailed steps for cloning can be found here: https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository

2. Move to the newly cloned repository folder on "Command Prompt"
3. Login to Firebase on Commpand Prompt (git bash can have issues with this) using command:\
   `firebase login`
4. Build the React App using the command:\
   `npm run build`
5. Finally, deploy the project using this command:\
   `firebase deploy`
   -- The website will be automatically updated in a few minutes

### Running on Local Server

Follow previous steps, except:

- Firebase CLI is not needed
- Do not execute `firebase login`
- Instead of executing `npm run build`, execute `npm start`
- Do not execute `firebase deploy`
- Website will be available at http://localhost:3000/ by default
