import React, { Component, useState, useEffect } from "react";
import "./ViewData.css";
import { db } from "./firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  FieldValue,
} from "firebase/firestore";

const ViewData = () => {
    const [signinData, setSigninData] = useState([]);
    const signinDataCollectionRef = collection(db, "sign-ins");

    const getSigninData = async () => {
        const data = await getDocs(signinDataCollectionRef);
        setSigninData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    const deleteSignin = async (id) => {
        const courseDoc = doc(db, "courses", id);
        await deleteDoc(courseDoc);
        getSigninData();
    };
    
    // called for rendering
    useEffect(() => {
        getSigninData();
    }, []);
    
    return (
        <div className="App">
            <table>
            <tr>
                <th>First Name</th>
                <th>Course ID</th>
                <th>Time Logged</th>
            </tr>

            {/* Adds each course as a row in the table */}
            {signinData.map((signin) => {
                // toDate() errors if there is no time saved
                const hasTime = Boolean(signin.currentTime)

                return (
                <tr>
                    <th>{signin.userFirstName}</th>
                    <th>{signin.courseID}</th>
                    <th>{hasTime ? (signin.currentTime.toDate().toDateString() + " " 
                    + signin.currentTime.toDate().toLocaleTimeString('en-US') ) : ("")}</th>
                    <button class="deletebtn"
                    onClick={() => {
                        deleteSignin(signin.id);
                    }}
                    >
                    Delete
                    </button>
                </tr>
                );
            })}
            </table>

        </div>  
    );
}



export default ViewData;