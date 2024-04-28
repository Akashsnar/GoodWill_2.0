import React, { useState, useEffect } from 'react';
import Campaign from './Campaign';

function NGOContent() {

  const initialCampaigns = [
    {
      id: 1,
      category: 'Food',
      title: 'Raise Fund for Clean & Healthy Water',
      description: 'Aliq is notm hendr erit a augue insu image pellen tes.',
      raised: 20000,
      goal: 30000,
      imageSrc: 'assets/images/resources/popular-causes-3-img-1.jpg',
    }, {
      id: 2,
      category: 'Education',
      title: 'Our donation is hope for poor childrens',
      description: 'Aliq is notm hendr erit a augue insu image pellen tes.',
      raised: 12700,
      goal: 30000,
      imageSrc: 'assets/images/resources/popular-causes-3-img-1.jpg',
    }, {
      id: 3,
      category: 'Education',
      title: 'Education for Poor Children',
      description: 'Aliq is notm hendr erit a augue insu image pellen tes.',
      raised: 15000,
      goal: 30000,
      imageSrc: 'assets/images/resources/popular-causes-3-img-1.jpg',
    },
    {
      id: 4,
      category: 'Education',
      title: 'Promoting The Rights of Children',
      description: 'Aliq is notm hendr erit a augue insu image pellen tes.',
      raised: 15000,
      goal: 30000,
      imageSrc: 'assets/images/resources/popular-causes-3-img-1.jpg',
    }, {
      id: 5,
      category: 'Education',
      title: 'Fundrising for Early Childhood Rise',
      description: 'Aliq is notm hendr erit a augue insu image pellen tes.',
      raised: 15000,
      goal: 30000,
      imageSrc: 'assets/images/resources/popular-causes-3-img-1.jpg',
    }, {
      id: 6,
      category: 'Education',
      title: 'School Counseling for Children',
      description: 'Aliq is notm hendr erit a augue insu image pellen tes.',
      raised: 15000,
      goal: 30000,
      imageSrc: 'assets/images/resources/popular-causes-3-img-1.jpg',
    }
    // Add more campaigns as needed
  ];



  const [campaigns, setCampaigns] = useState(initialCampaigns);
  return (
    <div>
      <section className="popular-causes-three campaign-page">
        <div className="container">
          <div className="row">
            {campaigns.map(campaign => (
              <Campaign key={campaign.id} data={campaign} />
            ))}
          </div>
          <div className="text-center more-post__btn">
            <a href="#" className="thm-btn">
              Load More
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
export default NGOContent