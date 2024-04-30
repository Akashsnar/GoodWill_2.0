// Campaign.js
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { selectName, selectEmail } from "../../redux/features/auth/authSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addCartItems } from "../../redux/features/auth/cartSlice";
import Swal from "sweetalert2";


const Campaign = ({ data, mode, username, userDetails }) => {
  console.log("user detail", userDetails);
  console.log("Ngo detail", data);
  const checkcartdata = useSelector((state) => state.cart)
  console.log(checkcartdata);
  // const cart={
  //   productname: "",
  //   quantity:"",
  //   Campaignname:"",
  //   username:"",
  // }

  const dispatch = useDispatch();
  const name = useSelector(selectName);
  const [percentage, setPercentage] = useState(0);
  const barInnerRef = useRef(null);

  useEffect(() => {
    console.log("ngo page data->", data, username);
    const calculatedPercentage = Math.floor((data.raised / data.goal) * 100);
    setPercentage(calculatedPercentage);

    if (barInnerRef.current) {
      barInnerRef.current.classList.add("counted");
    }
  }, [data.raised, data.goal]);
  const reportthis = (e) => {
    const id = e.target.id;
    const color = document.getElementById(id).style.color;
    if (color !== "red") {
      document.getElementById(id).style.color = "red";
    }
    if (color === "red") {
      document.getElementById(id).style.color = "";
    }
    console.log();
  };

  const handleClose = async (CloseId) => {
    try {
      const response = await fetch("http://localhost:4000/sitedata/closecamp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ CloseId }),
      });

      console.log("Server response:", response);

      if (!response.ok) {
        console.error("Server error:", response.statusText);
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleOpen = async (OpenId) => {
    try {
      const response = await fetch("http://localhost:4000/sitedata/opencamp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ OpenId }),
      });

      console.log("Server response:", response);

      if (!response.ok) {
        console.error("Server error:", response.statusText);
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const addvolunteer = async (campaignid) => {
    try {


      Swal.fire({
        title: "Are you sure to volunteer this events?",
        text: "",
        icon: "",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "yeah",
      }).then(async (result) => {

        if (result.isConfirmed) {
          console.log("ids=>", campaignid, userDetails._id);
          const formDatas = { campaignid: campaignid, userid: userDetails._id }
          const response = await axios.post(
            "http://localhost:4000/sitedata/user/volunteer",
            formDatas, {
            withCredentials: true,
          }
          );
          if(response.status==200){
          Swal.fire({
            title: "Success!",
            text: "You are registerd for volunteer.",
            icon: "success",
          });
        }
        else{
          Swal.fire({
            title: "Error!",
            text: "Try again request not able to proceed",
            icon: "failure",
          })
        }
        }
      });
      


      // console.log("ids=>", campaignid, userDetails._id);
      // const formDatas = { campaignid: campaignid, userid: userDetails._id }
      // const response = await axios.post(
      //   "http://localhost:4000/sitedata/user/volunteer",
      //   formDatas, {
      //   withCredentials: true,
      // }
      // );
      // console.log("data saved", response);
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div>

      <section class="feature-one features-service">
        <div class="container">
          <div class="feature-one__inner" style={{ padding: "0" }}>
            <div class="row nonProfitContainer">
              <div
                style={{
                  display: "flex",
                  marginTop: "2rem",
                  paddingTop: "2rem",
                }}
                className="block-title UserNgoContainer"
              >
                <div>
                  <img
                    src={data.image}
                    alt={data.name}
                    srcset=""
                    style={{ width: "25rem", height: "15rem" }}
                    className="ml-3 rounded-4"
                  />
                </div>
                <div style={{ textAlign: "center" }}>
                  {mode !== "ngodash" ? (
                    <a href={data.link}>
                      <h4 style={{ paddingLeft: "5rem" }} className="ngolink">
                        {data.campagainname}
                      </h4>
                    </a>
                  ) : (
                    <Link to={`/Ngo_dashboard/${data.campagainname}`}>
                      <h4 style={{ paddingLeft: "5rem" }} className="ngolink">
                        {data.campagainname}
                      </h4>
                    </Link>
                  )}
                  <p className="feature-p">{data.desc}</p>
                </div>
              </div>
            </div>
            {mode !== "ngodash" ? (
              <div className="popular-causes__progress UserNgoProgress">
                <div className="bar">
                  <div
                    className="bar-inner count-bar"
                    ref={barInnerRef}
                    style={{ width: `${percentage}%` }}
                  >
                    <div className="count-text">{percentage}%</div>
                  </div>
                </div>
                <div className="popular-causes__progress UserNgoProgress">
                  <div
                    className="popular-causes__goals"
                    style={{ marginBottom: "0", paddingBottom: "0" }}
                  >
                    <p>
                      <span>Rs {data.raised}</span> Raised
                    </p>
                    <p>
                      <span>Rs {data.goal}</span> Goal
                    </p>
                  </div>
                  <div
                    className="text-center more-post__btn Ngobtn"
                    style={{ marginTop: "1rem", display: "flex" }}>

                    <Link
                      to="/givereview"
                      state={{
                        ngodata: data,
                        username: username,
                        userDetails: userDetails,
                      }}
                      className="thm-btn"
                      style={{
                        height: "2rem",
                        width: "10rem",
                        margin: "0px",
                        marginBottom: "1rem",
                        padding: "10px",
                        textAlign: "center",
                        lineHeight: "10px",
                      }}
                    >
                      {" "}
                      Give Review
                    </Link>
                    <Link
                      to="/getevents"
                      state={{
                        ngodata: data,
                        userDetails: userDetails
                      }}
                      className="thm-btn"
                      style={{
                        height: "2rem",
                        width: "10rem",
                        margin: "0px",
                        marginBottom: "1rem",
                        padding: "10px",
                        textAlign: "center",
                        lineHeight: "10px",
                      }}
                    >
                      {" "}
                      Show Event
                    </Link>
                    <Link
                      to={`/donation/${name}`}
                      state={{ ngodata: data, userDetails: userDetails }}
                      className="thm-btn"
                      style={{
                        height: "2rem",
                        width: "10rem",
                        margin: "0px",
                        marginBottom: "1rem",
                        padding: "10px",
                        textAlign: "center",
                        lineHeight: "10px",
                      }}
                    >
                      Donate
                    </Link>
                  </div>

                  <div className="flex justify-between">
                    <button class="NGOReport"
                      onClick={() => (addvolunteer(data._id))}
                    >
                      Apply for Volunteer{" "}

                    </button>
                    <p class="NGOReport" style={{ textAlign: "right" }}>
                      Report this NGO{" "}
                      <i
                        id={data.name}
                        class="fa-solid fa-thumbs-down thumbsdown"
                        onClick={(e) => {
                          reportthis(e);
                        }}
                      ></i>
                    </p>

                    <Link to='products'
                      state={{ ngodata: data, userDetails: userDetails }}
                    >Donate Needs</Link>
                    {/* <button className="bg-green-400" onClick={()=>{dispatch(addCartItems({"productname":"milk", "campagainname":data.name}));}}>cartAdd</button>
                 {checkcartdata.cartitems.map((item)=>item.productname)} */}
                  </div>

                </div>
              </div>
            ) : data.status !== "closed" ? (
              <div style={{ textAlign: "center" }}>
                {" "}
                <button
                  className="thm-btn"
                  style={{
                    height: "2rem",
                    width: "10rem",
                    margin: "0px",
                    marginBottom: "1rem",
                    padding: "10px",
                    textAlign: "center",
                    lineHeight: "10px",
                  }}
                  onClick={() => handleClose(data._id)}
                >
                  {" "}
                  Close{" "}
                </button>
                <Link
                  to="/events"
                  state={{
                    ngodata: data
                  }}
                  className="thm-btn"
                  style={{
                    height: "2rem",
                    width: "10rem",
                    margin: "0px",
                    marginBottom: "1rem",
                    padding: "10px",
                    textAlign: "center",
                    lineHeight: "10px",
                  }}
                >
                  {" "}
                  Add Event
                </Link>

                <Link
                  to="needsform"
                  state={{
                    ngodata: data
                  }}
                  className="thm-btn"
                  style={{
                    height: "2rem",
                    width: "10rem",
                    margin: "0px",
                    marginBottom: "1rem",
                    padding: "10px",
                    textAlign: "center",
                    lineHeight: "10px",
                  }}
                >
                  {" "}
                  Add your needs
                </Link>
              </div>
            ) : (
              <button
                className="thm-btn"
                style={{
                  height: "2rem",
                  width: "10rem",
                  margin: "0px",
                  marginBottom: "1rem",
                  padding: "10px",
                  textAlign: "center",
                  lineHeight: "10px",
                }}
                onClick={() => handleOpen(data._id)}
              >
                Open
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Campaign;
