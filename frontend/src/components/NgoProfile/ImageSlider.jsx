import React, { useState, useEffect } from "react";
import Typewriter from "typewriter-effect";
import { HiArrowLeftCircle } from "react-icons/hi2";
import { HiArrowRightCircle } from "react-icons/hi2";

import "./imageSlider.css";

const ImageSlider = ({ slides, ngoDetails }) => {

  useEffect(() => {
    console.log(slides);
    console.log(ngoDetails);

  }, [])
  

  const [currentIndex, setCurrentIndex] = useState(0);
  const slideStyles = {
    width: "100%",
    height: "60vh",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundImage: `url(${slides[currentIndex]})`,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    // borderRadius: "5px",
  };

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    console.log(slides.length);
    console.log(slides[newIndex]);
  };
  const goToNext = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    console.log(slides[newIndex]);
  };

  return (
    <>
      <div className="typewriter-container">
        {ngoDetails.ngoname}
        <Typewriter
          onInit={(typewriter) => {
            typewriter
              .typeString(`<span >${ngoDetails.ngoname}</span> `)
              .pauseFor(10000)
              .deleteAll()
              .pauseFor(2000)
              .start();
          }}
          options={{
            loop: true,
            cursor: "",
            deleteSpeed: 15000,
          }}
        />
      </div>
      <div style={slideStyles}>
        <div className="leftarrowContainer">
          <HiArrowLeftCircle
            size={40}
            className="leftArrowStyles"
            onClick={goToPrevious}
          />
        </div>

        <div className="description_container">
          <div className="campaign_container">{ngoDetails.campagainname}</div>
          <div className="description">
           {ngoDetails.desc}
          </div>
        </div>

        <div className="rightarrowContainer">
          <HiArrowRightCircle
            size={40}
            className="rightArrowStyles"
            onClick={goToNext}
          />
        </div>
      </div>
      <div className="extra_details_container">
        <div className="amt_raised">
          Goal
          <div className="details">{ngoDetails.goal}</div>
        </div>
        <div className="amt_raised">
          Donation get
          <div className="details">{ngoDetails.raised}</div>
        </div>
        <div className="amt_raised">
          Percentage of completion
          <div className="details">{(ngoDetails.raised/ngoDetails.goal)*100} %</div>
        </div>
      </div>
    </>
  );
};

export default ImageSlider;