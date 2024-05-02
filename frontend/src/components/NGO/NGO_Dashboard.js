import React, { useState, useEffect, useRef  } from 'react';
import NGO_Dashboard_form from './Ngo_DashboardForm';
import { useDispatch, useSelector } from 'react-redux';
import GetUserNGO from './GetUserNGO';
import GraphNGO from "./GraphNGO"

function NGODashboard() {
  const Ngoname = useSelector((state) => state.auth.name);
  console.log(Ngoname)
  const Email = useSelector((state) => state.auth.email)
  console.log(Email)
  const [status, setStatus] = useState('ongoing'); // Default status is 'ongoing'

  const handleStatusChange = (newStatus) => {
    // console.log(newStatus);
    setStatus(prevStatus => prevStatus === newStatus ? 'ongoing' : newStatus);
    // console.log(status);
  };
  console.log(status);

  return (
    <div style={{ backgroundColor: 'white', paddingTop: '6rem', display: 'flex' }}>
      <div role="navigation" style={{ width: '250px', padding: '20px', paddingTop: '10%', transition: 'width 0.3s ease' }}>
        <ul className="nav" id="side-menu">
          <li className="charts-item" onClick={() => handleStatusChange('ongoing')} style={{cursor: 'pointer'}}>
            <i className="fa fa-list"></i>Ongoing Campaigns
          </li>
          <li className="charts-item" onClick={() => handleStatusChange('complete')} style={{cursor: 'pointer'}}>
            <i className="fa fa-check-circle"></i>Complete Campaigns
          </li>
          <li className="charts-item" onClick={() => handleStatusChange('closed')} style={{cursor: 'pointer'}}>
            <i className="fas fa-times-circle"></i> Closed Campaigns
          </li>
        </ul>
      </div>

      <div className='ml-[8rem]'>
        <div className="block-title text-center">
          <h4 className="ngolink" style={{ marginBottom: "10px" }}>Ngoname</h4>
          <h2>Campaigns</h2>
        </div>

        <GetUserNGO mode={'ngodash'} ngoname={Ngoname} status={status} />
        <GraphNGO Ngoname={Ngoname} />
        <NGO_Dashboard_form Ngoname={Ngoname} />
      </div>
    </div>
  )
}

export default NGODashboard;
