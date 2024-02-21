import React, { useState, useEffect } from "react";
import "./NgoProfile.css";
import ImageSlider from "./ImageSlider";
import axios from 'axios'
import { useParams } from "react-router-dom";
// const ngoDetails = {
//   name: "Example NGO",
//   image: "./download.jpeg",
//   image2: "./download1.avif",
//   image3: "./download2.avif",
//   description: "A brief description of the NGO and its mission.",
//   amountToRaise: 50000,
//   campaign_name: "Education",
// };

// const images = [ngoDetails.image];
// images.push(ngoDetails.image2);
// images.push(ngoDetails.image3);


function NgoProfile() {
  const [ngoDetails, setngoDetails] = useState({
    ngoname: '',
    campagainname: '',
    category: '',
    goal: 0,
    desc: '',
    image: '',
    raised: 0
  });

  const id = useParams();
  useEffect(() => {
    async function fetchData() {
      console.log("hi");
      const ngocampaignid = id.id;
      console.log(ngocampaignid);
      const response = await axios.get(`http://localhost:4000/sitedata/ngodetail/${ngocampaignid}`);
      console.log("data saved");
      console.log(response);
      const responses = await response.data;
      console.log(responses);

      setngoDetails({
        ngoname: responses.ngoname,
        campagainname: responses.campagainname,
        category: responses.category,
        goal: responses.goal,
        desc: responses.desc,
        image: responses.image,
        raised: responses.raised
      });


    }
    console.log("hi Akash");
    fetchData();

  }, [])



  return (
    <div className="full-page">
      dd
      {/* {responseData} */}
      <ImageSlider slides={ngoDetails.image} ngoDetails={ngoDetails}></ImageSlider>
    </div>
  );
}

export default NgoProfile;