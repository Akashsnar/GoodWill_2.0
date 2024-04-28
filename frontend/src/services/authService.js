import axios from "axios";
import { toast } from "react-toastify";
export const Backend_URL = "http://localhost:4000";

export const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

//register
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      `${Backend_URL}/api/users/register`,
      userData,
      { withCredentials: true }
    );
    // console.log("authservice");
    console.log(response);

    if (response.statusText === "OK") {
      toast.success("Registered Successfully");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    // toast.error(message);
    throw new Error(message);
  }
};

//loginUser
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(
      `${Backend_URL}/api/users/login`,
      userData,
      { withCredentials: true }
    );

    if (response.statusText === "OK") {
      toast.success("Login Successfull...");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    // toast.error(message);
    throw new Error(message);
  }
};

//logout user
export const logoutUser = async () => {
  try {
    console.log("logoutUser");

    await axios.get(`http://localhost:4000/api/users/logout`);

    toast.success("Logged Out");
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    // toast.error(message);
    throw new Error(message);
  }
};

//Login Status
export const getLoginStatus = async () => {
  try {
    const response = await axios.get(`${Backend_URL}/api/users/loggedin`);
    // console.log(response);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    throw new Error(message);
  }
};

export const donationInfo = async (formData) => {
  try {
    console.log("donationInfo");
    await axios.post(`${Backend_URL}/userinfo/donation`, formData, {
      withCredentials: true,
    });
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    // toast.error(message);
    throw new Error(message);
  }
};

//Events
export const AddEvents = async (formData) => {
  try {
    console.log(formData);
    await axios.post(`${Backend_URL}/sitedata/events`, formData, {
      withCredentials: true,
    });
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    // toast.error(message);
    throw new Error(message);
  }
};

export const Addproducts = async (formData) => {
  try {
    console.log(formData);
    await axios.post(`${Backend_URL}/sitedata/products`, formData, {
      withCredentials: true,
    });
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    throw new Error(message);
  }
};

export const GetEvents = async (formData) => {
  try {

    console.log("Getevent", formData)
    const response = await axios.post(`${Backend_URL}/sitedata/getevents`,formData,{
      withCredentials:true,
    });
    // console.log(response);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    throw new Error(message);
  }
};
export const SendCartInfo = async (formData) => {
  try {

    console.log("SendCartInfo", formData)
    const response = await axios.post(`${Backend_URL}/api/users/cart/cartdetails`,formData,{
      withCredentials:true,
    });
    console.log(response);
    // return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    throw new Error(message);
  }
};


