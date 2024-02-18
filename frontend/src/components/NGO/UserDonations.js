import React, { useState, useEffect, useRef } from 'react';

const UserDonations = ({ data, goal }) => {
    const [percentage, setPercentage] = useState(0);
    const barInnerRef = useRef(null);
    useEffect(() => {
        const calculatedPercentage = Math.floor((data.Donated / goal) * 100);
        setPercentage(calculatedPercentage)
        if(barInnerRef.current) {
          barInnerRef.current.classList.add('counted')
        }
      }, [data.raised, goal]);
    return (
        <div>
                 <div className="popular-causes__progress UserNgoProgress" style={{paddingTop:"0"}}>
                <img src={data.profile} alt={data.name} style={{height: "5rem"}} /> 
                {data.Username}
              
                    
            <div className="bar">
              <div className="bar-inner count-bar" ref={barInnerRef} style={{ width: `${percentage}%`}}>
                {/* <div className="count-text">{percentage}%</div> */}
              </div>
            </div>
            <div className="popular-causes__goals" style={{marginBottom: "0" , paddingBottom: "0"}}>
              <p>
                <span>${data.Donated}</span> Raised
              </p>
              <p>
                <span>${goal}</span> Goal
              </p>
            </div>

                            </div>
        </div>
    )
}
export default UserDonations;