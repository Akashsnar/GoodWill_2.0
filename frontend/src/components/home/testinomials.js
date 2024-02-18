import React from 'react'

function testinomials() {
    return (
        <div>

            <section class="testimonials-one">
                <div class="testimonials-one-bg"
                    style={{ backgroundImage: `url(assets/images/backgrounds/testimonials_one_bg.jpg)` }}>
                </div>
                <div class="testimonials-one__container-box">
                    <div class="block-title text-center">
                        <h4>Happy People</h4>
                        <h2>What They Say</h2>
                    </div>
                    <div class="row">
                        <div class="col-xl-12">


                        </div>
                    </div>
                </div>
            </section>




            {/* <!--Testimonials One End-->

            <!--Join One Start--> */}
            <section class="join-one " data-imgPosition="50% 0%"
                style={{backgroundImage: `url(assets/images/backgrounds/join_one_bg.jpg)`}}>
                <div class="container">
                    <div class="row">
                        <div class="col-xl-12">
                            <div class="join-one__inner">
                                <div class="join-one__icon">
                                    <i class="fa-sharp fa-solid fa-hand-holding-hand fa-1x"></i>
                                </div>
                                <h2>Join the Helpers Group</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* <!--Join One End-->

            <!--Newsletter One Start--> */}
            <section class="newsletter-one">
                <div class="container">
                    <div class="newsletter-one__inner">
                        <div class="row">
                            <div class="col-xl-4">
                                <div class="newsletter-one__left">
                                    <div class="newsletter-one__subscriber-box">
                                        <div class="icon">
                                            <span class="icon-news"></span>
                                        </div>
                                        <div class="text">
                                            <p>Subscribe</p>
                                            <h4>Newsletter</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-8">
                                <div class="newsletter-one__right">
                                    <form action="#" class="newsletter-one__subscribe-form">
                                        <div class="newsletter-one__subscribe-input-box">
                                            <input type="email" name="email" placeholder="Enter email address" />
                                            <button type="submit" class="button">Subscribe</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            <section class="news-one" style={{marginTop:'4rem'}}>
                <div class="news-one-bg" style={{backgroundImage: `url(assets/images/backgrounds/news_one_bg.jpg)`}}></div>
                <div class="container">
                    <div class="row">
                        <div class="col-xl-6 col-lg-6">
                            <div class="block-title text-left">
                                <h4>From the Blog</h4>
                                <h2>News & Articles</h2>
                            </div>
                        </div>
                        <div class="col-xl-6 col-lg-6">
                            <div class="news-one__top-text">
                                <p>There are many variations of passages of lorem available but the majority have suffered
                                    in some form.</p>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xl-4 col-lg-4">
                            {/* <!--News One Single--> */}
                            <div class="news-one__single wow fadeInUp" data-wow-delay="100ms">
                                <div class="news-one__img">
                                    <div class="news-one__img-box">
                                        <img src="assets/images/blog/news_one_img_1.jpg"  style={{height:'276px', width:'370px'}} alt=""/>
                                            <a href="news-details.html"></a>
                                    </div>
                                    <div class="news-one__date-box">
                                        <p>23 <br/> Dec</p>
                                    </div>
                                </div>
                                <div class="news-one__content">
                                    <ul class="list-unstyled news-one__meta">
                                    <li><a href="#" style={{color:'black'}}><i class="far fa-user-circle" style={{color:'#ff6d12'}}></i> Admin  <span>/</span></a> &nbsp; <a href="#" style={{color:'black'}}><i class="far fa-comments" style={{color:'#ff6d12'}}></i> 2 Comments</a></li>
                                        
                                    </ul>
                                    <div class="news-one__title">
                                        <h3><a href="news-details.html" className='newsheading'>Best solutions to help the homeless</a></h3>
                                    </div>
                                    <a href="news-details.html" class="thm-btn newsmore news-one__btn">More</a>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-4 col-lg-4">
                            {/* <!--News One Single--> */}
                            <div class="news-one__single wow fadeInUp" data-wow-delay="200ms">
                                <div class="news-one__img">
                                    <div class="news-one__img-box">
                                        <img src="assets/images/blog/news_one_img_2.jpg" style={{height:'276px', width:'370'}} alt=""/>
                                            <a href="news-details.html"></a>
                                    </div>
                                    <div class="news-one__date-box">
                                        <p>23 <br/> Dec</p>
                                    </div>
                                </div>
                                <div class="news-one__content">
                                    <ul class="list-unstyled news-one__meta">
                                    <li><a href="#" style={{color:'black'}}><i class="far fa-user-circle" style={{color:'#ff6d12'}}></i> Admin  <span>/</span></a> &nbsp; <a href="#" style={{color:'black'}}><i class="far fa-comments" style={{color:'#ff6d12'}}></i> 2 Comments</a></li>
                                    
                                    </ul>
                                    <div class="news-one__title">
                                        <h3><a href="news-details.html"  className='newsheading'>Take care of the elderly without home.</a></h3>
                                    </div>
                                    <a href="news-details.html" class="thm-btn news-one__btn" >More</a>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-4 col-lg-4">
                            {/* <!--News One Single--> */}
                            <div class="news-one__single wow fadeInUp" data-wow-delay="300ms">
                                <div class="news-one__img">
                                    <div class="news-one__img-box">
                                        <img src="assets/images/blog/news_one_img_3 (2).jpg" style={{height:'276px', width:'370'}} alt=""/>
                                            <a href="news-details.html" ></a>
                                    </div>
                                    <div class="news-one__date-box">
                                        <p>23 <br/> Dec</p>
                                    </div>
                                </div>
                                <div class="news-one__content">
                                    <ul class="list-unstyled news-one__meta">
                                    <li><a href="#" style={{color:'black'}}><i class="far fa-user-circle" style={{color:'#ff6d12'}}></i> Admin  <span>/</span></a> &nbsp; <a href="#" style={{color:'black'}}><i class="far fa-comments" style={{color:'#ff6d12'}}></i> 2 Comments</a></li>

                                    </ul>
                                    <div class="news-one__title">
                                        <h3><a href="news-details.html" className='newsheading'>Donate to Poor Children to return to school</a>
                                        </h3>
                                    </div>
                                    <a href="news-details.html" class="thm-btn news-one__btn">More</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>











        </div>
    )
}

export default testinomials
