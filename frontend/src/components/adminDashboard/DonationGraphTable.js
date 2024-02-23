import React, { useEffect, useState } from "react";
import Graph from "./Graph";
import DonationsTable from "./tables/DonationsTable";
import Sidebar from "./Sidebar";

function DonationGraphTable() {
    
  return (
    <div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="mainContainer">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="mainContent">
          <center>
            <Graph />
          </center>
          <br />
      <br />
      <br />
          <DonationsTable sidebar={false} />
        </div>
      </div>
    </div>
  );
}
export default DonationGraphTable;
