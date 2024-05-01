import React, { useState } from "react";
import { logout } from "../../redux/actions/useractions";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

function NGO_Dashboard_form(props) {

  const [image, setimage] = useState();
  const Ngonameused = props.Ngoname;
  const [imagelink, setimagelink] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const Logout = () => {
    dispatch(logout());
    navigate("/");
  };

  const [formData, setFormData] = useState({
    ngoname:  Ngonameused,
    campagainname: '',
    category: '',
    goal: 0,
    desc: '',
    image: '',
    raised: 0
  });

  // Handle input changes
  const handleInputChange = (e) => {
    console.log(Ngonameused);
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleInputChange_image = (e) => {
    console.log(e.target.files);
    setimagelink(e.target.files[0]);
    const imgfile = e.target.files[0];

    if (imgfile.type === 'image/jpeg' || imgfile.type === 'image/png') {
      console.log("cloudnary");
      const data = new FormData()
      data.append("file", imgfile);
      data.append("upload_preset", "qyabhaz3")
      data.append("cloud_name", "dhwrvpowg")
      fetch("https://api.cloudinary.com/v1_1/dhwrvpowg/image/upload", {
        method: 'post', body: data,
      }).then((res) => res.json())
        .then(data => {
          // setPic(data.url.toString());
          setFormData({ ...formData, 'image': data.url.toString() });
          console.log(data);
          setimage(data.url.toString())
          // setLoading(false);
        }).catch((err) => {
          console.log(err);
          // setLoading(false);

        })
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Access form data in formData object
    console.log(formData);

    try {
      console.log(formData);
      const response = await axios.post(' http://localhost:4000/sitedata/ngo_details', formData);
      console.log("data saved");

      // Log the response from the server (you can handle it as needed)
      const responseData = await response.json();
      console.log(responseData);

      setFormData({
        ngoname: { Ngonameused },
        campagainname: '',
        category: '',
        goal: 0,
        desc: '',
        image: '',
        raised: 0
      });
    } catch (error) {
      console.log('Error Submitting form'.error);
    }
  };
  return (
    <div style={{marginTop:'6rem'}}>
      <center>

        {/* <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={setPublicId} /> */}

        <section className="contact-page">
          <div className="container">
            <div className="block-title text-center">
              <h4>Upload your Campaign</h4>
              <h2>Let us know about your NGO</h2>
            </div>
            <div className="row">
              <div className="col-xl-12">
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
                            placeholder="Campaign Name"
                            name="campagainname"
                            value={formData.campagainname}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      {/* <div className="col-xl-6">
                        <div className="contact-form__input-box">
                          <input
                            type="text"
                            placeholder="Category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div> */}
                      <div className="col-xl-6 pt-2">
                        <div>
                          <select className="w-full bg-[#f7f4f2] border text-black text-xs px-4 pr-8 py-3 rounded-full h-18 text-[1rem]" id="location" name="category" value={formData.category} onChange={handleInputChange}>
                            <option>General</option>
                            <option>Children</option>
                            <option>Senior Citizen</option>
                            <option>Women</option>
                            <option>Food</option>


                          </select>
                        </div>
                      </div>


                    </div>
                    <div className="row">
                      <div className="col-xl-12">
                        <div className="contact-form__input-box">
                          <input
                            type="number"
                            placeholder="Goal"
                            name="goal"
                            value={formData.goal}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xl-12">
                        <div className="contact-form__input-box">
                          <textarea
                            name="desc"
                            required
                            placeholder="Write Description"
                            value={formData.desc}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                        <div className="DashReview">
                          <input type="file" className="thm-btn contact-form__btn"
                            name="image"
                            onChange={handleInputChange_image} style={{ height: '4.5rem', width: '25rem', borderRadius: '33.5px' }} />
                          <button type="submit" className="" style={{ backgroundColor: '#ff6d12', color: 'white' }} >
                            Upload Campaign
                          </button>
                        </div>
                        <img src={image} />
                        <button type="submit" className="btn" style={{ marginTop: '4rem', backgroundColor: 'red', color: 'white', fontSize: '1.5rem' }} onClick={Logout} >
                          Logout
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </center>
    </div>
  )
}
export default NGO_Dashboard_form