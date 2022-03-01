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

    // Get Initial page of docs
    const getSigninData = async () => {
        // console.log(lastVisibleDoc)

        // Page of documents
        const first = query(collection(db, "sign-ins"), orderBy("currentTime"), startAfter(lastVisibleDoc), limit(25));
        const documentSnapshots = await getDocs(first);

        // Get the last visible document
        lastVisibleDoc = documentSnapshots.docs[documentSnapshots.docs.length-1];
        firstVisibleDoc = documentSnapshots.docs[0];

        console.log("First")
        console.log(firstVisibleDoc._document.data.value.mapValue.fields.currentTime.timestampValue)
        console.log("Last")
        console.log(lastVisibleDoc._document.data.value.mapValue.fields.currentTime.timestampValue)

        setSigninData(documentSnapshots.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }

    const getPreviousPage = async () => {
        // console.log(prevPageStart._document.data.value.mapValue.fields.currentTime.timestampValue)

        const next = query(collection(db, "sign-ins"), orderBy("currentTime"), endBefore(firstVisibleDoc), limitToLast(25));
        const documentSnapshots = await getDocs(next);

        lastVisibleDoc = documentSnapshots.docs[documentSnapshots.docs.length-1];
        firstVisibleDoc = documentSnapshots.docs[0];

        console.log("First")
        console.log(firstVisibleDoc._document.data.value.mapValue.fields.currentTime.timestampValue)
        console.log("Last")
        console.log(lastVisibleDoc._document.data.value.mapValue.fields.currentTime.timestampValue)

        setSigninData(documentSnapshots.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    const getNextPage = async () => {
        // console.log(lastVisibleDoc._document.data.value.mapValue.fields.currentTime.timestampValue)

        const next = query(collection(db, "sign-ins"), orderBy("currentTime"), startAfter(lastVisibleDoc), limit(25));
        const documentSnapshots = await getDocs(next);

        lastVisibleDoc = documentSnapshots.docs[documentSnapshots.docs.length-1];
        firstVisibleDoc = documentSnapshots.docs[0];
        
        console.log("First")
        console.log(firstVisibleDoc._document.data.value.mapValue.fields.currentTime.timestampValue)
        console.log("Last")
        console.log(lastVisibleDoc._document.data.value.mapValue.fields.currentTime.timestampValue)

        setSigninData(documentSnapshots.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    const deleteSignin = async (id) => {
        const signinDoc = doc(db, "sign-ins", id);
        await deleteDoc(signinDoc);
        getSigninData();
    };

    // const archiveSignin = async (id) => {
    //     const signinDoc = doc(db, "sign-ins", id);
    //     await deleteDoc(signinDoc);
    //     getSigninData();
    // };

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

            <button onClick={() => getPreviousPage()}>Previous Page</button>
            <button onClick={() => getNextPage()}>Next Page</button>

        </div>
    );
};

export default ViewData;
