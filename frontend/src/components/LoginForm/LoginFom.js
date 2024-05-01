import React from "react";
import Roles from "../Roles/Roles";

const LoginFom = ({
  formData,
  handleInputChange,
  login,
  setFormData,
  errormessage,
}) => {
  return (
    <>
      <h1 className="mt-5">Login</h1>
      <p>{errormessage}</p>
      <form className='loginform' onSubmit={login}>
        <Roles formData={formData} setFormData={setFormData} />
        <input
          className="input-tag"
          type="email"
          placeholder="EMAIL "
          name="email"
          onChange={handleInputChange}
          value={formData.email}
        />
        <input
          type="password"
          className="input-tag"
          placeholder="PASSWORD"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <button type="submit" className="lg-btn logbtn" >
          LOGIN
        </button>
      </form>
    </>
  );
};

export default LoginFom;
