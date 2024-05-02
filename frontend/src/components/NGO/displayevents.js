import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DisplayEvents = ({ event }) => {
    const [showVolunteers, setShowVolunteers] = useState(false);

    // Function to toggle the visibility of the volunteer list
    const toggleVolunteers = () => {
        setShowVolunteers(!showVolunteers);
    };

    return (
        <div>
            <section className="feature-one features-service">
                <div className="container">
                    <div className="feature-one__inner" style={{ padding: "0" }}>
                        <div className="row nonProfitContainer">
                            <div
                                style={{
                                    display: "flex",
                                    marginTop: "2rem",
                                    paddingTop: "2rem",
                                }}
                                className="block-title UserNgoContainer"
                            >
                                <div>
                                    <img
                                        src={event.EventPic}
                                        alt={event.EventName}
                                        srcSet=""
                                        style={{ width: "25rem", height: "15rem" }}
                                        className="ml-3 rounded-4"
                                    />
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <h4 style={{ paddingLeft: "5rem" }} className="ngolink">
                                        {event.EventName}
                                    </h4>
                                    <p className="feature-p">{event.Details}</p>
                                </div>
                            </div>
                        </div>

                        <div
                            className="text-center more-post__btn Ngobtn"
                            style={{ marginTop: "1rem", display: "flex" }}
                        >
                            <p className="thm-btn"
                                style={{
                                    height: "2rem",
                                    width: "15rem",
                                    margin: "0px",
                                    marginBottom: "1rem",
                                    padding: "10px",
                                    textAlign: "center",
                                    lineHeight: "10px",
                                }}
                            >
                                Duration : {event.Duration}
                            </p>
                            <p
                                className="thm-btn"
                                style={{
                                    height: "2rem",
                                    width: "15rem",
                                    margin: "0px",
                                    marginBottom: "1rem",
                                    padding: "10px",
                                    textAlign: "center",
                                    lineHeight: "10px",
                                }}
                            >
                                Start Date : {event.DateRange.startDate.split('T')[0]}
                            </p>
                            <p
                                className="thm-btn"
                                style={{
                                    height: "2rem",
                                    width: "15rem",
                                    margin: "0px",
                                    marginBottom: "1rem",
                                    padding: "10px",
                                    textAlign: "center",
                                    lineHeight: "10px",
                                }}
                            >
                                End Date : {event.DateRange.endDate.split('T')[0]}
                            </p>
                        </div>

                        <div className="flex justify-between">
                            <button className="NGOReport" style={{ textAlign: "right" }} onClick={toggleVolunteers}>
                                Check volunteers
                            </button>
                            </div>
                 
               

                            {showVolunteers && (
                               <div style={{ overflowX: "auto" }}>
                               <table style={{ borderCollapse: "collapse", width: "100%", marginTop: "1rem", }}>
                                   <thead style={{ backgroundColor: "#f2f2f2", }}>
                                       <tr>
                                           <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Name</th>
                                           <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Email</th>
                                       </tr>
                                   </thead>
                                   <tbody>
                                       {/* Loop through ParticipatedUsers and render each user */}
                                       {event.ParticipatedUser.map((user, index) => (
                                           <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white" }}>
                                            <Link to={`/userprofile/${user.name}`}> <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.name}</td></Link>
                                               <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.email}</td>
                                           </tr>
                                       ))}
                                   </tbody>
                               </table>
                           </div>
                            )}
                       </div>
                 </div>
            </section>

        </div>
    );
};

export default DisplayEvents;
