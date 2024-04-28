import React, { useState } from "react";
import "./PaperContainer/PaperContainer.css";
import img from "./download.jpeg";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "./TbPaperContainer.css";


const TbPaperContainer = ({ vid,selectedvidId }) => {

  return (
    <div
      className=" tbPaperContainer"
      
    >
      <div className="PaperContainer_icon">
        <div className="iconcontainer" style={{width:"100%"}}>
          <img src={img} alt="" style={{width:"75%", height:"75%"}}/>
        </div>
      </div>
      <div className="tbpaper">
        <div className="tbheading"> <b>Volume :</b>{vid.Vol}</div>
        <div className="tbheading"> <b>Year :</b> {vid.Year}</div>
      </div>
      <div className="tbpaperarrow-icon">
        { selectedvidId === vid._id ?(<FaChevronUp />):(<FaChevronDown/>)
        }
      </div>
    </div>
  );
};

export default TbPaperContainer;
