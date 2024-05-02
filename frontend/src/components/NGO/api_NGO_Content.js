import React, { useState, useEffect } from 'react';
import Campaign from './api_Campaign';
const Backend_URL = "http://localhost:4000";

function NGOContent() {
   
      const [campaigns, setCampaigns] = useState([]);
      const [visibleCampaigns, setVisibleCampaigns] = useState(3);
      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL+'/sitedata/ngodetails');
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log(data)
            setCampaigns(data);
          } catch (error) {
            console.error('Error:', error);
          }
        };
    
        fetchData();
      }, []);
      const loadMore = () => {
        // Increase the number of visible campaigns
        setVisibleCampaigns(prevVisibleCampaigns => prevVisibleCampaigns + 3);
      };
      return (
        <div>
 <section className="popular-causes-three campaign-page">
        <div className="container">
          <div className="row">
    
          {campaigns.slice(0, visibleCampaigns).map(campaign => (
              <Campaign key={campaign._id} data={campaign} />
            ))}
            
          </div>
          {visibleCampaigns < campaigns.length && (
          <div className="text-center more-post__btn">
            <a onClick={loadMore} className="thm-btn">
              Load More
            </a>
          </div>
          )}
        </div>
      </section>
</div>
    )
}
export default NGOContent