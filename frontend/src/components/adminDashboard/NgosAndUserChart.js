import React, { useEffect, useState } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import NavAdmin from "./NavAdmin";
import Sidebar from "./Sidebar";
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const NgosAndUserChart = () => {
  const [ngoLength, setNgoLength] = useState(0);
  const [userLength, setUserLength] = useState(0);
  const [campaignLength, setCampaignLength] = useState(0);
  const [eventLength, setEventLength] = useState(0);

  useEffect(() => {
    const fetchNgoData = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/NGOsLength"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setNgoLength(data);
        console.log("NGO Length:", data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    const fetchEventData = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/eventsLength"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setEventLength(data);
        console.log("NGO Length:", data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    const fetchNgoCampaignData = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/sitedata/ngolength"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCampaignLength(data);
        console.log("NGO Length:", data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/sitedata/userlength"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        setUserLength(data);
        console.log("User Length:", data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchNgoData();
    fetchUserData();
    fetchNgoCampaignData();
    fetchEventData();
  }, []);
  const options = {
    // theme: "dark2",
    animationEnabled: true,
    exportFileName: "NgosAndUserChart",
    exportEnabled: true,
    title: {
      text: "NGOs And Users Distribution",
      fontColor: "#ff9d00",
    },
    data: [
      {
        type: "pie",
        showInLegend: true,
        legendText: "{label}",
        toolTipContent: "{label}: <strong>{y}%</strong>",
        indexLabel: "{y}%",
        indexLabelPlacement: "inside",
        dataPoints: [
          { y: userLength, label: "Users" },
          { y: ngoLength, label: "NGOs " }
        ],
      },
    ],
  };
  const options2 = {
    // theme: "dark2",
    animationEnabled: true,
    exportFileName: "NgosAndUserChart",
    exportEnabled: true,
    title: {
      text: "NGOs Events and Campaign Distribution",
      fontColor: "#ff9d00",
    },
    data: [
      {
        type: "pie",
        showInLegend: true,
        legendText: "{label}",
        toolTipContent: "{label}: <strong>{y}%</strong>",
        indexLabel: "{y}%",
        indexLabelPlacement: "inside",
        dataPoints: [
          { y: eventLength, label: "NGOs Events " },
          { y: campaignLength, label: "NGOs Campaign " },
        ],
      },
    ],
  };

  return (
    <div>
      <NavAdmin />
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
          <CanvasJSChart options={options} />
          <CanvasJSChart options={options2} />
        </div>
      </div>
    </div>
  );
};

export default NgosAndUserChart;
