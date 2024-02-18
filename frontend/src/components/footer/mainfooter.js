import React from 'react'

function mainfooter() {
    return (
        <div>


            <div class="footerimage" style={{ backgroundImage: `url(assets/images/backgrounds/site_footer_bg.jpg)` }}>
                <footer class="text-center text-lg-start text-muted footer">
                    {/* <!-- style={{backgroundImage: `url(assets/images/backgrounds/site_footer_bg.jpg)`}} --> */}
                    <div class="container ">
                        <div class="me-5 d-none d-lg-block">
                            <span class="footertext">Get connected with us on social networks:</span>
                        </div>
                        <div>
                            <a href="" class="me-4 link-secondary">
                                <i class="fab fa-facebook-f"></i>
                            </a>
                            <a href="" class="me-4 link-secondary">
                                <i class="fab fa-twitter"></i>
                            </a>
                            <a href="" class="me-4 link-secondary">
                                <i class="fab fa-google"></i>
                            </a>
                            <a href="" class="me-4 link-secondary">
                                <i class="fab fa-instagram"></i>
                            </a>
                            <a href="" class="me-4 link-secondary">
                                <i class="fab fa-linkedin"></i>
                            </a>
                            <a href="" class="me-4 link-secondary">
                                <i class="fab fa-github"></i>
                            </a>
                        </div>

                        <section class="">
                            <div class="container text-center text-md-start mt-5">
                                <div class="row mt-3">
                                    <div class="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                                        <h6 class="text-uppercase fw-bold mb-4 footertext">
                                            <i class="fas fa-gem me-3 text-secondary"></i>Company name
                                        </h6>
                                        <p class="footertext">
                                            Here you can use rows and columns to organize your footer content. Lorem ipsum
                                            dolor sit amet, consectetur adipisicing elit.
                                        </p>
                                    </div>
                                    <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                                        <h6 class="text-uppercase fw-bold mb-4 footertext">
                                            Products
                                        </h6>
                                        <p class="footertext">
                                            <a href="#!" class="text-reset">Angular</a>
                                        </p>
                                        <p class="footertext">
                                            <a href="#!" class="text-reset">React</a>
                                        </p>
                                        <p class="footertext">
                                            <a href="#!" class="text-reset">Vue</a>
                                        </p>
                                        <p class="footertext">
                                            <a href="#!" class="text-reset">Laravel</a>
                                        </p>
                                    </div>
                                    <div class="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                                        <h6 class="text-uppercase fw-bold mb-4 footertext">
                                            Useful links
                                        </h6>
                                        <p class="footertext">
                                            <a href="#!" class="text-reset">Pricing</a>
                                        </p>
                                        <p class="footertext">
                                            <a href="#!" class="text-reset">Settings</a>
                                        </p>
                                        <p class="footertext">
                                            <a href="#!" class="text-reset">Orders</a>
                                        </p>
                                        <p class="footertext">
                                            <a href="#!" class="text-reset">Help</a>
                                        </p>
                                    </div>
                                    <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                                        <h6 class="text-uppercase fw-bold mb-4 footertext">Contact</h6>
                                        <p class="footertext"> <span style={{ color: `#ff9d00` }}> <i
                                            class="fas fa-home me-3 text-secondary" style={{ color: `#ff9d00` }}></i>
                                        </span> New York, NY 10012, US</p>
                                        <p class="footertext">
                                            <span style={{ color: `#ff9d00` }}> <i class="fas fa-envelope me-3 text-secondary"
                                                style={{ color: `#ff9d00` }}></i> </span>
                                            info@example.com
                                        </p>
                                        <p class="footertext"> <span style={{ color: `#ff9d00` }}> <i
                                            class="fas fa-phone me-3 text-secondary" style={{ color: `#ff9d00` }}></i>
                                        </span> + 01 234 567 88</p>
                                        <p class="footertext"> <span style={{ color: `#ff9d00` }}> <i
                                            class="fas fa-print me-3 text-secondary" style={{ color: `#ff9d00` }}></i>
                                        </span> + 01 234 567 89</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                        
                        <div class="text-center p-4 footertext" style={{ backgroundColor: `rgba(0, 0, 0, 0.025)` }} className="footertext">
                                © 2021 Copyright:
                                <a class="text-reset fw-bold footertext" href="https://mdbootstrap.com/"
                                    classNmae="footertext">MDBootstrap.com</a>
                            </div>
                    </div>


           
        </footer >
            </div >


        </div >
    )
}

export default mainfooter
