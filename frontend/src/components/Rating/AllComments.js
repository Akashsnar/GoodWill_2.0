import React from "react";
import DOMPurify from "dompurify";
import "./Ratings.css";

const AllComments = ({ comments, users, showStars }) => {
  const sortedComments = comments.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const timeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    let interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }

    if (seconds < 10) {
      return "just now";
    }

    return Math.floor(seconds) + " seconds ago";
  };

  const renderStars = (rating) => {
    if (!showStars) {
      return null;
    }
    const maxStars = 5;

    return Array.from({ length: maxStars }, (_, index) => {
      const starClassName = `fas fa-star ${index < rating ? "selected" : ""}`;

      return <i key={index} className={starClassName}></i>;
    });
  };

  const createComment = (comment) => {
    const newDate = new Date(comment.createdAt);

    return (
      <div key={comment.UserID} className="comment">
        <div className="">
          <img
            className="rating-avatar"
            src={comment.author.src}
            alt={comment.author.name}
            height={100}
            width={100}
          />
        </div>
        <div className="commentBody">
          <div className="commentAuthor">
            {comment.author.name}
            <sub>
              <time dateTime={comment.createdAt} className="commentDate">
                {timeSince(newDate)}
              </time>
            </sub>
            <div className="commentRating">{renderStars(comment.rating)}</div>
          </div>
          <div className="commentText">
            <p>{DOMPurify.sanitize(comment.text)}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="discussion__comments">
      {sortedComments.map(createComment)}
    </div>
  );
};

export default AllComments;
