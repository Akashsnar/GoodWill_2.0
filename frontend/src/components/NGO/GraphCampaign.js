import React, { useEffect, useState } from "react";
import CanvasJSReact from "@canvasjs/react-charts";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const App = (CampaignName) => {
    console.log("GraphCampaign  ",CampaignName);
    const campaignname=CampaignName.CampaignName;
  const [donationData, setDonationData] = useState([]);
  const [totalDonation, setTotalDonation] = useState(0);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(
            "http://localhost:4000/sitedata/donationsCampaign", {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ campaignname })
              });
          const data = await response.json();
          setDonationData(data);

          console.log("donation response",data);
          // Calculate total donation
          const total = data.reduce(
            (acc, donation) => acc + parseInt(donation.donationAmount),
            0
          );
          setTotalDonation(total);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }, []);
  // const dummyData = [
  //   { x: new Date(2022, 10), y: 700 },
  //   { x: new Date(2022, 11), y: 1500 },
  //   { x: new Date(2023, 0), y: 1200 },
  //   { x: new Date(2023, 1), y: 1200 },
  //   { x: new Date(2023, 2), y: 1500 },
  //   { x: new Date(2023, 3), y: 2600 },
  //   { x: new Date(2023, 4), y: 2500 },
  //   { x: new Date(2023, 5), y: 6500 },
  //   { x: new Date(2023, 6), y: 3500 },
  //   { x: new Date(2023, 7), y: 2300 },
  //   { x: new Date(2023, 8), y: 4700 },
  //   { x: new Date(2023, 9), y: 2800 },
  //   { x: new Date(2023, 10), y: 2500 },
  //   { x: new Date(2023, 11), y: 1100 },
  // ];
  // const totalDonation = dummyData.reduce(
  //   (total, dataPoint) => total + dataPoint.y,
  //   0
  // );

    const dummyData = donationData.map((donation) => ({
      x: new Date(donation.createdAt),
      y: parseInt(donation.donationAmount),
    }));

  const options = {
    theme: "light1",
    animationEnabled: true,
    zoomEnabled: true,
    exportFileName: "DonationGraph",
    exportEnabled: true,
    backgroundColor: "transparent",
    title: {
      text: `Monthly Donations - Total: ₹${totalDonation}`,
      fontColor: "#ff9d00",
    },
    axisX: {
      valueFormatString: "MMM YYYY",
      gridThickness: 0,
    },
    axisY: {
      title: "Donation Amount (in Ruppees)",
      prefix: "₹",
      gridThickness: 0,
    },
    data: [
      {
        type: "area",
        dataPoints: dummyData,
      },
    ],
  };
  const chartContainerStyle = {
    width: "60vw",
    height: "35vh",
  };

  return (
    <div>
      <center>
    <div style={chartContainerStyle}>
      <CanvasJSChart options={options} />
    </div>
    </center>
    </div>
  );
};

export default App;