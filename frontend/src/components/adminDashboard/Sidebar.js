import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isChartsOpen, setIsChartsOpen] = useState(false);
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [arrowDirection, setArrowDirection] = useState("left");
  const [arrowDirectionT, setArrowDirectionT] = useState("left");

  const toggleChartsDropdown = () => {
    setIsChartsOpen(!isChartsOpen);
    setArrowDirection(arrowDirection === "left" ? "down" : "left");
  };
  const toggleTableDropdown = () => {
    setIsTableOpen(!isTableOpen);
    setArrowDirectionT(arrowDirectionT === "left" ? "down" : "left");
  };

  return (
    <div className="sidebar" role="navigation">
      <ul className="nav" id="side-menu">
        {/* <li className="sidebar-search">
          <div className="input-group custom-search-form">
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
            />
            <span className="input-group-btn">
              <button className="btn btn-default" type="button">
                <i className="fa fa-search"></i>
              </button>
            </span>
          </div>
        </li> */}
        <li>
          <Link to="/adminDashboard" >
            <i className="fa fa-dashboard"></i> Dashboard
          </Link>
        </li>
        <li className="charts-item">
          <Link to="#" onClick={toggleChartsDropdown}>
            <i className="fa fa-area-chart"></i> Charts
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span className="arrow">
              {" "}
              {arrowDirection === "left" ? (
                <i className="fas fa-angle-left"></i>
              ) : (
                <i className="fas fa-angle-down"></i>
              )}
            </span>{" "}
          </Link>
          {isChartsOpen && (
            <ul className="nav nav-second-level">
              <li>
                <Link to="/adminDashboard/Graph">Donation Chart</Link>
              </li>
              <li>
                <Link to="/adminDashboard/PieChart">Users and NGOs </Link>
              </li>
            </ul>
          )}
        </li>
        <li className="charts-item">
          <Link to="/adminDashboard/chat">
            <i class="fa fa-comments" aria-hidden="true"></i>Chats
          </Link>
        </li>
        <li className="charts-item">
          <Link to="#" onClick={toggleTableDropdown}>
            <i className="fa fa-table"></i> Tables
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span className="arrow">
              {" "}
              {arrowDirectionT === "left" ? (
                <i className="fas fa-angle-left"></i>
              ) : (
                <i className="fas fa-angle-down"></i>
              )}
            </span>{" "}
          </Link>
          {isTableOpen && (
            <ul className="nav nav-second-level">
              <li>
                <Link to="/adminDashboard/NGOsTable" >NGOs Table</Link>
              </li>
              <li>
                <Link to="/adminDashboard/NGOsCampaign" >NGOs Campaign</Link>
              </li>
              <li>
                <Link to="/adminDashboard/UserTable" >Users Table</Link>
              </li>
              <li>
                <Link to="/adminDashboard/EventTable" >Event Table</Link>
              </li>
              <li>
                <Link to="/adminDashboard/ReviewsTable" >Reviews Table</Link>
              </li>
              <li>
                <Link to="/adminDashboard/FeedbackTable" >FeedbackTable</Link>
              </li>
              <li>
                <Link to="/adminDashboard/MessagesTable" >Messages Table</Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <Link to="/" >
            <i className="fas fa-sign-out-alt"></i> Sign Out
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
