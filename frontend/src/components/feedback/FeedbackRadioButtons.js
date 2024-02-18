// FeedbackRadioButtons.js
import React, { useState } from "react";

const FeedbackRadioButtons = ({ legend, options, name, onChange }) => {
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    onChange(selectedValue);
  };

  return (
    <div>
      <fieldset>
        <legend>
          <b>{legend}</b>
        </legend>
        {options.map((option, index) => (
          <div key={index}>
            <input
              id={`${name}-${index + 1}`}
              name={name}
              type="radio"
              value={option}
              tabIndex={index + 5}
              checked={selectedOption === option}
              onChange={handleOptionChange}
            />
            <label htmlFor={`${name}-${index + 1}`}>{option}</label>
          </div>
        ))}
      </fieldset>
    </div>
  );
};

export default FeedbackRadioButtons;
