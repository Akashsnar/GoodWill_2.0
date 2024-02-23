import React, { useState } from "react";
import { donationinfo } from "../../redux/actions/useractions";
import { donationInfo } from "../../services/authService";
import { useParams } from "react-router-dom";
import './styles.css';

const Donation = () => {
  const { name } = useParams();
console.log(name);
  // State to manage form data
  const [formData, setFormData] = useState({
    username: "",
    NgoName: "",
    campaignName: "",
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
    console.log("Form submitted with data:", formData);
    await donationInfo(formData);
  };

  const imageUrl = "https://img.freepik.com/premium-vector/money-charity-donation-illustration_181313-1014.jpg";

  return (
    <div className='donationcontainer'>
            <div className="donation-form">
                <h1 style={{ fontFamily: "cursive", textAlign: 'center' }} className='donate-heading'>Donate to Support Our Cause</h1>
                <img src={imageUrl} alt="Donate" className="donation-image" />
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="donation_label" htmlFor="username">Username:</label>
                        <input className="donation_input"
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="donation_label" htmlFor="username">Ngoname:</label>
                        <input className="donation_input"
                            type="text"
                            id="ngonname"
                            name="NgoName"
                            value={formData.NgoName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="donation_label" htmlFor="campaign">Campaign Name:</label>
                        <input className="donation_input"
                            type="text"
                            id="campaign"
                            name="campaignName"
                            value={formData.campaignName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="donation_label" htmlFor="amount">Donation Amount:</label>
                        <input className="donation_input"
                            type="number"
                            id="amount"
                            name="donationAmount"
                            value={formData.donationAmount}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="donation_label" htmlFor="email">Email:</label>
                        <input className="donation_input"
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="donation_label" htmlFor="phone">Phone Number:</label>
                        <input className="donation_input"
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="bg-blue-400 donation_btn">Submit Donation</button>
                </form>
            </div>
        </div>
  );
};

export default Donation;
