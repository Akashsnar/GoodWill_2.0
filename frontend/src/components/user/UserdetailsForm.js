import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function UserdetailsForm(props) {
  //   const { state } = useLocation();
  //   const navigate = useNavigate();
  //   const [imagePreview, setimagePreview] = useState();
  //   const [file, setfile] = useState();
  //   const [formData, setFormData] = useState({
  //     UserloginEmail: state.UserloginEmail,
  //     name: "",
  //     email: "",
  //     phone: "",
  //     dob: "",
  //     details: "",
  //     image: "",
  //   });
  //   const [error, setError] = useState("");

  //   const handleChange = (e) => {
  //     const { name, value } = e.target;
  //     setFormData({ ...formData, [name]: value });
  //   };

  //   const _handleImageChange = (e) => {
  //     e.preventDefault();

  //     const imgfile = e.target.files[0];
  //     console.log(imgfile);
  //     console.log(imgfile.name);
  //     setfile(imgfile);

  //     if (imgfile) {
  //       const reader = new FileReader();

  //       reader.onloadend = () => {
  //         setimagePreview(reader.result);
  //       };

  //       reader.readAsDataURL(imgfile);
  const { state } = useLocation();
  const navigate = useNavigate();
  const [imagePreview, setimagePreview] = useState()
  const [file, setfile] = useState()
  const [formData, setFormData] = useState({
    UserloginEmail: state.UserloginEmail,
    name: '',
    email: '',
    phone: '',
    dob: '',
    details: '',
    image: '',
    gender: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const _handleImageChange = (e) => {
    e.preventDefault();

    const imgfile = e.target.files[0];
    console.log(imgfile);
    console.log(imgfile.name);
    setfile(imgfile);

    if (imgfile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setimagePreview(reader.result);
      };

      reader.readAsDataURL(imgfile);
    }


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
          // setLoading(false);
        }).catch((err) => {
          console.log(err);
          // setLoading(false);

        })
    }


    if (imgfile.type === "image/jpeg" || imgfile.type === "image/png") {
      console.log("cloudnary");
      const data = new FormData();
      data.append("file", imgfile);
      data.append("upload_preset", "qyabhaz3");
      data.append("cloud_name", "dhwrvpowg");
      fetch("https://api.cloudinary.com/v1_1/dhwrvpowg/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          // setPic(data.url.toString());
          setFormData({ ...formData, image: data.url.toString() });
          console.log(data);
          // setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          // setLoading(false);
        });
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log(formData);
      const response = await axios.post(
        " http://localhost:4000/userinfo",
        formData
      );
      console.log("data saved");
      // navigate('/postlist', { state: response.data.token })
    } catch (error) {
      console.log(error);
      // setError(error.response.data.message);
    }
  };

  return (
    <div>
      <div className="bg-gray-100 flex bg-local pt-[5rem]">
        <div className="bg-gray-100 mx-auto max-w-6xl bg-white py-20 px-12 lg:px-24 shadow-xl mb-24">
          <form className="space-y-5" onSubmit={handleSubmit} role="Loginpage">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
              <button
                draggable={true}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", imagePreview)
                }
              >
                <label
                  htmlFor="dropzone-file"
                  className="flex w-full flex-col "
                >
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-sm dark:text-gray-400">
                      <span className="font-semibold">Upload your Picture</span>{" "}
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="m-auto"
                    name="image"
                    onChange={(e) => _handleImageChange(e)}
                  />
                </label>
                <div className="imgPreview">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      className="w-[15rem] h-[15rem] m-auto mt-10 border-2 rounded-full"
                    />
                  ) : (
                    <div className="previewText pt-3">
                      Please select an Image for Preview
                    </div>
                  )}
                </div>
              </button>

              <div className="-mx-3 md:flex mb-6">
                <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                  <label
                    className="uppercase tracking-wide text-black text-xs font-bold mb-2"
                    htmlFor="company"
                  >
                    Name
                  </label>
                  <input
                    className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                    id="company"
                    name="name"
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {/* <div>
                                        <span className="text-red-500 text-xs italic">
                                            Please fill out this field.
                                        </span>
                                    </div> */}

                </div>
                <div className="md:w-1/2 px-3">
                  <label
                    className="uppercase tracking-wide text-black text-xs font-bold mb-2"
                    htmlFor="title"
                  >
                    Email
                  </label>
                  <input
                    className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                    name="email"
                    id="title"
                    type="email"
                    placeholder="email@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="-mx-3 md:flex mb-2">
                <div className="md:w-1/2 px-3">
                  <label
                    className="uppercase tracking-wide text-black text-xs font-bold mb-2"
                    htmlFor="title"
                  >
                    Phone
                  </label>
                  <input
                    className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                    id="title"
                    type="text"
                    name="phone"
                    placeholder="email@gmail.com"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="md:w-1/2 px-3">
                  <label
                    className="uppercase tracking-wide text-black text-xs font-bold mb-2"
                    htmlFor="title"
                  >
                    Dob
                  </label>
                  <input
                    className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                    id="title"
                    type="text"
                    name="dob"
                    placeholder="email@gmail.com"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="-mx-3 md:flex mb-6">
                <div className="md:w-full px-3">
                  <label
                    className="uppercase tracking-wide text-black text-xs font-bold mb-2"
                    htmlFor="application-link"
                  >
                    Details
                  </label>
                  <input
                    className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                    id="application-link"
                    type="text"
                    name="details"
                    placeholder=""
                    value={formData.details}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="-mx-3 md:flex mt-2">
                <div className="md:w-full px-3">
                  <button
                    type="submit"
                    className="md:w-full bg-gray-900 text-white font-bold py-2 px-4 border-b-4 hover:border-b-2 border-gray-500 hover:border-gray-100 rounded-full"
                  >
                    Update your Profile
                  </button>
                </div>
              </div>

              <div className="preview">
                <img id="file-ip-1-preview" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

}
export default UserdetailsForm;
