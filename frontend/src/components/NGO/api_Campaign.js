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
  }, [data.raised, data.goal]);  return (
    <div className="col-xl-4 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="100ms">
      {console.log(data.image)}

      <div className="popular-causes__sinlge">
        <div className="popular-causes__img">
          <img src={data.image} alt={data.name} style={{height: "20rem", width: "100%"}} />
          <div className="popular-causes__category">
            <p>{data.category}</p>
          </div>
        </div>
        <div className="popular-causes__content" style={{height: "35rem"}}>
          <div className="popular-causes__title">
            <h3>
              {data.Campaign}
              <a href={data.link}>{data.campagainname}</a>
            </h3>
            <p  style={{fontSize: '12px', height:"100% "}}>{data.desc}</p>
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
            <div className="text-center more-post__btn">
            <a href="#" className="thm-btn" style={{height:"2rem",width:"10rem" , margin:"0px", padding:"10px", textAlign:"center", lineHeight:"10px"}}>
              Donate
            </a>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Campaign;
