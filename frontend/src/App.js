// import './App.css';
import Landing from "./components/home/landing";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getLoginStatus } from "./services/authService.js";
import { SET_LOGIN_USER } from "./redux/features/auth/authSlice.js";
import LoginContainer from "./components/login/LoginContainer.js";
import Userhome from "./components/user/Userhome.js";
import SerVices from "./components/Services/Services.js";
import Contact from "./components/Contact/contact.js";
import NGO_page from "./components/NGO/NGO_Page.js";
import NGO_Dashboard from "./components/NGO/NGO_Dashboard.js";
import UserdetailsForm from "./components/user/UserdetailsForm.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainDashboard from "./components/adminDashboard/MainDashboard.js";
import UserReviews from "./components/Rating/Ratings.js";
import UserTable from "./components/adminDashboard/tables/UserTable";
import NGOsCampaign from "./components/adminDashboard/tables/NgosCampaign";
import FeedbackTable from "./components/adminDashboard/tables/FeedbackTable";
import ReviewsTable from "./components/adminDashboard/tables/ReviewsTable";
import MessagesTable from "./components/adminDashboard/tables/MessagesTable";
import DonationsTable from "./components/adminDashboard/tables/DonationsTable";
import NGOsTable from "./components/adminDashboard/tables/NGOsTable";
import EventTable from "./components/adminDashboard/tables/EventTable";
import DonationGraphTable from "./components/adminDashboard/DonationGraphTable.js";
import NgosAndUserChart from "./components/adminDashboard/NgosAndUserChart.js";
import Feedback from "./components/feedback/FeedbackN";
import Home from "./blogs/Home";
import AddBlog from "./blogs/AddBlog.js";
import BlogDetails from "./blogs/BlogDetails.js";
import ContactUs from "./blogs/ContactUs.js";
import AboutUs from "./blogs/AboutUs.js";
import Donation from "./components/Donation/Donation.jsx";
import store from "./redux/store.js";
import Layout from "./blogs/Layout.js";
import Became_volunteer from "./components/Services/forms/became_volunteer.js";
import UserProfile from "./components/user/Userprofile.js";
import Campaign from "./components/NGO/Campaign_Dashboard.js";
import ChatPage from "./components/ChatPage/ChatPage.js";
import NgoProfile from "./components/NgoProfile/NgoProfile.js";
import "./style.css";
import AddEvents from "./Event/AddEvents.jsx";
import ShowEvent from "./Event/ShowEvent.js";
import Eventpage from "./Event/Eventpage.js";
import Navbar from "./components/navbar/Navbar.js";
import Products from "./components/Products/Productitems.js";
import ProductsForm from "./components/Products/Productsform.js";
import AdminChat from "./components/adminDashboard/AdminChat.js";
axios.defaults.withCredentials = true;

function App() {
  const dispatch = useDispatch();
  console.log(useSelector((state) => state.auth));
  useEffect(() => {
    async function loginStatus() {
      const status = await getLoginStatus();
      console.log(status);
      dispatch(SET_LOGIN_USER(status));
    }
    loginStatus();
  }, [dispatch]);

  return (
    <Router>
      <Navbar />

      <div className="App">
        <div style={{ backgroundColor: "white" }}>
          <Routes forceRefresh={true}>
            <Route exact path="/" element={<Landing />} />
            <Route exact path="/login" element={<LoginContainer />} />
            {/*hide*/}
            <Route exact path="/Admin" element={<MainDashboard />} /> {/*hide*/}
            <Route exact path="/givereview" element={<UserReviews />} />
            {/*hide*/}
            <Route exact path="/campaign" element={<Campaign />} />
            <Route exact path="/services" element={<SerVices />} />
            <Route exact path="/user/:id" element={<Userhome />} /> {/*hide*/}
            <Route exact path="/user/:id/products" element={<Products />} />
            <Route exact path="/contact" element={<Contact />} />
            <Route exact path="/ngo" element={<NGO_page />} />
            <Route exact path="/userdetails" element={<UserdetailsForm />} />
            <Route exact path="/donation/:name" element={<Donation />} />
            <Route exact path="/Ngo_dashboard"element={<NGO_Dashboard />}/>
            <Route exact path="/Ngo_dashboard/needsform"element={<ProductsForm />}/>

            {/*hide*/}
            <Route exact path="/Admin" element={<MainDashboard />} /> {/*hide*/}
            <Route exact path="/givereview" element={<UserReviews />} />{" "}
            {/*hide*/}
            <Route exact path="/services" element={<SerVices />} />
            <Route exact path="/ngo_page/:id" element={<NgoProfile />} />
            <Route path="/Ngo_dashboard/:campaignname" element={<Campaign />} />
            <Route
              exact
              path="/services/volunteer"
              element={<Became_volunteer />}
            />
            <Route path="/blogs" element={<Layout />}>
              <Route path="" element={<Home />} />
              <Route path="add" element={<AddBlog />} />
              <Route path=":id" element={<BlogDetails />} />
              <Route path="contact" element={<ContactUs />} />
              <Route path="about" element={<AboutUs />} />
            </Route>
          </Routes>
        </div>
        <Routes>
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/adminDashboard" element={<MainDashboard />} />
          <Route path="/adminDashboard/UserTable" element={<UserTable />} />
          <Route
            path="/adminDashboard/Graph"
            element={<DonationGraphTable />}
          />
          <Route
            path="/adminDashboard/chat"
            element={<AdminChat />}
          />
          <Route
            path="/adminDashboard/PieChart"
            element={<NgosAndUserChart />}
          />
          <Route
            path="/adminDashboard/FeedbackTable"
            element={<FeedbackTable />}
          />
          <Route
            path="/adminDashboard/ReviewsTable"
            element={<ReviewsTable />}
          />
          <Route
            path="/adminDashboard/DonationsTable"
            element={<DonationsTable />}
          />
          <Route
            path="/adminDashboard/MessagesTable"
            element={<MessagesTable />}
          />
          <Route path="/adminDashboard/NGOsCampaign" element={<NGOsCampaign />} />
          <Route path="/adminDashboard/NGOsTable" element={<NGOsTable />} />

          <Route path="/chatapp" element={<ChatPage />} />

          <Route path="/adminDashboard/EventTable" element={<EventTable />} />
          <Route
            exact
            path="/userprofile/:username"
            element={<UserProfile />}
          />

          <Route path="/getevents/user/:eventname" element={<Eventpage />} />
          <Route path="/events" element={<AddEvents />} />
          <Route path="/getevents" element={<ShowEvent />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
