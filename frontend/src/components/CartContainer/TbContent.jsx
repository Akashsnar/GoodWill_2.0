import React, { useState } from "react";
import "./TbContent.css";
import TbPaperContainer from "./TbPaperContainer";
import CustomDropdown from "./CustomDropdownList/CustomDropdown";

const vids = [
  {
    _id: 1,
    Vol: "1",
    Year: 2001,
    seqno:['Issue 1','Issue 2','Issue 3','Issue 4','Issue 5','Issue 6','Issue 7','Issue 8','Issue 9','Issue 10','Issue 11']
  },
  {
    _id: 2,
    Vol: "2",
    Year: 2002,
    seqno:['Issue 1','Issue 2','Issue 3','Issue 4','Issue 5','Issue 6','Issue 7','Issue 8','Issue 9','Issue 10','Issue 11']

  },
  {
    _id: 3,
    Vol: "3",
    Year: 2003,
    seqno:['Issue 1','Issue 2','Issue 3','Issue 4','Issue 5','Issue 6','Issue 7','Issue 8','Issue 9','Issue 10','Issue 11']

  },
  {
    _id: 4,
    Vol: "4",
    Year: 2004,
    seqno:['Issue 1','Issue 2','Issue 3','Issue 4','Issue 5','Issue 6','Issue 7','Issue 8','Issue 9','Issue 10','Issue 11']


  },
  {
    _id: 5,
    Vol: "5",
    Year: 2005,
    seqno:['Issue 1','Issue 2','Issue 3','Issue 4','Issue 5','Issue 6','Issue 7','Issue 8','Issue 9','Issue 10','Issue 11']

  },
  {
    _id: 6,
    Vol: "6",
    Year: 2006,
    seqno:['Issue 1','Issue 2','Issue 3','Issue 4','Issue 5','Issue 6','Issue 7','Issue 8','Issue 9','Issue 10','Issue 11']

  },
  {
    _id: 7,
    Vol: "7",
    Year: 2007,
    seqno:['Issue 1','Issue 2','Issue 3','Issue 4','Issue 5','Issue 6','Issue 7','Issue 8','Issue 9','Issue 10','Issue 11']

  },
  {
    _id: 8,
    Vol: "8",
    Year: 2008,
    seqno:['Issue 1','Issue 2','Issue 3','Issue 4','Issue 5','Issue 6','Issue 7','Issue 8','Issue 9','Issue 10','Issue 11']

  },
  {
    _id: 9,
    Vol: "9",
    Year: 2009,
    seqno:['Issue 1','Issue 2','Issue 3','Issue 4','Issue 5','Issue 6','Issue 7','Issue 8','Issue 9','Issue 10','Issue 11']

  },
  {
    _id: 10,
    Vol: "10",
    Year: 2017,
    seqno:['Issue 1','Issue 2','Issue 3','Issue 4','Issue 5','Issue 6','Issue 7','Issue 8','Issue 9','Issue 10','Issue 11']

  },
];
const TbContent = () => {
  const [show_details, set_show_details] = useState(true);
  const [selectedvidId,setselectedvidId] = useState(null);

  const handleClick = (vidid) =>{
    setselectedvidId(selectedvidId===vidid?null:vidid);
  }

  return (
    <div className="tbContent_main-container">
        {vids.map((vid) => {
          return (
            <div className="tb-dropdown-handle-container">
              <div
                className="tb-paper-container"
                onClick={()=>handleClick(vid._id)}
              >
                <TbPaperContainer vid={vid} key={vid._id} selectedvidId={selectedvidId}/>
              </div>
              <div className="blueline"></div>
              {selectedvidId === vid._id && (
                <CustomDropdown
                  show_details={show_details}
                  set_show_details={set_show_details}
                  dynamicClass = 'selectedDropdown'
                  seq_arr = {vid.seqno}
                />
              )}
            </div>
          );
        })}
    </div>
  );
};

export default TbContent;
