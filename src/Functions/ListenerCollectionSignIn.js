import React from "react";
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
  Timestamp,
  query,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase-config";

const q = query(collection(db, "sign-ins"), limit(5), orderBy("sortKey"));
onSnapshot(q, (querySnapshot) => {
  const signins = [];
  querySnapshot.forEach((doc) => {
    signins.push(doc.data().name);
  });
  console.log("Current cities in CA: ", signins.join(", "));
});
console.log("g\ng\ng\ng\ng\n")