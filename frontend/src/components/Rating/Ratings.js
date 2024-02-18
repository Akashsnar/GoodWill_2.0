// Rating.js
import React, { useState, useEffect } from "react";
import "./Ratings.css";
import FeedbackRating from "../feedback/FeedbackRating";
import Comment from "./Comment";
import Navbar from "../navbar/Navbar";

const Ratings = () => {
  const [formData, setFormData] = useState({
    rating: 0,
  });

  const users = {
    ReyKan: {
      name: "ReyKan",
      src: "assets/images/users/u1.png",
    },
    Rishi: {
      name: "Rishi",
      src: "assets/images/users/u5.png",
    },
    Pooja: {
      name: "Pooja",
      src: "assets/images/users/u2.png",
    },
    Vikram: {
      name: "Vikram",
      src: "assets/images/users/u3.png",
    },
    Sneha: {
      name: "Sneha",
      src: "assets/images/users/u0.png",
    },
  };

  const [comments, setComments] = useState([
    {
      UserID: 1313,
      text: "ChildCare's initiatives are shaping a brighter future for children in need. Their commitment to education and support services is truly commendable!",
      author: users["Rishi"],
      rating: 5,
      createdAt: "2023-07-17 11:15:00",
    },
    {
      UserID: 1010,
      text: "ChildCare's focus on education and holistic development is making a significant impact on the lives of children. Kudos to their team!",
      author: users["Pooja"],
      rating: 4,
      createdAt: "2023-09-10 12:45:00",
    },
    {
      UserID: 404,
      text: "I've witnessed the positive impact ChildCare has on the lives of children. Their educational programs and support services are making a real difference!",
      author: users["Sneha"],
      rating: 4,
      createdAt: "2023-04-08 13:15:00",
    },
    {
      UserID: 707,
      text: "ChildCare's dedication to the well-being of children is unmatched. They provide a nurturing environment for the development of young minds!",
      author: users["Vikram"],
      rating: 3,
      createdAt: "2023-06-22 17:45:00",
    },
  ]);

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addComment = (newComment) => {
    setComments([newComment, ...comments]);
    setFormData((prevData) => ({
      ...prevData,
      newComment: newComment,
    }));
  };

  const saveDataToLocalStorage = (data) => {
    localStorage.setItem("commentsData", JSON.stringify(data));
    console.log("Data saved:", JSON.stringify(data)[0]);
  };

  useEffect(() => {
    saveDataToLocalStorage({ comments, formData });
  }, [comments, formData]);

  return (
    <>
    <div className="RatingBody">
      <Navbar />
      <div className="mainRating">
        <FeedbackRating
          title="This NGO"
          onChange={(value) => handleInputChange("rating", value)}
        />
        <Comment
          users={users}
          comments={comments}
          addComment={addComment}
          formData={formData}
        />
      </div>
      </div>

    </>
  );
};

export default Ratings;
