//AddComment.js
import React, { useState } from "react";

const AddComment = ({ users, addComment, formData }) => {
  const loggedUser = users["ReyKan"];
  const [newCommentText, setNewCommentText] = useState("");

  const handleCommentChange = (event) => {
    setNewCommentText(event.target.value);
  };

  const handleReset = () => {
    setNewCommentText("");
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();

    const newComment = {
      UserID: new Date().getTime(),
      text: newCommentText,
      author: loggedUser,
      rating: formData.rating,
      createdAt: new Date().toISOString(),
    };

    addComment(newComment);
    handleReset();
  };

  return (
    <div className="discussionHeader">
      <div className="authedUser">
        <img className="avatar" src={loggedUser.src} alt={loggedUser.name} />
      </div>
      <form id="newcommentForm" onSubmit={handleCommentSubmit}>
        <textarea
          tabIndex="1"
          cols="150"
          rows="4"
          minLength="5"
          required
          placeholder="Write a comment"
          value={newCommentText}
          onChange={handleCommentChange}
        ></textarea>
        <div className="newcommentToolbar">
          <button
            id="reset-button"
            className="buttonSecondary"
            tabIndex="3"
            type="button"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            id="confirm-button"
            className="buttonPrimary"
            tabIndex="2"
            type="submit"
          >
            Comment
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddComment;
