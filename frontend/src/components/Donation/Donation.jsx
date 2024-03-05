import React, { useState } from "react";
import { donationinfo } from "../../redux/actions/useractions";
import { donationInfo } from "../../services/authService";
import { useParams, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import "./styles.css";

const Donation = () => {
  const { name } = useParams();
  const { state } = useLocation();
  const ngodetail = state.ngodata;
  const userDetails = state.userDetails;
  console.log("Donation", ngodetail, userDetails);

  console.log(name);
  // State to manage form data
  const [formData, setFormData] = useState({
    username: userDetails.name,
    userid: userDetails._id,
    NgoName: ngodetail.ngoname,
    campaignName: ngodetail.campagainname,
    campaignid: ngodetail._id,
    donationAmount: "",
    email: "",
    phone: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes,i am happy to donate!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Success!",
          text: "Your money donated.",
          icon: "success",
        });
        console.log("Form submitted with data:", formData);
        await donationInfo(formData);
      }
    });
  };

  const imageUrl =
    "https://img.freepik.com/premium-vector/money-charity-donation-illustration_181313-1014.jpg";

  return (
    <div className="donationcontainer">
      <div className="donation-form">
        <h1
          style={{ fontFamily: "cursive", textAlign: "center" }}
          className="donate-heading"
        >
          Donate to Support Our Cause
        </h1>
        <img src={imageUrl} alt="Donate" className="donation-image" />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="donation_label" htmlFor="amount">
              Donation Amount:
            </label>
            <input
              className="donation_input"
              type="number"
              id="amount"
              name="donationAmount"
              value={formData.donationAmount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="donation_label" htmlFor="email">
              Email:
            </label>
            <input
              className="donation_input"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="donation_label" htmlFor="phone">
              Phone Number:
            </label>
            <input
              className="donation_input"
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="bg-blue-400 donation_btn">
            Submit Donation
          </button>
        </form>
      </div>
    </div>
  );
};

export default Donation;
