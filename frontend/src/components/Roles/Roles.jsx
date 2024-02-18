import React, {  useState } from 'react';
import { FaCaretDown } from "react-icons/fa";

import './Roles.css'
import SelectOptionContainer from './SelectOptionContainer';
const Roles = ({formData,setFormData}) => {
  

  // State to manage the selected option
  const [SelectedUser, setSelectedUser] = useState('');
  const [toggle , setToggle]  = useState(true);
  const [val,setVal] = useState('User');
  // Event handler for option selection
  const handleSelectChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const handleClick = (e)=>{
    setToggle(!toggle);
  }
  const SetVal = (e)=>{
    // console.log(e.target);
    // console.log(e.target.innerText);
    const value = e.target.innerText;
    setVal(value);
    setFormData({...formData,"mode":value})
    setToggle(!toggle);
  }
  return (
    <div className='select-container' style={{color:'black'}}>
      <div id="select-options" value={SelectedUser} 
      onChange={handleSelectChange}
       >
      {
        toggle?(
          <p>{val}</p>
        ):(
          <SelectOptionContainer Set_Option_Val={SetVal}/>
        )
      }
      </div>
      <FaCaretDown className='down-icon' 
       size={35} 
       onClick={(e)=>handleClick(e)}
       />

    </div>
  );
};

export default Roles;