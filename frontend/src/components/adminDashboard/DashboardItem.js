// DashboardItem.js

import React from "react";

const DashboardItem = ({ iconClass, bgColor, link, count, title }) => (
  <div className="isPlaceholder">
    <div className="menuCircle">
      <a href={link} className="axy">
        <div className="circle"></div>
        <button
          className="dashboard-item menu-button"
          style={{ backgroundColor: bgColor }}
        >
          <span
            className={`fa ${iconClass}`}
            id="iconID"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          ></span>
          {/* <sub className="countdata">{count}</sub> */}
        </button>
      </a>
    </div>
    <h4>{title}</h4>
  </div>
);

export default DashboardItem;
