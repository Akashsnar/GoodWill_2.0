import React, { useEffect, useState } from "react";
// import './onlystyle.css'
import { useParams } from "react-router-dom";
import UserdonationCampaigns from './UserdonationCampaigns' ;

function Userprofile() {
  const { username } = useParams();
  console.log(username);
  const [user, setUser] = useState();
  const [userDonations, setUserDonations] = useState();
  const [totalDonation ,setTotalDonations]=useState();
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/userinfo/${username}`
        );
        if (response.ok) {
          const userData = await response.json();
          console.log("userdata", userData);
          setUser(userData);
        } else {
          console.error("Error fetching user details:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [username]);



  // useEffect(() => {
  //   const fetchUserDetails = async () => {
  //     try {
  //       const response = await fetch(
  //         `http://localhost:4000/userinfo/donation/${username}`
  //       );
  //       if (response.ok) {
  //         const userData = await response.json();
  //         console.log("userdata", userData);
  //         setUser(userData);
  //       } else {
  //         console.error("Error fetching user details:", response.statusText);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user details:", error);
  //     }
  //   };

  //   fetchUserDetails();
  // }, [username]);
  useEffect(() => {
    const fetchUserDonations = async () => {
      try {
        console.log("Inside userDonation fetch");
        const response = await fetch('http://localhost:4000/userinfo/donationsUsername', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username })
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // console.log("UserDo")
        const data = await response.json();
        console.log(data);
        const { donations, totaldonation } = data;
        console.log('Donations:', donations);
        setUserDonations(donations);
        console.log('Total Donation:', totaldonation);
        setTotalDonations(totaldonation)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchUserDonations();
  }, []);
  

  // console.log(user);
  if (user) {
    console.log(user.name);
  } else {
    console.log("User data is not available yet.");
  }

  return (

    <div style={{ margin: "10vh" }}>
      {user && userDonations ? (
        <section class="feature-one features-service">
          <div class="container">
            <div class="feature-one__inner" style={{ padding: "20px" }}>
              <div class="row nonProfitContainer">
                <div
                  style={{
                    display: "flex",
                    marginTop: "2rem",
                    paddingTop: "2rem",
                  }}
                  className="block-title UserNgoContainer"
                >
                  {/* <div style={{width:"100%"}}> */}
              
                  <img
                    src={(user.profilePic!='')? `http://localhost:4000/uploads/${user.profilePic}`:'https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg'}
                    alt="Iamge alt"
                    srcset=""
                    style={{
                      width: "15rem",
                      height: "15rem",
                      border: "solid 10px black",
                      borderRadius: "50%",
                    }}
                  />
                  {/* </div> */}
                  <div style={{ textAlign: "center" }}>
                    <h4
                      style={{ paddingLeft: "0rem", textAlign: "center" }}
                      className="ngolink"
                    >
                      {user.name}
                    </h4>
                    <p className="feature-p">{user.details}</p>
                    <div style={{ display: "flex", paddingTop: "2rem" }}>
                      <div style={{ color: "black", width: "20rem" }}>
                        <i className="fa fa-envelope" aria-hidden="true"></i>{" "}
                        {user.Email}
                      </div>
                      <div style={{ color: "black", width: "20rem" }}>
                        <i class="fa fa-phone" aria-hidden="true"></i>{" "}
                        {user.phone}
                      </div>
                      <div style={{ color: "black", width: "20rem" }}>
                        <i class="fa fa-calendar" aria-hidden="true"></i>{" "}
                        {user.dob}
                      </div>
                    </div>
                    <div style={{ paddingTop: "3rem" }}>
                      <div class="iocn">
                        <i class="fa-sharp fa-treasure-chest"></i>
                      </div>
                      <div class="text" style={{ color: "black" }}>
                        <p></p>
                        <h2 class="counter">Rs {totalDonation}</h2>
                        <p>Total Donations</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2>Campaigns Donated</h2>
            {userDonations.map(UserDonation => (
              // <div>hello</div>
              <UserdonationCampaigns key={UserDonation.id} data={UserDonation} />
                ))}
          </div>
        </section>
      ) : (
        <p>Loading ...</p>
      )}
    </div>
  );
}

export default Userprofile;
