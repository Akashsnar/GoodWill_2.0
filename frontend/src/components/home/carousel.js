import React from 'react'

function carousel() {
    return (
        <div>

           
                {/* <!-- style="background-image: url(assets/images/main-slider/slider-1-1.jpg); --> */}

                <div id="carouselExampleDark" class="carousel carousel-dark slide">
                    <div class="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="0" class="active"
                            aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="1"
                            aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="2"
                            aria-label="Slide 3"></button>
                    </div>
                    <div class="carousel-inner">
                        <div class="carousel-item active" data-bs-interval="10000">
                            <img src="./assets/images/main-slider/slider-1-1.jpg" class="d-block w-100" height="800rem"
                                alt="..."/>
                                <div class="carousel-caption d-none d-md-block">
                                    <h5>First slide label</h5>
                                    <p>Some representative placeholder content for the first slide.</p>
                                </div>
                        </div>
                        <div class="carousel-item" data-bs-interval="2000">
                            <img src="./assets/images/main-slider/slider-1-2.avif" class="d-block w-100" height="800rem"
                                alt="..."/>
                                <div class="carousel-caption d-none d-md-block">
                                    <h5>Second slide label</h5>
                                    <p>Some representative placeholder content for the second slide.</p>
                                </div>
                        </div>
                        <div class="carousel-item">
                            <img src="./assets/images/main-slider/slider-1-3.jpg" class="d-block w-100" height="800rem"
                                alt="..."/>
                                <div class="carousel-caption d-none d-md-block">
                                    <h5>Third slide label</h5>
                                    <p>Some representative placeholder content for the third slide.</p>
                                </div>
                        </div>
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark"
                        data-bs-slide="prev">


                        <i class="fa-thin fa-circle-arrow-left fa-3x"></i>

                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleDark"
                        data-bs-slide="next">
                        <i class="fa-thin fa-circle-arrow-right fa-3x"></i>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>

                <section class="feature-one">
                    <div class="container">
                        <div class="feature-one__inner">
                            <div class="row">
                                <div class="col-xl-4 col-lg-4">
                                    {/* <!--Three Icon Single--> */}
                                    <div class="feature-one__single feature-one__single-first-item">
                                        <div class="feature-one__icon-wrap">
                                            <div class="feature-one__icon-box">
                                                <div class="feature-one__icon-box-img">
                                                    <img src="assets/images/resources/three_iocn_box_bg.png" alt=""/>
                                                </div>
                                                <div>
                                                    <i class="fa-duotone fa-hand-holding-heart fa-3x"></i>
                                                </div>
                                            </div>


                                            <div class="feature-one__icon-text-box">
                                                <h4>Become <br/> Volunteer</h4>
                                            </div>
                                        </div>
                                        <p class="feature-one__icons-single-text">There are many of lorem Ipsum, but the majori
                                            have suffered alteration in some form.</p>
                                    </div>
                                </div>
                                <div class="col-xl-4 col-lg-4">
                                    {/* <!--Three Icon Single--> */}
                                    <div class="feature-one__single feature-one__single-second-item">
                                        <div class="feature-one__icon-wrap">
                                            <div class="feature-one__icon-box feature-one__icon-box-two">

                                                <div class="feature-one__icon-box-img">
                                                    <img src="assets/images/resources/three_iocn_box_bg-2.png" alt=""/>
                                                </div>

                                                <div>
                                                    <i class="fa-solid fa-wallet fa-3x"></i>
                                                </div>
                                            </div>


                                            <div class="feature-one__icon-text-box">
                                                <h4>Quick <br/> Fundraise</h4>
                                            </div>
                                        </div>
                                        <p class="feature-one__icons-single-text">There are many of lorem Ipsum, but the majori
                                            have suffered alteration in some form.</p>
                                    </div>
                                </div>
                                <div class="col-xl-4 col-lg-4">
                                    {/* <!--Three Icon Single--> */}
                                    <div class="feature-one__single feature-one__single-third-item">
                                        <div class="feature-one__icon-wrap">
                                            <div class="feature-one__icon-box feature-one__icon-box-three">

                                                <div class="feature-one__icon-box-img">
                                                    <img src="assets/images/resources/three_iocn_box_bg-3.png" alt=""/>
                                                </div>
                                                <div>
                                                    <i class="fa-solid fa-hand-holding-dollar fa-3x"></i>
                                                </div>
                                            </div>


                                            <div class="feature-one__icon-text-box">
                                                <h4>Start <br/> Donating</h4>
                                            </div>
                                        </div>
                                        <p class="feature-one__icons-single-text">There are many of lorem Ipsum, but the majori
                                            have suffered alteration in some form.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                </div>

            )
}

export default carousel