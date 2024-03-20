import React from "react";
import { Link } from "react-router-dom";

function Services() {
    return (
        <>

        
   
            <div class="service-header" style={{ backgroundColor: '#ffffff' }}>
                <h1 class="servicesHeading">Our services</h1>
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-lg-4 featcont">
                            <ion-icon name="checkmark-circle" class="feat" style={{ fontSize: "50px" }}></ion-icon>
                            <h3>Easy to use.</h3>
                            <p class="feature-p">Easiest way to help others.</p>
                        </div>
                        <div class="col-lg-4 featcont">
                            <ion-icon name="home" class="feat" style={{ fontSize: "50px" }}></ion-icon>
                            <h3>Support Ngos</h3>
                            <p class="feature-p">Connect Ngos to donors.</p>
                        </div>
                        <div class="col-lg-4 featcont">
                            <ion-icon name="heart" class="feat" style={{ fontSize: "50px" }}></ion-icon>
                            <h3>Reliable</h3>
                            <p class="feature-p">Our Service makes a difference.</p>
                        </div>
                    </div>
                </div>

                <section class="feature-one features-service">
                    <div class="container">
                        <div class="feature-one__inner">
                            <div class="row">
                                <Link to='/services/volunteer' class="col-xl-4 col-lg-4">
                                    {/* <!--Three Icon Single--> */}
                                    <div class="feature-one__single feature-one__single-first-item">
                                        <div class="feature-one__icon-wrap">
                                            <div class="feature-one__icon-box">
                                                <div class="feature-one__icon-box-img">
                                                    <img src="assets/images/resources/three_iocn_box_bg.png" alt="" />
                                                </div>
                                                <div>
                                                    <i class="fa-duotone fa-hand-holding-heart fa-3x"></i>
                                                </div>
                                            </div>


                                            <div class="feature-one__icon-text-box">
                                                <h4>Become <br /> Volunteer</h4>
                                            </div>
                                        </div>
                                        <p class="feature-one__icons-single-text">volunteer for impactful projects, diverse opportunities, and community connection.</p>
                                    </div>
                                </Link>
                                <Link to='/login' class="col-xl-4 col-lg-4">
                                    {/* <!--Three Icon Single--> */}
                                    <div class="feature-one__single feature-one__single-second-item">
                                        <div class="feature-one__icon-wrap">
                                            <div class="feature-one__icon-box feature-one__icon-box-two">

                                                <div class="feature-one__icon-box-img">
                                                    <img src="assets/images/resources/three_iocn_box_bg-2.png" alt="" />
                                                </div>

                                                <div>
                                                    <i class="fa-solid fa-wallet fa-3x"></i>
                                                </div>
                                            </div>


                                            <div class="feature-one__icon-text-box">
                                                <h4>Quick <br /> Fundraise</h4>
                                            </div>
                                        </div>
                                        <p class="feature-one__icons-single-text">Start a quick fundraiser with GoodWill—simple setup, rapid impact. Empower change now!</p>
                                    </div>
                                </Link>
                                <Link to='/login' class="col-xl-4 col-lg-4">
                                    {/* <!--Three Icon Single--> */}
                                    <div class="feature-one__single feature-one__single-third-item">
                                        <div class="feature-one__icon-wrap">
                                            <div class="feature-one__icon-box feature-one__icon-box-three">

                                                <div class="feature-one__icon-box-img">
                                                    <img src="assets/images/resources/three_iocn_box_bg-3.png" alt="" />
                                                </div>
                                                <div>
                                                    <i class="fa-solid fa-hand-holding-dollar fa-3x"></i>

                                                </div>
                                            </div>


                                            <Link to='/login' class="feature-one__icon-text-box">
                                                <h4>Start <br /> Donating</h4>
                                            </Link>
                                        </div>
                                        <p class="feature-one__icons-single-text">Begin donating effortlessly for a brighter, compassionate world.</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>



                <section style={{ marginTop: "-2%" }}>
                    <h1 class="servicesHeading" style={{ padding: "2%" }}>Non-Profit</h1>
                    <p class="feature-p" style={{ marginTop: "-2%" }}>Bring it all togethor</p>
                    <center>
                        <h4 class="service-p" style={{ width: "60%" }}>You serve the society, it's our turn to serve you. We simplify your efforts to scale your donor-volunteer reach, and sustain them too.</h4>
                    </center>
                    <section class="feature-one features-service">
                        <div class="container" style={{ marginBottom: "0", paddingBottom: "0" }}>
                            <div class="feature-one__inner">
                                <div class="row">
                                    <div class="nonProfitContainer">
                                        <div class="nonProfitItem">
                                            <center>
                                                <img src="https://iili.io/HhcD7v1.webp" alt="" />
                                                <div class="serviceNgo">
                                                    <h4>New volunteers <br /> and donors</h4>
                                                </div>
                                            </center>
                                        </div>

                                        <div class="nonProfitItem">
                                            <center>
                                                <img src="https://iili.io/HhcD5YP.webp" alt="" />
                                                <div class="serviceNgo">
                                                    <h4>Deepen member <br /> relationship</h4>
                                                </div>
                                            </center>
                                        </div>

                                        <div class="nonProfitItem">
                                            <center>
                                                <img src="https://iili.io/HhcDYyF.webp" alt="" />
                                                <div class="serviceNgo">
                                                    <h4>Change <br /> in the Society</h4>
                                                </div>
                                            </center>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div>
                        <div className="text-center more-post__btn" style={{ margin: "0" }}>
                            <a href="#" className="thm-btn">
                                Try it For Free
                            </a>
                            <a href="#"><p class="feature-p alreadyreg">Already registered?</p></a>
                        </div>
                    </div>
                </section>

                <section style={{ marginTop: "2%" }}>
                    <h1 class="servicesHeading" style={{ padding: "2%" }}>Individual</h1>
                    <p class="feature-p" style={{ marginTop: "-2%" }}>Be the Sparkle, Be the Shine!r</p>
                    <section class="feature-one features-service">
                        <div class="container" style={{ marginBottom: "0", paddingBottom: "0" }}>
                            <div class="feature-one__inner" style={{ padding: "2%" }}>
                                <div class="row">
                                    <div class="nonProfitContainer">
                                        <div class="nonProfitItem">

                                            <center>
                                                <img src="https://iili.io/HhcDjyX.webp" alt="" />
                                                <div class="serviceNgo">
                                                    <h3 class="individualHeading">EXPLORE</h3>
                                                    <h4>Causes aligned <br />to your interest</h4>
                                                </div>
                                            </center>
                                        </div>

                                        <div class="nonProfitItem">

                                            <center>
                                                <img src="https://iili.io/HhcDOjs.webp" alt="" />
                                                <div class="serviceNgo">
                                                    <h3 class="individualHeading">CONTRIBUTE</h3>
                                                    <h4 style={{ width: "12rem" }}>Volunteer or donate<br />for the cause</h4>
                                                </div>
                                            </center>
                                        </div>

                                        <div class="nonProfitItem">

                                            <center>
                                                <img src="https://iili.io/HhcDNun.webp" alt="" />
                                                <div class="serviceNgo">
                                                    <h3 class="individualHeading">SHOWCASE</h3>
                                                    <h4>Your<br />Good Karma</h4>
                                                </div>
                                            </center>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div class="individualImageSec">
                        <div>
                            <img class="individualImgs" src="https://iili.io/HhcvHss.png" alt="" />
                        </div>
                        <div>
                            <img class="individualImgs" src="https://iili.io/Hhcv9Xn.png" alt="" />
                        </div>
                    </div>
                </section>


            </div>
        </>
    )
}

export default Services