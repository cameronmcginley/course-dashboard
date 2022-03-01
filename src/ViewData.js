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
    query,
    limit,
    orderBy,
    startAfter,
    startAt,
    endBefore,
    limitToLast
} from "firebase/firestore";

let lastVisibleDoc = null
let firstVisibleDoc = null

const ViewData = () => {
    const [signinData, setSigninData] = useState([]);

    const getSigninData = async (getSigninDataType) => {
        // Collect docs based on type of get
        if (getSigninDataType === "refresh") {
            var data = query(collection(db, "sign-ins"), orderBy("currentTime"), startAt(firstVisibleDoc), limit(25));
        }
        else if (getSigninDataType === "previous") {
            var data = query(collection(db, "sign-ins"), orderBy("currentTime"), endBefore(firstVisibleDoc), limitToLast(26));
        }
        else if (getSigninDataType === "next") {
            var data = query(collection(db, "sign-ins"), orderBy("currentTime"), startAfter(lastVisibleDoc), limit(25));
        }
        // Update page
        const documentSnapshots = await getDocs(data);
        setSigninData(documentSnapshots.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

        // Update first and last documents after updating page
        lastVisibleDoc = documentSnapshots.docs[documentSnapshots.docs.length-1];
        firstVisibleDoc = documentSnapshots.docs[0];

        console.log("First")
        // console.log(firstVisibleDoc._document.data.value.mapValue.fields.currentTime.timestampValue)
        console.log("Last")
        // console.log(lastVisibleDoc._document.data.value.mapValue.fields.currentTime.timestampValue)
    }

    const deleteSignin = async (id) => {
        const signinDoc = doc(db, "sign-ins", id);
        await deleteDoc(signinDoc);
        getSigninData("refresh");
    };

    // const archiveSignin = async (id) => {
    //     const signinDoc = doc(db, "sign-ins", id);
    //     await deleteDoc(signinDoc);
    //     getSigninData();
    // };

    // called for rendering
    useEffect(() => {
        getSigninData("refresh");
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
                    const hasTime = Boolean(signin.currentTime);

                    return (
                        <tr>
                            <th>{signin.userFirstName}</th>

                            <th>{signin.courseID}</th>

                            <th>
                                {hasTime
                                    ? signin.currentTime
                                          .toDate()
                                          .toDateString() +
                                      " " +
                                      signin.currentTime
                                          .toDate()
                                          .toLocaleTimeString("en-US")
                                    : ""}
                            </th>

                            <button
                                class="deletebtn"
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

            <button onClick={() => getSigninData("previous")}>Previous Page</button>
            <button onClick={() => getSigninData("next")}>Next Page</button>

        </div>
    );
};

export default ViewData;
