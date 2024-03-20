import React , { useState } from "react";
import NGOHeader  from '../NGO/NGO_header';
function Contact(){
    const headerProps={
        bgimage: "assets/images/main-slider/slider-1-1.jpg",
        heading:"Contact",
        page:"Contact"
      }
        // Use state to store form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    Subject: '',
    message: ''
    // Add more fields as needed
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Access form data in formData object
    console.log(formData);


    // Add logic for form submission, e.g., sending data to the server

    try {
        // Make an HTTP POST request to your Node.js server using fetch
        const response = await fetch('http://localhost:4000/sitedata/submitmessage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        // Ensure the request was successful (status code 2xx)
        if (!response.ok) {
          throw new Error('Failed to submit form');
        }
  
        // Log the response from the server (you can handle it as needed)
        const responseData = await response.json();
        console.log(responseData);

    setFormData({
        name: '',
        email: '',
        phone: '',
        Subject: '',
        message: ''
      });
    } catch (error){
        console.log('Error Submitting form'. error);
    }
  };

  return (
    <div style={{backgroundColor:'white'}}>

      <NGOHeader props={headerProps}/>

      <section className="contact-page">
        <div className="container">
          <div className="block-title text-center">
            <h4>Asked Questions</h4>
            <h2>Contact With Us</h2>
          </div>
          <div className="row">
            <div className="col-xl-8">
              <div className="contact-form">
                <form
                  onSubmit={handleSubmit}
                  className="contact-form-validated contact-one__form"
                >
                  <div className="row">
                    <div className="col-xl-6">
                      <div className="contact-form__input-box">
                        <input
                          required
                          type="text"
                          placeholder="Your name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-xl-6">
                      <div className="contact-form__input-box">
                        <input
                          type="email"
                          placeholder="Email address"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xl-6">
                      <div className="contact-form__input-box">
                        <input
                          type="text"
                          placeholder="Phone number"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-xl-6">
                      <div className="contact-form__input-box">
                        <input
                          type="text"
                          required
                          placeholder="Subject"
                          name="Subject"
                          value={formData.Subject}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="contact-form__input-box">
                        <textarea
                          name="message"
                          required
                          placeholder="Write message"
                          value={formData.message}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="btn" style={{backgroundColor:'#ff6d12',color:'white'}}
                      >
                        Send Message
                      </button>
                      </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="col-xl-4 d-flex align-items-stretch">
                        <div class="contact-page__info-box">
                            <div class="contact-page__info-box-address">
                                <h4 class="contact-page__info-box-tilte">Address</h4>
                                <p class="contact-page__info-box-address-text">IIIT Sri City <br/> Andhra Pradesh, India</p>
                            </div>
                            <div class="contact-page__info-box-phone">
                                <h4 class="contact-page__info-box-tilte">Phone</h4>
                                <p class="contact-page__info-box-phone-number">
                                    <a href="tel:0123456789">Local: 666 888 0000</a> <br/>
                                    <a href="tel:0123456789">Mobile: 000 8888 999</a>
                                </p>
                            </div>
                            <div class="contact-page__info-box-email">
                                <h4 class="contact-page__info-box-tilte">Email</h4>
                                <p class="contact-page__info-box-email-address">
                                    <a href="mailto:needhelp@company.com">goodwill@company.com</a> <br/>
                                    <a href="mailto:inquiry@asting.com">inquiry@goodwill.com</a>
                                </p>
                            </div>
                            <div class="contact-page__info-box-follow">
                                <h4 class="contact-page__info-box-tilte">Follow</h4>
                                <div class="contact-page__info-box-follow-social">
                                    <a href="#"><i class="fab fa-twitter"></i></a>
                                    <a href="#" class="clr-fb"><i class="fab fa-facebook-square"></i></a>
                                    <a href="#" class="clr-dri"><i class="fab fa-dribbble"></i></a>
                                    <a href="#" class="clr-ins"><i class="fab fa-instagram"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </div>
  );
    
}

export default Contact