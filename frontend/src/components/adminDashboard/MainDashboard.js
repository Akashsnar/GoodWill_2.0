//MainDashboard.js
import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import NavAdmin from "./NavAdmin";
import DashboardItems from "./DashboardItems";
import AllComments from "../Rating/AllComments";
import { Link } from "react-router-dom";
import Graph from "./Graph";
// import SideMenu from "./Sidebar";
import Sidebar from "./Sidebar";
function MainDashboard() {
  // const users = {
  //   Amit: {
  //     name: "Amit",
  //     src: "assets/images/users/u1.png",
  //   },
  //   Priya: {
  //     name: "Priya",
  //     src: "assets/images/users/u2.png",
  //   },
  //   Anjali: {
  //     name: "Anjali",
  //     src: "assets/images/users/u4.png",
  //   },
  //   Vikram: {
  //     name: "Vikram",
  //     src: "assets/images/users/u5.png",
  //   },
  //   Neha: {
  //     name: "Neha",
  //     src: "assets/images/users/u0.png",
  //   }
  // };

  // const comments = [
  //   {
  //     UserID: 1,
  //     text: "Hello, I am passionate about supporting the education of underprivileged children. Please guide me on how I can contribute to your noble cause.",
  //     author: users["Amit"],
  //     createdAt: "2023-12-01 09:45:00",
  //   },

  //   {
  //     UserID: 2,
  //     text: "Greetings! I believe in empowering individuals through skill development. How can I be part of your initiatives aimed at creating sustainable livelihoods?",
  //     author: users["Priya"],
  //     createdAt: "2023-12-02 12:15:00",
  //   },
  //   {
  //     UserID: 4,
  //     text: "Hi, I am interested in contributing to healthcare initiatives for rural communities. Kindly share information on your ongoing projects in this domain.",
  //     author: users["Anjali"],
  //     createdAt: "2023-12-03 11:00:00",
  //   },
  //   {
  //     UserID: 5,
  //     text: "Greetings! I love animals and would like to support your efforts in animal welfare. Could you provide details on your ongoing programs in this area?",
  //     author: users["Vikram"],
  //     createdAt: "2023-12-02 14:45:00",
  //   },
  //   {
  //     UserID: 6,
  //     text: "Hello, I am passionate about women's empowerment. Please share information on your initiatives and how individuals like me can contribute to your cause.",
  //     author: users["Neha"],
  //     createdAt: "2023-12-03 10:30:00",
  //   },
  // ];
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4000/sitedata/contact");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        const loadedUsers = {};

        data.forEach((comment) => {
          const randomAvatarNumber = Math.floor(Math.random() * 6) + 1;
          const user = {
            name: comment.name,
            src: `assets/images/users/u${randomAvatarNumber}.png`,
          };
          loadedUsers[comment.name] = user;
        });

        setUsers(loadedUsers);
        const commentsWithAuthor = data.map((comment) => ({
          ...comment,
          author: loadedUsers[comment.name] || {},
          text: comment.message,
        }));

        console.log("Comments with author:", commentsWithAuthor);

        setComments(commentsWithAuthor);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);
  // const [collapsed, setCollapsed] = useState(false);

  // const toggleCollapse = () => {
  //   setCollapsed(!collapsed);
  // };

  return (
    <>
      <NavAdmin />
      <div className="mainContainer">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="mainContent">
          <DashboardItems />
          <div className="mainArea">
            {/* <div className="sideMenuArea">
          <SideMenu />
        </div> */}
            <div className="graphArea">
              <Link to="/adminDashboard/DonationsTable">
                <i class="fa-solid fa-arrow-up-right-from-square shiftIcon"></i>
              </Link>
              <Graph className="centerGraph" />
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
              <AllComments comments={comments} showStars={false} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default MainDashboard;
