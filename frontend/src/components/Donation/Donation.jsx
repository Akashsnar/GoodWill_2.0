import React, { useState } from "react";
import { donationinfo } from "../../redux/actions/useractions";
import { donationInfo } from "../../services/authService";

const Donation = () => {
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
    // Add your form submission logic here
    console.log("Form submitted with data:", formData);
    await donationInfo(formData);
  };

  return (
<<<<<<< Updated upstream
    <div>
      <h2>Donation Form</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <label htmlFor="NgoName">Ngo Name:</label>
        <input
          type="text"
          id="campaignName"
          name="NgoName"
          value={formData.NgoName}
          onChange={handleChange}
          required
        />
        <label htmlFor="campaignName">Campaign Name:</label>
        <input
          type="text"
          id="campaignName"
          name="campaignName"
          value={formData.campaignName}
          onChange={handleChange}
          required
        />

        <label htmlFor="donationAmount">Donation Amount:</label>
        <input
          type="number"
          id="donationAmount"
          name="donationAmount"
          value={formData.donationAmount}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="phone">Phone Number:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit Donation</button>
      </form>
    </div>
=======
    <div className='container'>
            <div className="donation-form">
                <h1 style={{ fontFamily: "cursive", textAlign: 'center' }} className='donate-heading'>Donate to Support Our Cause</h1>
                <img src={imageUrl} alt="Donate" className="donation-image" />
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="ngoname">Ngoname:</label>
                        <input
                            type="text"
                            id="ngonname"
                            name="NgoName"
                            value={formData.ngoname}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="campaign">Campaign Name:</label>
                        <input
                            type="text"
                            id="campaign"
                            name="campaignName"
                            value={formData.campaignName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="amount">Donation Amount:</label>
                        <input
                            type="number"
                            id="amount"
                            name="donationAmount"
                            value={formData.donationAmount}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number:</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="bg-blue-400">Submit Donation</button>
                </form>
            </div>
        </div>
>>>>>>> Stashed changes
  );
};

export default Donation;
