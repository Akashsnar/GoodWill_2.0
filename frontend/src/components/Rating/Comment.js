// Comment.js
import React from "react";
import AddComment from "./AddComment";
import AllComments from "./ShowAllComments";

const Comment = ({userDetails,username,ngoname,campagainname, users, comments, addComment, formData }) => {
  return (
    <div className="discussion">
      <AddComment userDetails={userDetails} username={username} ngoname={ngoname} campagainname={campagainname} users={users} addComment={addComment} formData={formData} />
      <AllComments comments={comments} campagainname={campagainname} users={users} showStars={true} />
    </div>
  );
};

export default Comment;
