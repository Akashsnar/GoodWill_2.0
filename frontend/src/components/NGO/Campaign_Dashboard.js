import React, { useState, useEffect, useRef } from 'react';
import UserDonations from './UserDonations';
import UserReviews from './UserReview';
import { useParams } from 'react-router-dom';

// import NGO_Dashboard_form from './Ngo_DashboardForm';
import { useDispatch, useSelector } from 'react-redux';

function CampaignDashboard() {
  console.log("hj");
  const { campaignname } = useParams();
  console.log("cmapgain name",campaignname);
  const [campaign, setCampaign] = useState();

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/sitedata/campaign/${campaignname}`);
        if (response.ok) {
          const campaignData = await response.json();
          setCampaign(campaignData);
          console.log(campaignData);
        } else {
          console.error('Error fetching user details:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchCampaignDetails();
  }, []);

  if (campaign) {
    console.log(campaign.campagainname);
  } else {
    console.log("User data is not available yet.");
  }

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
  ];
  const [userDonations, setUserDonations] = useState(initialUserDonations);
  const [userReviews, setUserReviews] = useState(initialUserReviews);
  const [percentage, setPercentage] = useState(0);


  const barInnerRef = useRef(null);


  useEffect(() => {
    if (campaign) {
      const calculatedPercentage = Math.floor((campaign.raised / campaign.goal) * 100);
      if (barInnerRef.current) {
        barInnerRef.current.style.width = `${calculatedPercentage}%`;
        barInnerRef.current.textContent = `${calculatedPercentage}%`;
      }
    }
  }, [campaign]);


  return (
    <div style={{ backgroundColor: 'white', paddingTop: '6rem' }}>
      {campaign ? (<>
        <div class="block-title text-center" style={{ marginBottom: '10rem' }}>
          <h4 class="servicesHeading ngolink" style={{}}>{campaign.campagainname}</h4>
          <div style={{ display: 'flex', justifyContent: "space-evenly" }}>
            <div>
              <h4 class="servicesHeading ngolink">Ngo Name : </h4> <h3 style={{ display: 'inline-block' }}>{campaign.ngoname}</h3>
            </div>
            <div>
              <h4 class="servicesHeading ngolink" style={{ marginTop: "10px", marginBottom: "10px" }}>Category : </h4> <h3 style={{ display: 'inline-block' }}>{campaign.category}</h3>
            </div>
          </div>
          {/* <div style={{textAlign:'center', margin:'10px'}}>
    <img src={campaign.image} alt="" srcset="" width="400rem" className='center' />
    {campaign.desc}
</div>
 */}


          <p style={{ width: '50vw', margin: 'auto', marginBottom: '20px' }}>
            <p style={{ margin: '3rem' }}>{campaign.desc}</p>
            <img src={campaign.image} alt="" srcset="" width="500rem" style={{ margin: 'auto' }} />

          </p>




        </div>
        <section class="feature-one features-service" style={{ marginTop: "50px", padding: "0" }}>
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
                      <span>${campaign.raised}</span> Raised
                    </p>
                    <p>
                      <span>${campaign.goal}</span> Goal
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
                  <UserDonations key={UserDonation.id} data={UserDonation} goal={campaign.goal} />
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

        {/* <NGO_Dashboard_form Ngoname={Ngoname}/> */} </>) : (
        <p>Loading ...</p>
      )}

    </div>
  )
}

export default CampaignDashboard;