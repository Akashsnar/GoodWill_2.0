import React, { useState, useEffect, useRef } from 'react';
import UserDonations from './UserDonations';
import UserReviews from './UserReview';
import NGO_Dashboard_form from './Ngo_DashboardForm';
import { useDispatch, useSelector } from 'react-redux';

function NGODashboard() {
  // const percentage=36;

  const Ngoname = useSelector((state) => state.name);
  console.log(Ngoname)
  const Email = useSelector((state) => state.email)
  console.log(Email)

  const initialUserDonations = [
    {
      id: 1,
      Username: "Swastik",
      Donated: 5000,
      profile: "assets/images/users/u0.png"
    }, {
      id: 2,
      Username: "Aakash",
      Donated: 6000,
      profile: "assets/images/users/u1.png"

    }, {
      id: 3,
      Username: "Stephen",
      Donated: 2000,
      profile: "assets/images/users/u2.png"
    },
    {
      id: 4,
      Username: "Johnny",
      Donated: 1500,
      profile: "assets/images/users/u0.png"
    }
    , {
      id: 5,
      Username: "Raj",
      Donated: 3200,
      profile: "assets/images/users/u0.png"
    }, {
      id: 6,
      Username: "Dhruv",
      Donated: 4500,
      profile: "assets/images/users/u0.png"
    }
    // Add more campaigns as needed
  ];
  const initialUserReviews = [
    {
      id: 1,
      name: "Swastik",
      Review: 5,
      Comment: "Lorem ipsum dolor sit amet, consectetur adipisicing",
      src: "assets/images/users/u0.png"
    }, {
      id: 2,
      name: "Aakash",
      Review: 3,
      Comment: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Totam, consequuntur.",
      src: "assets/images/users/u1.png"

    }, {
      id: 3,
      name: "Stephen",
      Review: 2,
      Comment: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, maiores!",
      src: "assets/images/users/u2.png"
    },
    {
      id: 4,
      name: "Johnny",
      Review: 5,
      Comment: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, cum!",
      src: "assets/images/users/u0.png"
    }
    , {
      id: 5,
      name: "Raj",
      Review: 3,
      Comment: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
      src: "assets/images/users/u0.png"
    }, {
      id: 6,
      name: "Dhruv",
      Review: 4,
      Comment: "Lorem ipsum, dolor sit amet consectetur adipisicing.",
      src: "assets/images/users/u0.png"
    }
    // Add more campaigns as needed
  ];
  const [userDonations, setUserDonations] = useState(initialUserDonations);
  const [userReviews, setUserReviews] = useState(initialUserReviews);
  const [percentage, setPercentage] = useState(0);
  const data = {
    raised: 22000,
    goal: 30000
  }
  const barInnerRef = useRef(null);

  useEffect(() => {
    // Calculate the percentage based on raised and goal
    const calculatedPercentage = Math.floor((data.raised / data.goal) * 100);
    setPercentage(calculatedPercentage)

    if (barInnerRef.current) {
      barInnerRef.current.classList.add('counted')
    }
  }, [data.raised, data.goal]);


  return (
    <div style={{ backgroundColor: 'white', paddingTop: '6rem' }}>
      <div>
        <h1 class="servicesHeading" style={{ marginTop: "130px", marginBottom: "10px" }}>{Ngoname}</h1>
      </div>
      <section class="feature-one features-service" style={{ marginTop: "0", padding: "0" }}>
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
      </section>

      <div class="ngo-dash-user">
        <section class="feature-one features-NgoDashboard" style={{ marginTop: "2rem", padding: "0" }}>
          <div class="container">
            <div class="feature-one__inner" style={{ paddingTop: "5rem" }}>
              {/* <div class="row"> */}
              <h3 class="servicesHeading">User Donations</h3>
              {userDonations.map(UserDonation => (
                <UserDonations key={UserDonation.id} data={UserDonation} goal={data.goal} />
              ))}

              {/* </div> */}
            </div>
          </div>
        </section>

        <section class="feature-one features-NgoDashboard" style={{ marginTop: "2rem", padding: "0" }}>
          <div class="container">
            <div class="feature-one__inner" style={{ paddingTop: "5rem" }}>
              {/* <div class="row"> */}
              <h3 class="servicesHeading">User Reviews</h3>
              {userReviews.map(userReview => (
                <UserReviews key={userReview.id} data={userReview} />
              ))}

              {/* </div> */}
            </div>
          </div>
        </section>

      </div>

      <NGO_Dashboard_form Ngoname={Ngoname}/>

    </div>
  )
}

export default NGODashboard;