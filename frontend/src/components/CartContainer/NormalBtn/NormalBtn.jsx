import React from "react";
import "./NormalBtn.css";
const NormalBtn = ({ info , btnstyle }) => {
  return <button className={`normal-btn ${btnstyle}`} >{info}</button>;
}
// const NormalBtn = ({ info,stl }) => {
//   return <button className="normal-btn" style={{...stl}}>{info}</button>;
// };

export default NormalBtn;
