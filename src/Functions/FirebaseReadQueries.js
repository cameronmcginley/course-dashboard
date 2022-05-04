import {
  collection,
  query,
  limit,
  orderBy,
  startAfter,
  startAt,
  endBefore,
  limitToLast,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase-config";
import { endOfDay, startOfDay } from "date-fns";
import getSortKey from "./getSortKey";

export const FirebaseReadQueries = async (data) => {
  let params = []

  global.config.debug && console.log(
    "Firebase Read",
    // "\nSearch Critera: ",
    // data.searchCriteria,
    "\nType: ",
    data.type
  );

  // global.config.debug && console.log(data)

  // If looking for constants, grab the only doc there
  if (data.type === "constantsFetch") {
    params.push(...[
      collection(db, "constants"),
      limit(1)
    ]);
  }

  if (data.type === "getCourseName") {
    params.push(...[
      collection(db, "courses"),
      where("courseID", "==", data.courseID),
      limit(1)
    ]);
  }

  // Return true/false if course id already exists in database
  if (data.type === "checkCourseID") {
    params.push(...[
      collection(db, "courses"),
      where("courseID", "==", data.courseID),
      limit(1)
    ]);
  }

  //CSV Queries
  if (data.type === "CSV") {
    params.push(...[collection(db, "sign-ins"), orderBy("sortKey"), limit(10)]);

    // If there are courseIDs to search by, push a firebase query for each
    if (
      data.searchCriteria.searchCourseIDList &&
      data.searchCriteria.searchCourseIDList.length != 0
    ) {
      params.push(
        where("courseID", "in", data.searchCriteria.searchCourseIDList)
      );
    }
    if (data.searchCriteria.searchUserID) {
      params.push(
        where(
          "substrUserID",
          "array-contains",
          data.searchCriteria.searchUserID
        )
      );
    }
    if (data.searchCriteria.startDate) {
      // Convert the start and end dates to sortKey format
      // endDate must be set to last second of the day
      const startDateKey = getSortKey(data.searchCriteria.startDate);
      const endDateKey = getSortKey(data.searchCriteria.endDate);

      params.push(where("sortKey", "<=", startDateKey));
      params.push(where("sortKey", ">=", endDateKey));
    }
    if (data.searchCriteria.searchArchived === "archived") {
      params.push(where("isArchived", "==", true));
    }
    if (data.searchCriteria.searchArchived === "unarchived") {
      params.push(where("isArchived", "==", false));
    }

    // return query(...params);
  }

  if (data.type === "DeleteArchivedBeforeDate") {
    global.config.debug && console.log("Data to delete with: ", data);

    params.push(...[
      collection(db, "sign-ins"),
      orderBy("sortKey"),
      limit(10),
      where("isArchived", "==", true),
    ]);

    if (data.searchCriteria.deleteDate) {
      // deleteDate already provided in sortKey format
      params.push(where("sortKey", ">=", data.searchCriteria.deleteDate));
    }

    // return query(...params);
  }

  // Is first page
  if (data.type === "isFirstPage") {
    params.push(...[
      collection(db, data.collectionName),
      orderBy(data.sortKey),
      endBefore(data.firstVisibleDoc),
      limit(1),
    ]);

    // Optional Queries
    if (data.isAttendance) {
      params.push(where("courseID", "==", data.courseID));

      // Gets data more recent than the startDate (midnight of current day)
      let d = new Date();
      d.setHours(0, 0, 0, 0);
      d = getSortKey(d);
      params.push(where("sortKey", "<=", d));
    }
    if (data.searchCriteria.searchUserID) {
      params.push(
        where(
          "substrUserID",
          "array-contains",
          data.searchCriteria.searchUserID
        )
      );
    }
    // Course search for sign-in table
    if (
      data.collectionName === "sign-ins" &&
      data.searchCriteria.searchCourseIDList &&
      data.searchCriteria.searchCourseIDList.length != 0
    ) {
      params.push(
        where("courseID", "in", data.searchCriteria.searchCourseIDList)
      );
    }
    // Course search for course table
    if (
      data.collectionName === "courses" &&
      data.searchCriteria && 
      data.searchCriteria.searchCourseName
    ) {
      params.push(
        where("substrCourseName", "array-contains", data.searchCriteria.searchCourseName),
      );
    }
    if (
      data.collectionName === "courses" &&
      data.searchCriteria && 
      data.searchCriteria.searchCourseID
    ) {
      params.push(
        where("courseID", "==", data.searchCriteria.searchCourseID),
      );
    }
    // More queries
    if (data.searchCriteria.startDate) {
      const startDateKey = getSortKey(data.searchCriteria.startDate);
      const endDateKey = getSortKey(data.searchCriteria.endDate);

      params.push(where("sortKey", "<=", startDateKey));
      params.push(where("sortKey", ">=", endDateKey));
    }
    if (data.searchCriteria.searchArchived === "archived") {
      params.push(where("isArchived", "==", true));
    }
    if (data.searchCriteria.searchArchived === "unarchived") {
      params.push(where("isArchived", "==", false));
    }

    // return query(...params);
  }

  // Is last page
  if (data.type === "isLastPage") {
    params.push(...[
      collection(db, data.collectionName),
      orderBy(data.sortKey),
      startAfter(data.lastVisibleDoc),
      limit(1),
    ]);

    if (data.isAttendance) {
      params.push(where("courseID", "==", data.courseID));

      // Gets data more recent than the startDate (midnight of current day)
      let d = new Date();
      d.setHours(0, 0, 0, 0);
      d = getSortKey(d);
      params.push(where("sortKey", "<=", d));
    }

    // Optional Queries
    if (data.searchCriteria.searchUserID) {
      params.push(
        where(
          "substrUserID",
          "array-contains",
          data.searchCriteria.searchUserID
        )
      );
    }
    // Course search for sign-in table
    if (
      data.collectionName === "sign-ins" &&
      data.searchCriteria.searchCourseIDList &&
      data.searchCriteria.searchCourseIDList.length != 0
    ) {
      params.push(
        where("courseID", "in", data.searchCriteria.searchCourseIDList)
      );
    }
    // Course search for course table
    if (
      data.collectionName === "courses" &&
      data.searchCriteria && 
      data.searchCriteria.searchCourseName
    ) {
      params.push(
        where("substrCourseName", "array-contains", data.searchCriteria.searchCourseName),
      );
    }
    if (
      data.collectionName === "courses" &&
      data.searchCriteria && 
      data.searchCriteria.searchCourseID
    ) {
      params.push(
        where("courseID", "==", data.searchCriteria.searchCourseID),
      );
    }
    //More queries
    if (data.searchCriteria.startDate) {
      const startDateKey = getSortKey(data.searchCriteria.startDate);
      const endDateKey = getSortKey(data.searchCriteria.endDate);

      params.push(where("sortKey", "<=", startDateKey));
      params.push(where("sortKey", ">=", endDateKey));
    }
    if (data.searchCriteria.searchArchived === "archived") {
      params.push(where("isArchived", "==", true));
    }
    if (data.searchCriteria.searchArchived === "unarchived") {
      params.push(where("isArchived", "==", false));
    }

    // return query(...params);
  }

  if (data.type === "attendance-info") {
    params.push(collection(db, "courses"));
    params.push(where("courseID", "==", data.courseID));
    params.push(limit(1));
  }

  // if (data.collectionName === "sign-ins") {
  if (data.type === "sign-ins" || data.type === "attendance") {
    params.push(...[
      collection(db, data.collectionName),
      where("substrUserID", "array-contains", data.searchCriteria.searchUserID),
      orderBy(data.sortKey),
    ]);

    // Type
    if (data.getSigninDataType === "refresh") {
      // params.push(startAt(data.firstVisibleDoc));
      params.push(limit(10));
    }
    if (data.getSigninDataType === "next") {
      params.push(startAfter(data.lastVisibleDoc));
      params.push(limit(10));
    }
    if (data.getSigninDataType === "previous") {
      params.push(endBefore(data.firstVisibleDoc));
      params.push(limitToLast(11));
      // params.push(startAfter(data.lastVisibleDoc));
      // params.push(limit(10));
    }

    // Attendance page sends courseID over props and not searchCriteria
    if (data.type === "attendance") {
      params.push(where("courseID", "==", data.courseID));

      // Gets data more recent than the startDate (midnight of current day)
      let d = new Date();
      d.setHours(0, 0, 0, 0);
      d = getSortKey(d);
      params.push(where("sortKey", "<=", d));
    }
    // Optional Queries
    if (
      data.searchCriteria.searchCourseIDList &&
      data.searchCriteria.searchCourseIDList.length != 0
    ) {
      params.push(
        where("courseID", "in", data.searchCriteria.searchCourseIDList)
      );
    }
    if (data.searchCriteria.startDate) {
      const startDateKey = getSortKey(data.searchCriteria.startDate);
      const endDateKey = getSortKey(data.searchCriteria.endDate);

      params.push(where("sortKey", "<=", startDateKey));
      params.push(where("sortKey", ">=", endDateKey));
    }
    if (data.type === "attendance") {
      const startDateKey = getSortKey(startOfDay(new Date()));
      const endDateKey = getSortKey(endOfDay(new Date()));

      params.push(where("sortKey", "<=", startDateKey));
      params.push(where("sortKey", ">=", endDateKey));
    }
    if (data.searchCriteria.searchArchived === "archived") {
      params.push(where("isArchived", "==", true));
    }
    // searchCriteria empty on default loads without queries, only search for unarchived data
    if (
      !data.searchCriteria.searchArchived ||
      data.searchCriteria.searchArchived === "unarchived"
    ) {
      params.push(where("isArchived", "==", false));
    }

    // return query(...params);
  }

  // if (data.collectionName === "courses") {
  if (data.type === "courses") {
    params.push(...[collection(db, data.collectionName), orderBy(data.sortKey)]);

    // Type
    if (data.getSigninDataType === "refresh") {
      // params.push(startAt(data.firstVisibleDoc));
      params.push(limit(10));
    }
    if (data.getSigninDataType === "next") {
      params.push(startAfter(data.lastVisibleDoc));
      params.push(limit(10));
    }
    if (data.getSigninDataType === "previous") {
      params.push(endBefore(data.firstVisibleDoc));
      params.push(limitToLast(11));
    }

    // Optional queries
    if (
      data.searchCriteria && 
      data.searchCriteria.searchCourseName
    ) {
      params.push(
        where("substrCourseName", "array-contains", data.searchCriteria.searchCourseName),
      );
    }
    if (
      data.searchCriteria && 
      data.searchCriteria.searchCourseID
    ) {
      params.push(
        where("courseID", "==", data.searchCriteria.searchCourseID),
      );
    }
  }
  
  const docSnapshot = await getDocs(query(...params));
  global.config.debug && global.config.debug && console.log("Read returned " + String(docSnapshot.docs.length) + " documents")
  return docSnapshot.docs
};
