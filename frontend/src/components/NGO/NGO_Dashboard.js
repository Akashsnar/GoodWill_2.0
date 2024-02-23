import React, { useState, useEffect, useRef } from 'react';
// import UserDonations from './UserDonations';
// import UserReviews from './UserReview';
import NGO_Dashboard_form from './Ngo_DashboardForm';
import { useDispatch, useSelector } from 'react-redux';
import Campaign_Dashboard from './Campaign_Dashboard';
import GetUserNGO from './GetUserNGO';

function NGODashboard() {
  // const percentage=36;

  const Ngoname = useSelector((state) => state.auth.name);
  console.log(Ngoname)
  const Email = useSelector((state) => state.auth.email)
  console.log(Email)
// console.log(isLoggedIn)



  // const [percentage, setPercentage] = useState(0);
  // const data = {
  //   raised: 22000,
  //   goal: 30000
  // }
  // const barInnerRef = useRef(null);

  // useEffect(() => {
  //   // Calculate the percentage based on raised and goal
  //   const calculatedPercentage = Math.floor((data.raised / data.goal) * 100);
  //   setPercentage(calculatedPercentage)

  //   if (barInnerRef.current) {
  //     barInnerRef.current.classList.add('counted')
  //   }
  // }, [data.raised, data.goal]);


  return (
    <div style={{ backgroundColor: 'white', paddingTop: '6rem' }}>
      <div class="block-title text-center">
        <h4 className="ngolink" style={{ marginTop: "130px", marginBottom: "10px" }}>{Ngoname}</h4>
        <h2>Campaigns</h2>
      </div>

      {/* <section class="feature-one features-service" style={{ marginTop: "0", padding: "0" }}>
        <div class="container">
          <div class="feature-one__inner" style={{ padding: "1rem" }}>
            <div class="row">
              <h3 class="servicesHeading" style={{ fontSize: "" }}>Total Donations</h3>
              <div className="popular-causes__progress UserNgoProgress">
                <div className="bar">
                  <div className="bar-inner count-bar" ref={barInnerRef} style={{ width: `${percentage}%` }}>
                    <div className="count-text">{percentage}%</div>
                  </div>
                </div>
                <div className="popular-causes__goals" style={{ marginBottom: "0", paddingBottom: "0" }}>
                  <p>
                    <span>${data.raised}</span> Raised
                  </p>
                  <p>
                    <span>${data.goal}</span> Goal
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section> */}

      <GetUserNGO mode={'ngodash'} ngoname = {Ngoname} />
      {/* <Campaign_Dashboard /> */}
      <NGO_Dashboard_form Ngoname={Ngoname}/>

    </div>
  )
}

export default NGODashboard;