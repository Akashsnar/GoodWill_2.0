import React, { useState } from "react";
import { AddEvents } from "../services/authService";

const initialState = {
  NgoName: "",
  EventName: "",
  Location: "",
  Duration: "",
  DateRange: {
    startDate: "",
    endDate: "",
  },
};
const Events = () => {
  const [formData, setformData] = useState(initialState);
  const handleSubmit = async (e) => {
    e.preventDefault();

    // You can perform actions with the form data here, such as sending it to an API

    // For now, let's log the form data
    console.log(formData.DateRange);
    await AddEvents(formData);
    // Optionally, you can reset the form fields after submission
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Check if the property is nested (contains a dot)
    if (name.includes(".")) {
      // Split the nested property name into an array
      const [parent, child] = name.split(".");

      // Update the state for the nested property
      setformData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      // Update the state for non-nested properties
      setformData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>NGO Name:</label>
        <input
          type="text"
          name="NgoName"
          value={formData.NgoName}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Event Name:</label>
        <input
          type="text"
          name="EventName"
          value={formData.EventName}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Location:</label>
        <input
          type="text"
          name="Location"
          value={formData.Location}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Duration:</label>
        <input
          type="text"
          name="Duration"
          value={formData.Duration}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Start Date:</label>
        <input
          type="date"
          name="DateRange.startDate"
          value={formData.DateRange.startDate}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>End Date:</label>
        <input
          type="date"
          name="DateRange.endDate"
          value={formData.DateRange.endDate}
          onChange={handleInputChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Events;
