import React, { useState, useEffect, useRef } from 'react';

const UserdonationCampaigns = ({ data }) => {
    const [percentage, setPercentage] = useState(0);
    const barInnerRef = useRef(null);
    const [campaign, setCampaign] = useState(null);

    useEffect(() => {
        const fetchCampaignDetails = async () => {
          try {
            const response = await fetch(`http://localhost:4000/sitedata/campaign/${data.campaignName}`);
            if (response.ok) {
              const campaignData = await response.json();
              setCampaign(campaignData);
            } else {
              console.error('Error fetching user details:', response.statusText);
            }
          } catch (error) {
            console.error('Error fetching user details:', error);
          }
        };
    
        fetchCampaignDetails();
      }, []);

    useEffect(() => {
        if (campaign && data) {
            const calculatedPercentage = Math.floor((data.donationAmount / campaign.goal) * 100);
            setPercentage(calculatedPercentage);
            if (barInnerRef.current) {
                barInnerRef.current.classList.add('counted');
            }
        }
    }, [data, campaign]);

    if (!campaign) {
        return null; // or you can render a loading spinner or message
    }

    return (
        <div>
            <div className="popular-causes__progress UserNgoProgress pb-5" style={{paddingTop: "0"}}>
                <div style={{display:"flex"}}>
               <div>
               <img src={campaign.image} alt={data.campaignName} style={{height: "10rem"}} /> 
                {data.campaignName}
               </div>
               <div>
               <h2 className='font-serif text-2xl pt-3'> <center>Ngo Name : {campaign.ngoname}</center></h2>
                {campaign.desc}
               </div>
               </div>

              
                    
                <div className="bar">
                    <div className="bar-inner count-bar" ref={barInnerRef} style={{ width: `${percentage}%`}}>
                        {/* <div className="count-text">{percentage}%</div> */}
                    </div>
                </div>
                <div className="popular-causes__goals" style={{marginBottom: "0" , paddingBottom: "0"}}>
                    <p>
                        <span>Rs. {data.donationAmount}</span> Raised
                    </p>
                    <p>
                        <span>Rs. {campaign.goal}</span> Goal
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserdonationCampaigns;
