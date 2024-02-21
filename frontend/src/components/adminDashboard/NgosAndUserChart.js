import React, { useEffect, useState } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import NavAdmin from "./NavAdmin";
import Sidebar from "./Sidebar";
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const NgosAndUserChart = () => {
  const [ngoLength, setNgoLength] = useState(0);
  const [userLength, setUserLength] = useState(0);

  useEffect(() => {
    const fetchNgoData = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/sitedata/ngolength"
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
          { y: ngoLength, label: "NGOs " },
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
        </div>
      </div>
    </div>
  );
};

export default NgosAndUserChart;
