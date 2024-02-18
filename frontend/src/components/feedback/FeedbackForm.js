// FeedbackForm.js
import React, { useState } from "react";
import FeedbackInput from "./FeedbackInput";
import FeedbackRadioButtons from "./FeedbackRadioButtons";
import FeedbackRating from "./FeedbackRating";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    choice: "",
    "first-time": "",
    rating: 0,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const jsonData = JSON.stringify(formData);
    console.log(jsonData);
  };

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <form className="feedbackForm" onSubmit={handleSubmit}>
      <header>
        <h1 className="feedbackHeader">Feedback Form</h1>
      </header>
      <FeedbackInput
        label="Name"
        type="text"
        name="name"
        onChange={(value) => handleInputChange("name", value)}
      />
      <FeedbackInput
        label="Email"
        type="text"
        name="email"
        onChange={(value) => handleInputChange("email", value)}
      />

      <FeedbackRadioButtons className="feedbackRadioButtons"
        legend="Did you find what you needed?"
        options={["Yes, all of it", "Yes, some of it", "No, none of it"]}
        name="choice"
        onChange={(value) => handleInputChange("choice", value)}
      />

      <FeedbackRadioButtons
        legend="Is this the first time you have visited the website?"
        options={["Yes", "No"]}
        name="first-time"
        onChange={(value) => handleInputChange("first-time", value)}
      />

      <FeedbackRating
        title="Our Website"
        onChange={(value) => handleInputChange("rating", value)}
      />

      <div>
        <center>
          <button id="submit-button" type="submit">
            Submit
          </button>
        </center>
      </div>
    </form>
  );
};

export default FeedbackForm;
