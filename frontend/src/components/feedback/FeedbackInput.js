// FeedbackInput.js
import React, { useState } from "react";

const FeedbackInput = ({ label, type, name, onChange }) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    onChange(value);

    if (name === "name") {
      const isValid = /^[A-Za-z\s]+$/.test(value);
      setError(isValid ? "" : "Name must contain only letters");
    } else if (name === "email") {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      setError(isValid ? "" : "Invalid email format");
    }
  };

  return (
    <div>
      <label htmlFor={name}>
        {label}<sup className="feedbackRequired">* &nbsp;</sup>
        {error && <span className="error-message ">{error}</span>}
      </label>
      <div>
        <input
          id={name}
          name={name}
          type={type}
          tabIndex="1"
          required
          value={inputValue}
          onChange={handleInputChange}
          className="feedbackInput"
        />
      </div>
    </div>
  );
};

export default FeedbackInput;
