// Campaign.js
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Campaign = ({ data, mode }) => {
  const [percentage, setPercentage] = useState(0);
  const barInnerRef = useRef(null);

  useEffect(() => {
    console.log(data);
    const calculatedPercentage = Math.floor((data.raised / data.goal) * 100);
    setPercentage(calculatedPercentage);

    if (barInnerRef.current) {
      barInnerRef.current.classList.add("counted");
    }
  }, [data.raised, data.goal]);
  // const image=`http://localhost:4000/${data.image}`

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
                    <Link to={"/Campaign"}>
                      <h4 style={{ paddingLeft: "5rem" }} className="ngolink">
                        {data.campagainname}
                      </h4>
                    </Link>
                  )}
                  <p className="feature-p">{data.desc}</p>
                </div>
              </div>
            </div>
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
                    <span>${data.raised}</span> Raised
                  </p>
                  <p>
                    <span>${data.goal}</span> Goal
                  </p>
                </div>
                <div
                  className="text-center more-post__btn Ngobtn"
                  style={{ marginTop: "1rem", display: "flex" }}
                >
                  <Link
                    to="/givereview"
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
                    Give Review
                  </Link>
                  <Link
                    to="/donation"
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Campaign;
