import React, { useState, useEffect, useRef } from 'react';
import UserDonations from './UserDonations';
import UserReviews from './UserReview';
import GraphCampaign from './GraphCampaign';
import Events from './displayevents';
import { useParams } from 'react-router-dom';


// import NGO_Dashboard_form from './Ngo_DashboardForm';
import { useDispatch, useSelector } from 'react-redux';

function CampaignDashboard() {
  console.log("hj");
  const { campaignname } = useParams();
  console.log("camapgain name", campaignname);
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
  const Email = useSelector((state) => state.email)
  console.log(Email)

  const [userDonations, setUserDonations] = useState();
  const [userReviews, setUserReviews] = useState();
  const [percentage, setPercentage] = useState(0);
  const [NeedsDonations, setNeedsDonations] = useState();


  const barInnerRef = useRef(null);


  useEffect(() => {
    const fetchReviewDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/sitedata/reviews/${campaignname}`);
        if (response.ok) {
          const ReviewData = await response.json();
          setUserReviews(ReviewData);
          // console.log(userReviews);
        } else {
          console.error('Error fetching user details:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchReviewDetails();
  }, []);


  useEffect(() => {
    const fetchUserDonations = async () => {
      try {
        const response = await fetch('http://localhost:4000/sitedata/donationsCampaign', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ campaignname })
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        setUserDonations(responseData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUserDonations();
  }, []);

  const [events, setEvents] = useState();

  // if(campaign){
  useEffect(() => {
    const fetchEventsDetails = async () => {
      try {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Ngoname: campaign.ngoname, campaignname: campaignname })
        };
        const response = await fetch('http://localhost:4000/sitedata/eventfromcampaign', requestOptions);
        if (response.ok) {
          const eventData = await response.json();
          setEvents(eventData);
          console.log("Event data is from here");
          console.log(events);
        } else {
          console.error('Error fetching events:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEventsDetails();
  }, [campaign, campaignname]);
  // }




  // console.log("Ngo name here here here here "+campaign.ngoname);


  useEffect(() => {
    const fetchNeedsDonations = async () => {
      try {
        console.log("Inside userDonation fetch");
        const response = await fetch(`http://localhost:4000/sitedata/donationneeds/${campaignname}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // console.log("UserDo")
        const data = await response.json();
        console.log(data);
        const { donationsneeds, totaldonation } = data;
        console.log('Needs Donations:', donationsneeds);
        setNeedsDonations(donationsneeds);
        console.log('Total Needs Donation:', totaldonation);
        // setTotalNeedsDonations(totaldonation)
      } catch (error) {
        console.error('Error fetching needs data:', error);
      }
    };
    fetchNeedsDonations();
  }, []);


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
      {(campaign && userReviews && events) ? (<>
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
                        <span>Rs {campaign.raised}</span> Raised
                      </p>
                      <p>
                        <span>Rs {campaign.goal}</span> Goal
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
          <div>
            <h4 class="servicesHeading ngolink">Events</h4>
            <center>
              {events.map(event => (
                <Events event={event} />
              ))}
            </center>
          </div>
          <center>
            <GraphCampaign CampaignName={campaign.campagainname} />
          </center>

          {/* <NGO_Dashboard_form Ngoname={Ngoname}/> */} </>) : (
          <p>Loading ...</p>
        )}


        <div className='mt-[12rem]'>
          <h2 className="font-serif text-3xl pb-3">Needs Donated</h2>

          {NeedsDonations ? NeedsDonations.map(NeedDonation => (
            NeedDonation.ProductDetails.map((product) => (
              <table class="min-w-full table-auto text-center border-collapse border border-gray-300">
                <thead class="bg-gray-200">
                  <tr>
                    <th class="border border-gray-300 p-4">Product Image</th>
                    <th class="border border-gray-300 p-4">Product Name</th>
                    <th class="border border-gray-300 p-4">Price</th>
                    <th class="border border-gray-300 p-4">NGO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-gray-300 p-4"><img src={product.image} alt="Product Image" class="h-20 mx-auto" /></td>
                    <td class="border border-gray-300 p-4">{product.title}</td>
                    <td class="border border-gray-300 p-4">{product.price}</td>
                    <td class="border border-gray-300 p-4">{NeedDonation.Ngoname}</td>
                  </tr>
                </tbody>
              </table>
            ))
          )) : <h1>No Need Donation by you</h1>}
          {/* <p className="mt-2 text-2xl text-center text-green-600">Total Need Donation Amount: {totalNeedsDonation}</p> */}

        </div>
      </div>
      )
}

      export default CampaignDashboard;