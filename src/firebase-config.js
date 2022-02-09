import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  ***REMOVED***
  ***REMOVED***
  ***REMOVED***
  ***REMOVED***
  ***REMOVED***
  ***REMOVED***
  measurementId: "G-NTYPZXT9MV"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);