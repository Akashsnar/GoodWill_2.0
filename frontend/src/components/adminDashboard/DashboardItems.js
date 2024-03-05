//DashboardItems.js
import React from "react";
import "./AdminDashboard.css";
import DashboardItem from "./DashboardItem";
import { Link } from "react-router-dom";
function DashboardItems() {
  return (
    <>
      <div id="mainContainerDashBoard">
        <h2>Admin DashBoard</h2>
        <hr />
        <div className="boxDash">
          <div className="mainDash">
            <div
              className=" isPlaceholders"
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignContent: "space-evenly",
                justifyContent: "space-evenly",
              }}
            >
              <Link to="/adminDashboard/NGOsTable">
                <DashboardItem
                  iconClass="fa-users"
                  bgColor="#8561C8"
                  link="#"
                  count="10"
                  title="NGOs"
                />
              </Link>
              <Link to="/adminDashboard/NGOsCampaign">
                <DashboardItem
                  iconClass=" 	fas fa-bullhorn"
                  bgColor="#66d6e5"
                  link="#"
                  count="10"
                  title="NGOs Campaign"
                />
              </Link>
              <Link to="/adminDashboard/UserTable">
                <DashboardItem
                  iconClass="fa-regular fa-user"
                  bgColor="#00B8ED"
                  count="20"
                  title="Users"
                />
              </Link>
              <Link to="/adminDashboard/EventTable">
                <DashboardItem
                  iconClass="fa fa-calendar"
                  bgColor="#6c9acf"
                  link="#"
                  count="8"
                  title="Events"
                />
              </Link>
              <Link to="/adminDashboard/ReviewsTable">
                <DashboardItem
                  iconClass="fa-regular fa-comment-dots"
                  bgColor="#68C182"
                  link="#"
                  count="5"
                  title="Reviews"
                />
              </Link>
              <Link to="/adminDashboard/FeedbackTable">
                <DashboardItem
                  iconClass="fa-regular fa-message"
                  bgColor="#ff9a7a"
                  link="#"
                  count="8"
                  title="Feedbacks"
                />
              </Link>

              {/* <Link to="/adminDashboard/ReportsTable">
                <DashboardItem
                  iconClass="fa-info-circle"
                  bgColor="#989fa8"
                  link="#"
                  count="3"
                  title="Report"
                />
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default DashboardItems;
