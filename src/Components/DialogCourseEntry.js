import React from "react";
import FirebaseForm from "./FirebaseForm";

export default function DialogCourseEntry(props) {
  return <FirebaseForm formType="courseEntry" collectionName="courses" />;
}
