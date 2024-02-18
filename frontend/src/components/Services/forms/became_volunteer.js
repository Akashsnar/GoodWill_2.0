import React from 'react'
import NavBar from '../../navbar/Navbar'

function became_volunteer() {
    return (
<>
<NavBar/>
        <div className="bg-gray-100 flex bg-local mt-[5rem]">
            <div className="bg-gray-100 mx-auto max-w-6xl bg-white py-20 px-12 lg:px-24 shadow-xl mb-24">
                <form>
                    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
                        <div className="-mx-3 md:flex mb-6">
                            <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="company">
                                   Name*
                                </label>
                                <input className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3" id="company" type="text" placeholder="Name" />
                                <div>
                                    <span className="text-red-500 text-xs italic">
                                        Please fill out this field.
                                    </span>
                                </div>
                            </div>
                            <div className="md:w-1/2 px-3">
                                <label className="uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="title">
                                  Email*
                                </label>
                                <input className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3" id="title" type="text" placeholder="email@gmail.com" />
                            </div>
                        </div>
                       
                        <div className="-mx-3 md:flex mb-2">
                            <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="location">
                                    Location*
                                </label>
                                <div>
                                    <select className="w-full bg-gray-200 border border-gray-200 text-black text-xs py-3 px-4 pr-8 mb-3 rounded" id="location">
                                        <option>Pune</option>
                                        <option>Mumbai</option>
                                        <option>Chennai</option>
                                        <option>remote</option>

                                    </select>
                                </div>
                            </div>
                            <div className="md:w-1/2 px-3">
                                <label className="uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="job-type">
                                    Job Type*
                                </label>
                                <div>
                                    <select className="w-full bg-gray-200 border border-gray-200 text-black text-xs py-3 px-4 pr-8 mb-3 rounded" id="job-type">
                                        <option>Full-Time</option>
                                        <option>Part-Time</option>
                                        <option>Internship</option>
                                    </select>
                                </div>
                            </div>
                          
                        </div>
                        <div className="-mx-3 md:flex mb-6">
                            <div className="md:w-full px-3">
                                <label className="uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="application-link">
                                    Motivation
                                </label>
                                <input className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3" id="application-link" type="text" placeholder="" />
                            </div>
                        </div>
                        <div className="-mx-3 md:flex mt-2">
                            <div className="md:w-full px-3">
                                <button className="md:w-full bg-gray-900 text-white font-bold py-2 px-4 border-b-4 hover:border-b-2 border-gray-500 hover:border-gray-100 rounded-full">
                                    Apply for Volunteer
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}

export default became_volunteer
