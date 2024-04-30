import React from "react";
import Login from "../../Login";
import { ToastContainer,toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
// import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import Navbar from "../navbar/Navbar";


const LoginContainer = () => {
  return (
    <>
      <Login />
    
    <ToastContainer/>
   </>
  );
};

export default LoginContainer;
