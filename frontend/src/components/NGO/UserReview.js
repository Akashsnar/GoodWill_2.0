import React, { useState, useEffect, useRef } from 'react';

const UserReviews = ({ data }) => {
    const stars=[];
    for(let i=0;i<data.rating;i++){
        stars.push(<i className="fas fa-star"></i>);
    }
    for(let i=0;i<(5-data.rating);i++){
        stars.push(<i className="far fa-star"></i>)
    }

    return (
        <div>
                 <div className="popular-causes__progress UserNgoProgress" style={{paddingTop:"0"}}>
                    <div className='DashReview'>
                        <div>
                        <p>
                        <img src= '/assets/images/users/u0.png' alt={data.author} style={{height: "5rem"}} />
                        </p>
                        <p>
                        {data.author}
                        </p>
                        </div>
                        <div>
                        <p>{stars}</p>
                        <p>
                        {data.text}
                        </p>
                        </div>
                    </div>
                
                 

                {/* Example JSX in a component file */}
                {/* <img src="assets/images/users/u0.png" alt="User Image" /> */}
            </div>
            <div className="popular-causes__goals" style={{marginBottom: "0" , paddingBottom: "0"}}>
              <p>
                {/* <span>${data.Donated}</span> Raised */}
              </p>
              <p>
                {/* <span>${goal}</span> Goal */}
              </p>
            </div>

                            </div>
        // </div>
    )
}
export default UserReviews;