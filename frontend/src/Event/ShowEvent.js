import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { GetEvents } from '../services/authService'


const ShowEvent = () => {
    const [eventdata, seteventdata] = useState()
    const { state } = useLocation();
    console.log(state);

    // ngoname, campagainname

    useEffect(() => {
        async function fetchData() {
            //     const formDatas = new FormData();
            //     formDatas.append('ngoname', state.ngoname);
            //    formDatas.append('campagainname', state.campagainname);
            const formDatas = { NgoName: state.ngodata.ngoname }

            //    const ngoname=state.ngoname;
            //    console.log("ngoname", ngoname);
            const response = await GetEvents(formDatas);
            console.log("event details", response);
            seteventdata(response)
        }
        console.log("this are events");
        fetchData();

    }, [])

    return (
        <div>

            <div className="container mt-2">
                <div className="row">
                    {eventdata?eventdata.map((event) =>

                        <div className="col-md-4 col-sm-6 item">
                            <div className="card item-card card-block">
                                <img src="https://static.pexels.com/photos/7096/people-woman-coffee-meeting.jpg" alt="Photo of sunset" />
                                <h3 className="item-card-title mt-3 mb-1">{event.EventName}</h3>
                                <p className="mb-3">campaign : {event.campaignName}</p>
                                <div className='flex justify-between'>
                                <p><i className="fa-light fa-location-dot"></i> {event.Location}</p>
                               <p> <i class="fa-duotone fa-clock"></i> {event.Duration}</p>
                                </div>

                                <div className='flex justify-between bg-[#eb9800] pl-6 pr-6 relative bottom-[-2.5rem] left-[-1.2rem] w-[23.5rem] rounded'>
                                <p> From : {event.DateRange.startDate.slice(0, 10)}</p>
                               <p> To: {event.DateRange.endDate.slice(0, 10)}</p>
                                </div>
                            </div> 
                        </div>

                    ):  <h1>No event</h1>}
                </div>
            </div>

        </div>
    )
}

export default ShowEvent
