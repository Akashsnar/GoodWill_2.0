import React, { useState, useEffect } from "react";
import "./userstyle.css";
import ngos from "./ngoscard";
import { Link, useNavigate, useParams } from "react-router-dom";
import { selectName, selectEmail } from "../../redux/features/auth/authSlice";
import store from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/actions/useractions";
import GetUserNGO from "../NGO/GetUserNGO";
import axios from 'axios'
// import '../../../../backend/uploads/'

function Userhome() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const name = useSelector(selectName);
  const Email = useSelector(selectEmail);
  console.log(useSelector((state) => state.auth));
  const Logout = () => {
    dispatch(logout());
    navigate("/");
  };


  const props = useParams();
const [userdata, setuserdata] = useState(null)

  const [userDetails, setuserDetails] = useState({
    profilePic: 'https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg',
    Email: '',
    details: 'User has no details updated',
    name: 'Name not updated',
    phone: 'Contact details not updated',
    dob: 'xx/xx/xxxx',
  });


  useEffect(() => {
    async function fetchData() {
      console.log("hi");
      const userid = props.id;
      console.log(userid);
      const response = await axios.get(`http://localhost:4000/sitedata/userdetail/${userid}`);
      console.log("data fetched successfully");
      setuserdata(response.data)
      
      // console.log(response, userdata);


      if (response.data) {
        console.log("no enter in this");
        const responses = await response.data;
        console.log(responses);
        if (responses.profilePic !== '') {
          console.log("image")
        }
        const pic = '';
        console.log("image", pic)
        setuserDetails({
          profilePic: (responses.profilePic == '') ? 'https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg' : responses.profilePic,
          Email: (responses.Email),
          details: (responses.details),
          name: (responses.name),
          phone: (responses.phone),
          dob: (responses.dob)
        });
      }
    }
    console.log("hi Akash");
    fetchData();

  }, [])


  return (
    <div className="body">
      <div className="row profile">
        <div className="col-md-3">
          <div className="col-md-3" style={{ position: "fixed" }}>
            <div className="profile-sidebar">
              <div className="profile-userpic">
                <img
                  src={`http://localhost:4000/uploads/${userDetails.profilePic}`}
                  // src={`../../../../backend/uploads/1708607269276.jpg`}
                   
                  className="img-responsive"
                  alt=""
                />
              </div>
              <Link to={`/userprofile/${userDetails.name}`} className="profile-usertitle"> 
                <div className="profile-usertitle-name">{userDetails.name}</div>
                <div className="profile-usertitle-job">{userDetails.Email}</div>
              </Link>
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
                    {userDetails.details}
                  </span>
                  <div className="profile-desc-link mt-2">
                    <i className="fa fa-globe"></i>
                    <Link
                      to="https://www.apollowebstudio.com"
                      className="link">
                      {Email}
                    </Link>
                  </div>
                  <div className="profile-desc-link mt-2">
                    <i className="fa fa-twitter"></i>
                    <Link
                      to="https://www.twitter.com/jasondavisfl/"
                      className="link">
                      {userDetails.phone}
                    </Link>
                  </div>
                  <Link
                    to="/userdetails"
                    state={{ UserloginEmail: Email }}
                    className="text-green-600"
                    >
                    <i className="fa-light fa-pen-to-square"></i> Update your Profile
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
            <GetUserNGO username={name} userDetails={userdata}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Userhome;
