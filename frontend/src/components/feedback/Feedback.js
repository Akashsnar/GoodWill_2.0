//Feedback.js
import React from "react";
import FeedbackForm from "./FeedbackForm";
import "./Feedback.css";
import Navbar from "../navbar/Navbar";
const Feedback = () => {
  return (
    <>
      <Navbar />
      <div className="mainFeedback bodyFeedback">
      <FeedbackForm />
      </div>
    </>
  );
}
export default Feedback;