// Rating.js
import React, { useState, useEffect } from "react";
import "./Ratings.css";
import FeedbackRating from "../feedback/FeedbackRating";
import Comment from "./Comment";
import Navbar from "../navbar/Navbar";
import { useLocation } from 'react-router-dom';

const Ratings = () => {
const {state} = useLocation()
const ngodetail= state.ngodata;
const username= state.username;
const userDetails=state.userDetails;

  console.log("ratings", state.ngodata, username, userDetails);

  const [formData, setFormData] = useState({
    rating: 0,
  });
  // const { state } = props.location;
  // console.log(state);

  const users = {
    ReyKan: {
      name: "ReyKan",
      src: "assets/images/users/u5.png",
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
      _id: 1313,
      text: "ChildCare's initiatives are shaping a brighter future for children in need. Their commitment to education and support services is truly commendable!",
      author: users["Rishi"],
      ngoname: "ChildCare",
      campagainname: "food and shelter",
      rating: 5,
      createdAt: "2023-07-17 11:15:00",
    },
    {
      _id: 1010,
      text: "Education for Free's focus on education and holistic development is making a significant impact on the lives of children. Kudos to their team!",
      author: users["Pooja"],
      ngoname: "Education for Free",
      campagainname: "food and shelter",
      rating: 4,
      createdAt: "2023-09-10 12:45",
    },
    {
      _id: 404,
      text: "I've witnessed the positive impact ChildCare has on the lives of children. Their educational programs and support services are making a real difference!",
      author: users["Sneha"],
      ngoname: "ChildCare",
      campagainname: "food and shelter",
      rating: 4,
      createdAt: "2023-04-08 13:15:00",
    },
    {
      _id: 707,
      text: "Food For All's dedication to the well-being of children is unmatched. They provide a nurturing environment for the development of young minds!",
      author: users["Vikram"],
      ngoname: "Food For All",
      campagainname: "food and shelter",
      rating: 3,
      createdAt: "2023-06-22 17:45:00",
    },
  ]);

  const addComment = async (newComment) => {
    // try {
    //   // Make a POST request to the backend endpoint
    //   const response = await fetch(
    //     "http://localhost:4000/sitedata/addComment",
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(newComment),
    //     }
    //   );

    //   // Handle the response (optional)
    //   const data = await response.json();
    //   console.log("Comment added:", data);

      // Update local state if needed
      setComments([newComment, ...comments]);
      setFormData((prevData) => ({
        ...prevData,
        newComment: newComment,
      }));
    // } catch (error) {
    //   console.error("Error adding comment:", error);
    // }
  };


const handleInputChange = (name, value) => {
  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

  // const addComment = (newComment) => {
  //   setComments([newComment, ...comments]);
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     newComment: newComment,
  //   }));
  // };

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
            userDetails={userDetails}
            username={username}
            ngoname= {ngodetail.ngoname}
            campagainname={ngodetail.campagainname}
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
