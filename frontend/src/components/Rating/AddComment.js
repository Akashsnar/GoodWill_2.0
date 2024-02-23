//AddComment.js
import React, { useState } from "react";

const AddComment = ({userDetails,username,ngoname,campagainname, users, addComment, formData }) => {

console.log("Adding comment",userDetails, username, campagainname, ngoname);
  // console.log("Add Comments", state, username);

  // const { name, age } = state;

  const loggedUser = users["ReyKan"];
  const [newCommentText, setNewCommentText] = useState("");

  const handleCommentChange = (event) => {
    setNewCommentText(event.target.value);
  };

  const handleReset = () => {
    setNewCommentText("");
  };

  // const handleCommentSubmit = (event) => {
  //   event.preventDefault();
const handleCommentSubmit = async (event) => {
  event.preventDefault();

  const newComment = {
    author: userDetails.name,
    ngoname: ngoname,
    campagainname: campagainname,
    rating: formData.rating,
    text: newCommentText,
    createdAt: new Date().toISOString(),
  };

  try {
    console.log("hi");
    const response = await fetch("http://localhost:4000/sitedata/addComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newComment),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Handle the response (optional)
    const data = await response.json();
    console.log("Comment added:", data);

    // Update local state if needed
    addComment(newComment);
    handleReset();
    window.location.reload();
  } catch (error) {
    console.error("Error adding comment:", error);
  }
};


  return (
    <div className="discussionHeader">
      <div className="authedUser">
        {/* <img className="ratings-avatar" src={userDetails.profilePic} alt={loggedUser.name} /> */}
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
