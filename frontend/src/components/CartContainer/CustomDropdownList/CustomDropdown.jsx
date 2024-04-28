import React, { useState } from "react";
import "./CustomDropdown.css";
import NormalBtn from  '../NormalBtn/NormalBtn'
import { useSelector } from "react-redux";
import { SendCartInfo } from "../../../services/authService";
const CustomDropdown = ({dynamicClass="hn",seq_arr}) => {
  const CartItems  = useSelector((state)=>state.cart) 
  const handleClick = async()=>{
    console.log(CartItems);
      await SendCartInfo(CartItems)
        return;
  }
  return (
   
      
        <div className={`CustomDropdown-Content ${dynamicClass} `} >
          {
            seq_arr && seq_arr.map((seq,index)=>{
              return (
                <div className="CustomDropdown-item"key={index} >
                  <img src={seq['image']} width={'50px'} height={'50px'} />

                   <span style={{padding:'2px'}}><b> Title: </b> {seq['title'] }</span>
                   <span style={{padding:'2px'}}> <b>Price:</b> {seq['price']}</span>
                  </div>
              )
            })
          }
          <span onClick={handleClick}><NormalBtn info = {'Donate'} btnstyle={'center-text'}/></span>
          
        </div>
      
  
  );
};
export default CustomDropdown;
