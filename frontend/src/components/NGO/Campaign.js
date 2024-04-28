// Campaign.js
import React, { useState, useEffect, useRef } from 'react';

const Campaign = ({ data }) => {
  const [percentage, setPercentage] = useState(0);
  const barInnerRef = useRef(null);

  useEffect(() => {

    const calculatedPercentage = Math.floor((data.raised / data.goal) * 100);
    setPercentage(calculatedPercentage);

    if(barInnerRef.current) {
      barInnerRef.current.classList.add('counted')
    }
  }, [data.raised, data.goal]);

  return (
    <div className="col-xl-4 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="100ms">

      <div className="popular-causes__sinlge">
        <div className="popular-causes__img">
          <img src={data.imageSrc} alt={data.title} />
          <div className="popular-causes__category">
            <p>{data.category}</p>
          </div>
        </div>
        <div className="popular-causes__content">
          <div className="popular-causes__title">
            <h3>
              <a href="campaign-details.html">{data.title}</a>
            </h3>
            <p style={{fontS}}>{data.description}</p>
          </div>
          <div className="popular-causes__progress">
            <div className="bar">
              <div className="bar-inner count-bar" ref={barInnerRef} style={{ width: `${percentage}%`}}>
                <div className="count-text">{percentage}%</div>
              </div>
            </div>
            <div className="popular-causes__goals">
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
  );
};

export default Campaign;
