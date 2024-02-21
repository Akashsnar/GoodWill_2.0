import React from 'react'

function help_need() {
  return (
    <div>
      
      <section class="we-are-helping" style={{backgroundImage: 'url(assets/images/backgrounds/we_are_helping_bg.jpg)'}}>
            <div class="container">
                <div class="row">
                    <div class="col-xl-6 col-lg-6">
                        <div class="we-are-helping__left">
                            <div class="block-title text-left">
                                <h4>Helping Today</h4>
                                <h2>We’re Helping People in Need Around the World</h2>
                            </div>
                            <div class="we-are-helping__video">
                                <a href="https://www.youtube.com/watch?v=i9E_Blai8vk"
                                    class="we-are-helping__video-btn video-popup"><i class="fa fa-play"></i></a>
                            </div>
                            <div class="we-are-helping__arrow">
                                <img src="assets/images/shapes/we_are_helping_arrow.png" alt=""/>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-6 col-lg-6">
                        <div class="we-are-helping__points">
                            <ul class="list-unstyled">
                                <li>
                                    <div class="icon" style={{color: 'rgb(216, 142, 4)'}}>
                                    <i class="fa-solid fa-bowl-food"></i>

                                    </div>
                                    <div class="text">
                                        <h4>Healthy Food</h4>
                                        <p>There are many variations of but the majority have simply free text suffered.
                                        </p>
                                    </div>
                                </li>
                                <li>
                                    <div class="icon" style={{color: 'rgb(216, 142, 4)'}}>
                                        <i class=" icon-water fa-solid fa-glass-water fa-3x"></i>
                                    </div>
                                    <div class="text">
                                        <h4>Clean Water</h4>
                                        <p>There are many variations of but the majority have simply free text suffered.
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/* <!--We Are Helping End-->

        <!--We Need Help Start--> */}
        <section class="we-need-help">
            <div class="we-nned-help-bg">
                <img src="assets/images/resources/we_need_help_bg.png" alt=""/>
            </div>
            <div class="container">
                <div class="row">
                    <div class="col-xl-6 col-lg-6">
                        <div class="we-need-help__left">
                            <div class="block-title text-left">
                                <h4>Asked Quesitons</h4>
                                <h2>We Need Your Help</h2>
                            </div>
                            <div class="we-need-help__faqs">
                                <div class="accrodion-grp" data-grp-name="faq-one-accrodion">
                                    <div class="accrodion">
                                        <div class="accrodion-title">
                                            <h4>How to process the charity functions?
                                                <i class="fa-solid fa-plus"></i>
                                            </h4>
                                        </div>
                                        <div class="accrodion-content">

                                            <div class="inner">
                                                <p>There are many variations of passages of available but the majority
                                                    have suffered alteration in that some form by words which don’t look
                                                    even as slightly believable now.</p>
                                            </div>
                                            {/* <!-- /.inner --> */}
                                        </div>
                                    </div>
                                    <div class="accrodion active">
                                        <div class="accrodion-title">
                                            <h4>How to process the charity functions?</h4>
                                        </div>
                                        <div class="accrodion-content">
                                            <div class="inner">
                                                <p>There are many variations of passages of available but the majority
                                                    have suffered alteration in that some form by words which don’t look
                                                    even as slightly believable now.</p>
                                            </div>
                                            {/* <!-- /.inner --> */}
                                        </div>
                                    </div>
                                    <div class="accrodion">
                                        <div class="accrodion-title">
                                            <h4>How to process the charity functions?</h4>
                                        </div>
                                        <div class="accrodion-content">
                                            <div class="inner">
                                                <p>There are many variations of passages of available but the majority
                                                    have suffered alteration in that some form by words which don’t look
                                                    even as slightly believable now.</p>
                                            </div>
                                            {/* <!-- /.inner --> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-6 col-lg-6">
                        <div class="we-need-help__right">
                            <div class="we-need-help__img" width="608px">
                                <img src="assets/images/resources/we_need_help_img.jpg" alt=""/>
                                <div class="we-need-help__give">
                                    <div class="icon">
                                        <i class="fa-thin fa-hands-praying"></i>
                                    </div>
                                    <div class="text">
                                        <h4>Let’s Give us your <br/> Helping Hand</h4>
                                    </div>
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

export default help_need


