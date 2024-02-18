// Comment.js
import React from "react";
import AddComment from "./AddComment";
import AllComments from "./AllComments";

const Comment = ({ users, comments, addComment, formData }) => {
  return (
    <div className="discussion">
      <AddComment users={users} addComment={addComment} formData={formData} />
      <AllComments comments={comments} users={users} showStars={true} />
    </div>
  );
};

export default Comment;
