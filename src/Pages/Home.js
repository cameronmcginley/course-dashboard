import React from "react";
import { useState, useEffect } from "react";
import { emailVerified } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import "../App.css";
import ReactMarkdown from "react-markdown";
import readme from "../README.md";

const Home = () => {
  const [mdText, setMdText] = useState("");
  useEffect(() => {
    fetch(readme)
      .then((res) => res.text())
      .then((text) => setMdText(text));
  });

  return (
    <div className="home">
      {/* <h1>Hello</h1> */}
      <ReactMarkdown>{mdText}</ReactMarkdown>
    </div>
  );
};

export default Home;
