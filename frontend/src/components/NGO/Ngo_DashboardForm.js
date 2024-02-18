import React, { useState } from "react";
import { logoutUser } from '../../services/authService';
import { useNavigate } from "react-router-dom";
import axios from "axios";


function NGO_Dashboard_form(props) {

  const [image, setimage] = useState();
  const Ngonameused =props.Ngoname;
  const [imagelink, setimagelink] = useState();

  const navigate = useNavigate();

  const logout = async () => {
    console.log("Ngo logout")
    navigate('/');
  }

  const [formData, setFormData] = useState({
    ngoname: {Ngonameused},
    campagainname: '',
    category: '',
    goal: 0,
    desc: '',
    image: '',
    raised:0
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
        ngoname: {Ngonameused},
        campagainname: '',
        category: '',
        goal: 0,
        desc: '',
        image: '',
        raised:0
      });
    } catch (error) {
      console.log('Error Submitting form'.error);
    }
  };
  return (
    <div>
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
                      <div className="col-xl-6">
                        <div className="contact-form__input-box">
                          <input
                            type="text"
                            placeholder="Category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                          />
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
                        <button type="submit" className="btn" style={{ marginTop: '4rem', backgroundColor: 'red', color: 'white', fontSize: '1.5rem' }} onClick={logout} >
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

























// import { useState } from "react";
// import CloudinaryUploadWidget from "./CloudinaryUploadWidget";
// import { Cloudinary } from "@cloudinary/url-gen";
// import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";

// import "./styles.css";

// export default function App() {
//   const [publicId, setPublicId] = useState("");
//   const [cloudName] = useState("hzxyensd5");
//   const [uploadPreset] = useState("aoh4fpwm");
//   const [uwConfig] = useState({
//     cloudName,
//     uploadPreset
//   });
//   const cld = new Cloudinary({
//     cloud: {
//       cloudName
//     }
//   });

//   const myImage = cld.image(publicId);

//   return (
//     <div className="App">
//       <h3>Cloudinary Upload Widget Example</h3>
//       <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={setPublicId} />
//       <p>
//         <a
//           href="https://cloudinary.com/documentation/upload_widget"
//           target="_blank"
//         >
//           Upload Widget User Guide
//         </a>
//       </p>
//       <p>
//         <a
//           href="https://cloudinary.com/documentation/upload_widget_reference"
//           target="_blank"
//         >
//           Upload Widget Reference
//         </a>
//       </p>
//       <div style={{ width: "800px" }}>
//         <AdvancedImage
//           style={{ maxWidth: "100%" }}
//           cldImg={myImage}
//           plugins={[responsive(), placeholder()]}
//         />
//       </div>
//     </div>
//   );
// }
