import React from "react";
import "./userstyle.css";
import ngos from "./ngoscard";
import { Link, useNavigate } from "react-router-dom";
import { selectName, selectEmail } from "../../redux/features/auth/authSlice";
import store from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/actions/useractions";
import GetUserNGO from "../NGO/GetUserNGO";

function Userhome() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const name = useSelector(selectName);
  const Email = useSelector(selectEmail);
  console.log(useSelector((state) => state.auth));
  const Logout = () => {
    dispatch(logout());
    // console.log(store.getState());
    navigate("/");
  };

  return (
    <div className="body">
      <div className="row profile">
        {/* sidebar */}
        <div className="col-md-3">
          <div className="col-md-3" style={{ position: "fixed" }}>
            <div className="profile-sidebar">
              <div className="profile-userpic">
                <img
                  src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D"
                  className="img-responsive"
                  alt=""
                />
              </div>
              <div className="profile-usertitle">
                <div className="profile-usertitle-name">{name}</div>
                <div className="profile-usertitle-job">Developer</div>
              </div>
              {/* <div className="profile-userbuttons">
                            <button type="button" className="btn btn-success btn-sm">Donation</button>
                            <button type="button" className="btn btn-danger btn-sm">Message</button>
                        </div> */}

              <div className="portlet light bordered">
                <div className="row list-separated profile-stat">
                  <div className="col-md-6 col-sm-6 col-xs-6">
                    <div className="uppercase profile-stat-title"> 37 k </div>
                    <div className="uppercase profile-stat-text">
                      {" "}
                      Donation{" "}
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-6 col-xs-6">
                    <div className="uppercase profile-stat-title"> 12 </div>
                    <div className="uppercase profile-stat-text">
                      {" "}
                      Campaigns{" "}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="profile-desc-title">About Me</h4>
                  <span className="profile-desc-text">
                    {" "}
                    Lorem ipsum dolor sit amet diam nonummy nibh dolore.{" "}
                  </span>
                  <div className="profile-desc-link mt-2">
                    <i className="fa fa-globe"></i>
                    <Link
                      href="https://www.apollowebstudio.com"
                      className="link"
                    >
                      {Email}
                    </Link>
                  </div>
                  <div className="profile-desc-link mt-2">
                    <i className="fa fa-twitter"></i>
                    <Link
                      href="https://www.twitter.com/jasondavisfl/"
                      className="link"
                    >
                      @jasondavisfl
                    </Link>
                  </div>
                  <Link
                    to="/userdetails"
                    state={{ UserloginEmail: Email }}
                    className="pt-[10rem] text-green-600"
                  >
                    <i className="fa-light fa-pen-to-square"></i> Update your
                    Profile
                  </Link>
                </div>

                <div className="profile-userbuttons">
                  <button
                    type="button"
                    style={{ backgroundColor: "red", color: "white" }}
                    className="btn"
                    onClick={Logout}
                  >
                    Log out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-9">
          <div className="profile-content">
            <h2 className="NgosTitle">Our NGOs</h2>
            <GetUserNGO />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Userhome;
