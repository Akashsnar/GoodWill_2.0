import React from "react";
import "./PaperContainer.css";
import { Link } from "react-router-dom";
import img from '../../Images/scholarlyjournals_src.png'
const PaperContainer = ({ vid }) => {
  return (
    <div className="PaperContainer">
      <div className="PaperContainer_icon">
        <div className="iconcontainer">
          <img src={img} alt="" />
        </div>
        <span>Scholarly <br /> Journal</span>
        
      </div>
      <div className="paper">
        <div className="paper-name">
          <Link to={`/Journals/${vid._id}`} className="no-underline">
            {vid.name}
          </Link>
        </div>
        <div>Mishra, Shivansh; Singh, Shashank Sheshar; Kumar, Ajay; Biswas, Bhaskar. 
           Applied Intelligence; Boston Vol. 53, Iss. 3, 
            (Feb 2023): 3415-3443.</div>
        <div className="paper-details">
          <div> <span className="headding">Publisher</span> :{vid.publisher}</div>
          <div><span className="headding">Year</span> : {vid.Year}</div>
          <Link to={"#"} className="no-underline">
            Most Recent Issue
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaperContainer;
