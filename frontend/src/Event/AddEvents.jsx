import React, { useState } from "react";
import { AddEvents } from "../services/authService";
import { useLocation } from "react-router-dom";

const Events = () => {
  const { state } = useLocation();
  console.log("state=>", state);
  const ngodata = state.ngodata;
  console.log(ngodata);

  const initialState = {
    NgoName: ngodata.ngoname,
    campaignName: ngodata.campagainname,
    EventPic: "",
    EventName: "",
    Location: "",
    Duration: "1 day",
    Details: "Events Details...",
    DateRange: {
      startDate: "",
      endDate: "",
    },
  };

  const [imagePreview, setimagePreview] = useState()
  const [formData, setformData] = useState(initialState);
  const [image, setimage] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(image);
    setformData({ ...formData, EventPic: image });
    console.log("event=>", formData);
    await AddEvents(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setformData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      // Update the state for non-nested properties
      setformData({
        ...formData,
        [name]: value,
      });
    }
  };

  const _handleImageChange = (e) => {
    console.log(e.target.files);
    // setimagelink(e.target.files[0]);
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
          // setformData({ ...formData, EventPic: data.url.toString() });
          // console.log(data);
          setimage(data.url.toString())
          // setLoading(false);
        }).catch((err) => {
          console.log(err);
          // setLoading(false);

        })
    }

  }

  return (
    <div>
      {/* // <form onSubmit={handleSubmit}> */}

      {/* <div>
        <label>Event Name:</label>
        <input
          type="text"
          name="EventName"
          value={formData.EventName}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Location:</label>
        <input
          type="text"
          name="Location"
          value={formData.Location}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Duration:</label>
        <input
          type="text"
          name="Duration"
          value={formData.Duration}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Start Date:</label>
        <input
          type="date"
          name="DateRange.startDate"
          value={formData.DateRange.startDate}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>End Date:</label>
        <input
          type="date"
          name="DateRange.endDate"
          value={formData.DateRange.endDate}
          onChange={handleInputChange}
        />
      </div>
      <button type="submit">Submit</button>

 */}



      <div className="bg-gray-100 flex bg-local pt-[5rem]">
        <div className="bg-gray-100 mx-auto max-w-6xl bg-white py-20 px-12 lg:px-24 shadow-xl mb-24">
          <form className="space-y-5" onSubmit={handleSubmit} role="Loginpage">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
              <div className="-mx-3 md:flex mb-6">
                <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                  <label
                    className="uppercase tracking-wide text-black text-xs font-bold mb-2"
                    htmlFor="company"
                  >
                    Event Name:
                  </label>
                  <input
                    className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                    id="company"
                    name="EventName"
                    type="text"
                    placeholder="Name"
                    value={formData.EventName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="md:w-1/2 px-3">
                  <label
                    className="uppercase tracking-wide text-black text-xs font-bold mb-2"
                    htmlFor="title"
                  >
                    Location
                  </label>
                  <input
                    className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                    name="Location"
                    id="title"
                    type="text"
                    placeholder="City"
                    value={formData.Location}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="-mx-3 md:flex mb-2">

                <div className="md:w-1/2 px-3">
                  <label
                    className="uppercase tracking-wide text-black text-xs font-bold mb-2"
                    htmlFor="title"
                  >
                    Duration
                  </label>
                  <select
                    className="w-full bg-gray-200 text-black border border-gray-200 rounded py-2 px-4 mb-3"
                    id="gender"
                    name="Duration"
                    value={formData.Duration}
                    onChange={handleInputChange}
                  >
                    <option>1 day</option>
                    <option> {"<"}=5 days</option>
                    <option> {"<"}=10 day</option>
                    <option>not sure</option>
                  </select >
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
                  <textarea
                    className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                    id="application-link"
                    // type="text"
                    name="Details"
                    placeholder="Event details"
                    value={formData.Details}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

              </div>

              <div className="-mx-3 md:flex mb-2">
                <div className="md:w-1/2 px-3">
                  <label
                    className="uppercase tracking-wide text-black text-xs font-bold mb-2"
                    htmlFor="title"
                  >
                    Start Date
                  </label>
                  <input
                    className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                    id="title"
                    type="date"
                    name="DateRange.startDate"
                    placeholder="dd-mm-yy"
                    value={formData.DateRange.startDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="md:w-1/2 px-3">
                  <label
                    className="uppercase tracking-wide text-black text-xs font-bold mb-2"
                    htmlFor="title"
                  >
                    End Date
                  </label>
                  <input
                    className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                    id="title"
                    type="date"
                    name="DateRange.endDate"
                    placeholder="dd-mm-yy"
                    value={formData.DateRange.endDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>




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
                    className="m-auto pb-5"
                    name="image"
                    onChange={(e) => _handleImageChange(e)}
                  />
                </label>
                <div className="imgPreview">
                  {image ? (
                    <img
                      src={image}
                      className="w-[25rem] h-[25rem] m-auto mt-10 border-2 rounded-5"
                    />
                  ) : (
                    <div className="previewText pt-3">
                      Please select an Image for Preview
                    </div>
                  )}
                </div>
              </button>



              <div className="-mx-3 md:flex mt-2">
                <div className="md:w-full px-3">
                  <button
                    type="submit"
                    className="md:w-full bg-gray-900 text-white font-bold py-2 px-4 border-b-4 hover:border-b-2 border-gray-500 hover:border-gray-100 rounded-full"
                  >
                    Upload event details
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
};

export default Events;
