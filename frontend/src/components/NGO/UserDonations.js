import React, { useState, useEffect, useRef } from 'react';

const UserDonations = ({ data, goal }) => {
    const [percentage, setPercentage] = useState(0);
    const barInnerRef = useRef(null);
    useEffect(() => {
        const calculatedPercentage = Math.floor((data.donationAmount / goal) * 100);
        setPercentage(calculatedPercentage)
        if(barInnerRef.current) {
          barInnerRef.current.classList.add('counted')
        }
      }, [data.donationAmount, goal]);
    return (
        <div>
                 <div className="popular-causes__progress UserNgoProgress" style={{paddingTop:"0"}}>
                <img src='/assets/images/users/u0.png' alt={data.username} style={{height: "5rem"}} /> 
                {data.username}
              
                    
            <div className="bar">
              <div className="bar-inner count-bar" ref={barInnerRef} style={{ width: `${percentage}%`}}>
           
              </div>
            </div>
            <div className="popular-causes__goals" style={{marginBottom: "0" , paddingBottom: "0"}}>
              <p>
                <span>Rs {data.donationAmount}</span> Raised
              </p>
              <p>
                <span>Rs {goal}</span> Goal
              </p>
            </div>

                            </div>
        </div>
    )
}
export default UserDonations;