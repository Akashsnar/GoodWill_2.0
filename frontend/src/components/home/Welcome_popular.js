import React, { useRef, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer';

function Welcome_popular() {

        const divRef = useRef();
        const [inViewRef, inView] = useInView({
            triggerOnce: true,
        });

        const [count, setCount] = useState(0);
        const incrementCount = () => {
            setCount((prevCount) => (prevCount < 84500 ? prevCount + 100 : 84500));
        };

    
        React.useEffect(() => {
            const intervalId = setInterval(incrementCount, 0.01); 
            return () => clearInterval(intervalId); 
        }, []);


        return (
            <div>


                <section class="welcome-one" style={{ backgroundImage: 'url(assets/images/backgrounds/welcome_one_bg.jpg)' }}>
                    <div class="welcome-one-hands"
                        style={{ backgroundImage: 'url(assets/images/backgrounds/welcome_one_hands.jpg)' }}>
                    </div>
                    <div class="container">
                        <div class="row">
                            <div class="col-xl-6 col-lg-6">
                                <div class="welcome-one__left">
                                    <div class="welcome-one__img wow slideInLeft" data-wow-delay="100ms">
                                        <img src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9uYXRpb258ZW58MHwwfDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
                                            alt="" />
                                        <div class="welcome-one__badge">
                                            <img src="assets/images/resources/welcome_one_badge.png" alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-6 col-lg-6">
                                <div class="welcome-one__right">
                                    <div class="block-title text-left" style={{ marginTop: '-11px' }}>
                                        <h4>Helping Today</h4>
                                        <h2>Our Goal is to Help Poor People</h2>
                                    </div>
                                    <p class="welcome-one__text">Lorem ipsum dolor sit amet, consectetur notted adipisicing elit
                                        sed do eiusmod tempor incididunt ut labore et simply free text dolore magna aliqua lonm
                                        andhn.</p>
                                    <ul class="welcome-one__list list-unstyled">
                                        <li><span class="icon-confirmation"></span>Nsectetur cing do not elit.</li>
                                        <li><span class="icon-confirmation"></span>Suspe ndisse suscipit sagittis in leo.</li>
                                        <li><span class="icon-confirmation"></span>Entum estibulum dignissim lipsm posuere.</li>
                                    </ul>
                                    <div class="welcome-one__campaigns">
                                        <div class="iocn">
                                            <i class="fa-sharp fa-treasure-chest"></i>
                                        </div>
                                        <div  ref={divRef}  class="text">
                                            <p></p>
                                            <h2 class="counter">{count}</h2>
                                            <p>Successfull Campaigns</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* <!--Welcome One End-->

            <!--Popular Causes Start--> */}
                <section class="popular-causes">
                    <div class="container">
                        <div class="block-title text-left">
                            <h4>Help the People</h4>
                            <h2>Our Popular Causes</h2>
                        </div>
                        <div class="row">
                            {/* <!--Popular Causes Single--> */}
                            <div class="popular-causes__sinlge col-sm-4">
                                <div class="popular-causes__img">
                                    <img src="https://image.cnbcfm.com/api/v1/image/107254786-1686544079782-gettyimages-1493977567-dsc_4402-2_labpzngl.jpeg?v=1686617164" style={{width:'370px', height:'306px'}} alt="" />
                                    <div class="popular-causes__category">
                                        <p>Food</p>
                                    </div>
                                </div>
                                <div class="popular-causes__content">
                                    <div class="popular-causes__title">
                                        <h3><a href="campaign-details.html">Raise Fund for Clean & Healthy Water</a>
                                        </h3>
                                        <p>Aliq is notm hendr erit a augue insu image pellen tes.</p>
                                    </div>
                                    <div class="popular-causes__progress">
                                        <div class="bar">
                                            <div class="bar-inner count-bar" data-percent="36%">
                                                <div class="count-text">36%</div>
                                            </div>
                                        </div>
                                        <div class="popular-causes__goals">
                                            <p><span>$25,270</span> Raised</p>
                                            <p><span>$30,000</span> Goal</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <!--Popular Causes Single--> */}
                            <div class="popular-causes__sinlge col-sm-4">
                                <div class="popular-causes__img">
                                    <img src="https://www.smilefoundationindia.org/blog/wp-content/uploads/2022/11/142875012_4213934451963824_4908626115809418460_o-1024x768.jpg" style={{width:'370px', height:'306px'}}  alt="" />
                                    <div class="popular-causes__category">
                                        <p>Education</p>
                                    </div>
                                </div>
                                <div class="popular-causes__content">
                                    <div class="popular-causes__title">
                                        <h3><a href="campaign-details.html">Education for Poor Children</a>
                                        </h3>
                                        <p>Aliq is notm hendr erit a augue insu image pellen tes.</p>
                                    </div>
                                    <div class="popular-causes__progress">
                                        <div class="bar">
                                            <div class="bar-inner count-bar" data-percent="36%">
                                                <div class="count-text">36%</div>
                                            </div>
                                        </div>
                                        <div class="popular-causes__goals">
                                            <p><span>$25,270</span> Raised</p>
                                            <p><span>$30,000</span> Goal</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>



            </div>
        )
    }

    export default Welcome_popular



