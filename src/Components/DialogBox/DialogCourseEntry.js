import React from "react";
import FirebaseForm from "../FirebaseForm";
import '../../App.css'

export default function DialogCourseEntry(props) {
  return <FirebaseForm formType="courseEntry" collectionName="courses" />;
}
