import React from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from "sweetalert2";

const Eventpage = () => {
    const { state } = useLocation();

const data= state.event;
const userid=state.userid;

const Addusers=async (eventid)=>{
    try {

    

      Swal.fire({
        title: "Are you sure?",
        text: "You will be participated in event on confirming",
        icon: "",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "yeah",
      }).then(async (result) => {

        const formDatas = { eventid: eventid, userid: userid}
        const response = await axios.post(
            "http://localhost:4000/sitedata/event/addusers",
            formDatas, {
              withCredentials:true,
          }
          );

        if (result.isConfirmed && response.status==200) {
          Swal.fire({
            title: "Success!",
            text: "You are participated.",
            icon: "success",
          });
        //   console.log("Form submitted with data:", formData);
        //   await donationInfo(formData);
        }
      });
      
      
    //   console.log("data saved", response);
    } catch (error) {
      console.log(error);
    }
  }


    return (
        <div>
            <div>
            
                {/* Section 2 */}
                <section className="px-2 py-32 bg-white md:px-0">
                    <div className="container items-center max-w-6xl px-8 mx-auto xl:px-5">
                        <div className="flex flex-wrap items-center sm:-mx-3">
                            <div className="w-full md:w-1/2 md:px-3">
                                <div className="w-full pb-6 space-y-6 sm:max-w-md lg:max-w-lg md:space-y-4 lg:space-y-8 xl:space-y-9 sm:pr-5 lg:pr-0 md:pb-0">
                                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl">
                                        <span className="block xl:inline">{data.EventName}</span>
                                        {/* <span className="block text-indigo-600 xl:inline">Help You Build Faster.</span> */}
                                    </h1>
                                    <p className="mx-auto text-base text-gray-500 sm:max-w-md lg:text-xl md:max-w-3xl">{data.Details}</p>
                                    <div className='flex justify-between'>
                                        <p>Location:{' '} {data.Location}</p>
                                        <p>Duration: {data.Duration}</p>
                                    </div>
                                    <div className='flex justify-between'>
                                        <p>campaignName: {data.campaignName}</p>
                                        <p>Ngoname: {data.NgoName}</p>
                                    </div>

                                    <div className="relative flex flex-col sm:flex-row sm:space-x-4">
                                        <button onClick={()=>Addusers(data._id)} className="flex items-center w-full px-6 py-3 mb-3 text-lg text-white bg-orange-600 rounded-md sm:mb-0 hover:bg-indigo-700 sm:w-auto">
                                            Apply to join Event
                                            {/* <svg xmlns="http://www.w3.org/2000/svg className="w-5 h-5 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1={5} y1={12} x2={19} y2={12} /><polyline points="12 5 19 12 12 19" /></svg> */}
                                        </button>
                                       
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2">
                                <div className="w-full h-auto overflow-hidden rounded-md shadow-xl sm:rounded-xl">
                                    <img src={data.EventPic} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Section 3 */}
               
            </div>










        </div>
    )
}

export default Eventpage
