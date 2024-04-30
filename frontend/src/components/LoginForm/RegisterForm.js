import React, { useState } from "react";
import Roles from "../Roles/Roles";

const RegisterForm = ({
  formData,
  handleInputChange,
  register,
  setFormData,
  errormessage,
}) => {
  return (
    <>
      <h1 className="mt-5">Create Account</h1>
      <p>{errormessage}</p>
      <form className='loginform' onSubmit={register}>
        <Roles formData={formData} setFormData={setFormData} />
        <input
          type="text"
          className="input-tag"
          placeholder="NAME"
          name="name"
          onChange={handleInputChange}
          value={formData.name}
        />
        <input
          type="email"
          className="input-tag"
          placeholder="EMAIL"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <input
          type="password"
          className="input-tag"
          placeholder="PASSWORD"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <input
          type="password"
          className="input-tag"
          placeholder="CONFIRMPASSWORD"
          name="password2"
          value={formData.password2}
          onChange={handleInputChange}
        />
        <button type="submit" className="lg-btn">
          REGISTER
        </button>
      </form>
    </>
  );
};

export default RegisterForm;
