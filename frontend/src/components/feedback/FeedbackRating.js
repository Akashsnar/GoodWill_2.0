// FeedbackRating.js
import React, { useState } from "react";
import "./Feedback.css";
import "@fortawesome/fontawesome-free/css/all.css";

const FeedbackRating = ({ title, onChange }) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [emojiTransform, setEmojiTransform] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");

  const handleStarClick = (index, transform, text) => {
    setSelectedRating(index + 1);
    setEmojiTransform(transform);
    setFeedbackText(text);
    onChange(index + 1);
  };

  return (
    <div>
      <fieldset>
        <center>
          <legend>
            <b>Rate {title}</b>
            <sup className="feedbackRequired">*</sup>
          </legend>
        </center>
        <div className="feedbackBox">
          <div className="emoji">
            <div
              id="emoji"
              style={{ transform: `translateX(${emojiTransform}px)` }}
            >
              <img
                src="https://iili.io/J9rbT8J.png"
                alt="Very Bad"
                border="0"
              />
              <img src="https://iili.io/J9rbuyv.png" alt="Bad" border="0" />
              <img src="https://iili.io/J9rbo6F.png" alt="Ok" border="0" />
              <img src="https://iili.io/J9rbz3g.png" alt="Good" border="0" />
              <img
                src="https://iili.io/J9rbIaa.png"
                alt="Very Good"
                border="0"
              />
              <br />
            </div>
          </div>
          <p id="p">{feedbackText}</p>
          <div className="ratingFeedback">
            {[...Array(5)].map((_, index) => (
              <i
                key={index}
                className={`fas fa-star ${
                  index < selectedRating ? "selected" : ""
                }`}
                onClick={() =>
                  handleStarClick(
                    index,
                    -100 * index,
                    ["Worst", "Bad", "Ok", "Good", "Excellent"][index]
                  )
                }
              ></i>
            ))}
            <br />
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default FeedbackRating;
