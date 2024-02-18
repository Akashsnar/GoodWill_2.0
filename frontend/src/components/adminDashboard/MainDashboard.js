//MainDashboard.js
import React from "react";
import "./AdminDashboard.css";
import NavAdmin from "./NavAdmin";
import DashboardItems from "./DashboardItems";
import AllComments from "../Rating/AllComments";
import Graph from "./Graph";
import { Link } from "react-router-dom";
function MainDashboard() {
  const users = {
    Amit: {
      name: "Amit",
      src: "assets/images/users/u1.png",
    },
    Priya: {
      name: "Priya",
      src: "assets/images/users/u2.png",
    },
    Anjali: {
      name: "Anjali",
      src: "assets/images/users/u4.png",
    },
    Vikram: {
      name: "Vikram",
      src: "assets/images/users/u5.png",
    },
    Neha: {
      name: "Neha",
      src: "assets/images/users/u0.png",
    }
  };

  const comments = [
    {
      UserID: 1,
      text: "Hello, I am passionate about supporting the education of underprivileged children. Please guide me on how I can contribute to your noble cause.",
      author: users["Amit"],
      createdAt: "2023-12-01 09:45:00",
    },

    {
      UserID: 2,
      text: "Greetings! I believe in empowering individuals through skill development. How can I be part of your initiatives aimed at creating sustainable livelihoods?",
      author: users["Priya"],
      createdAt: "2023-12-02 12:15:00",
    },
    {
      UserID: 4,
      text: "Hi, I am interested in contributing to healthcare initiatives for rural communities. Kindly share information on your ongoing projects in this domain.",
      author: users["Anjali"],
      createdAt: "2023-12-03 11:00:00",
    },
    {
      UserID: 5,
      text: "Greetings! I love animals and would like to support your efforts in animal welfare. Could you provide details on your ongoing programs in this area?",
      author: users["Vikram"],
      createdAt: "2023-12-02 14:45:00",
    },
    {
      UserID: 6,
      text: "Hello, I am passionate about women's empowerment. Please share information on your initiatives and how individuals like me can contribute to your cause.",
      author: users["Neha"],
      createdAt: "2023-12-03 10:30:00",
    },
  ];
  return (
    <>
      <NavAdmin />
      <DashboardItems />
      <div className="mainArea">
        <div className="graphArea">
          <Link to="/adminDashboard/DonationsTable">
            <i class="fa-solid fa-arrow-up-right-from-square shiftIcon"></i>
          </Link>
          <Graph />
        </div>
        <div className="messagesArea">
          <center>
            <h2>
              Messages&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
              <Link to="/adminDashboard/MessagesTable">
                <i class="fa-solid fa-arrow-up-right-from-square iconS"></i>
              </Link>
            </h2>
          </center>
          <hr />
          <AllComments users={users} comments={comments} showStars={false} />
        </div>
      </div>
    </>
  );
}
export default MainDashboard;
