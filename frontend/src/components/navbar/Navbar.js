/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/features/auth/authSlice";
import cartSlice from "../../redux/features/auth/cartSlice";

const NavBar = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const checkuserdata=useSelector((state) => state.auth)
  const cartitems=useSelector((state)=> state.cart)
  console.log(cartitems);
  const totalitems= cartitems.cartitems.length;


  console.log("checking user login or not",checkuserdata);
  const navigate = useNavigate();
  useEffect(() => {
    const navbar = document.querySelector(".navbar");
    navbar.classList.add("fade-in");
  }, []);

  const displayMenuBar = (x) => {
    if (x.matches) {
      document.getElementById("menuBar").style.display = "block";
      document.getElementById("lists").style.display = "none";
    } else {
      document.getElementById("menuBar").style.display = "none";
      document.getElementById("lists").style.display = "block";
    }
  };

  const displayText = (y) => {
    const elements = document.getElementsByClassName("displayNone");
    if (y.matches) {
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "none";
      }
      document.getElementById("donateBtn").style.marginTop = ".1rem";
    } else {
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "block";
        document.getElementById("donateBtn").style.marginTop = "1.3rem";
      }
    }
  };

  const handleDonation = () => {
    alert(`Login : ${isLoggedIn}`);
    if (!isLoggedIn) {
      alert("Plz login first");
      navigate("/");
    } else {
      console.log("hello");
      navigate("/donation");
    }
  };

  useEffect(() => {
    const x = window.matchMedia("(max-width: 68.438rem)");
    const y = window.matchMedia("(max-width: 88.438rem)");

    displayText(y);
    displayMenuBar(x);

    const handleTextChange = () => displayText(y);
    const handleMenuBarChange = () => displayMenuBar(x);

    y.addListener(handleTextChange);
    x.addListener(handleMenuBarChange);

    return () => {
      y.removeListener(handleTextChange);
      x.removeListener(handleMenuBarChange);
    };
  }, []);

  return (
    <nav className="navbar navbar-dark bg-dark fixed-top">
      <div class="container-fluid">
        <Link class="navbar-brand customTextColor flex_custom" to="/">
          <div class="logo"></div>
          <div class="alignSelf_custom">
            <h2>
              <span class="displayNone customTextColor">GOODWILL</span>
            </h2>
          </div>
        </Link>
        <div id="lists">
          <ul class="navbar-nav flex-row justify-content-end">
            
            <li class="nav-item">
              <Link
                class="nav-link customTextColor paddingR_custom paddingL_custom font_custom "
                aria-current="page"
                to="/"
              >
                <i class="fa fa-home pla1"></i>
                <span class="displayNone">Home</span>
              </Link>
            </li>
            <li class="nav-item dropdown">
              <Link
                class="nav-link customTextColor paddingR_custom font_custom"
                to="/services"
                aria-haspopup="true"
                role="button"
                aria-expanded="false"
              >
                <i class="fas fa-hands-helping pla2"></i>
                <span class="displayNone">Services</span>
              </Link>
              <ul
                class="dropdown-menu bg-dark customTextColor"
                aria-labelledby="navbarDropdown"
              >
                {/* <li>
                  <Link
                    class="nav-link dropdown-item customTextColor font_custom pla12"
                    to="/Events"
                  >
                    <i class="fa fa-calendar" aria-hidden="true"></i>
                    Events
                  </Link>
                </li> */}
                <li>
                  <Link
                    class="nav-link dropdown-item customTextColor font_custom pla12"
                    to="#"
                  >
                    <i class="fa-solid fa-circle-dollar-to-slot"></i> Donation
                  </Link>
                </li>
              </ul>
            </li>
            <li class="nav-item">
              <Link
                class="nav-link customTextColor paddingR_custom font_custom"
                to="/ngo"
              >
                <i class="fa fa-users pla5"></i>
                <span class="displayNone">NGO</span>
              </Link>
            </li>
            <li class="nav-item">
              <Link
                class="nav-link customTextColor paddingR_custom font_custom"
                to="/contact"
              >
                <i class="fa fa-envelope pla1"></i>
                <span class="displayNone">Contact</span>
              </Link>
            </li>
            <li class="nav-item">
              <Link
                class="nav-link customTextColor paddingR_custom font_custom "
                aria-current="page"
                to="/chatapp"
              >
                <i class="fas fa-comment-dots"></i>{" "}
                <span class="displayNone">Chat</span>
              </Link>
            </li>
            <li class="nav-item">
              <Link
                class="nav-link btn customTextColor paddingR_custom font_custom cursor-pointer "
                to="/feedback"
              >
                <i class="fa-regular fa-message"></i>
                <span class="displayNone">&nbsp; Feedback</span>
              </Link>
            </li>
            {checkuserdata.isLoggedIn===false?
            <li class="nav-item">
              <Link
                class="nav-link btn customTextColor paddingR_custom font_custom cursor-pointer"
                to="/login"
              >
                <i class="fa fa-sign-in "></i>
                <span class="displayNone">&nbsp;Log In</span>
              </Link>
            </li>:<li class="nav-item">
              <Link
                class="nav-link btn customTextColor paddingR_custom font_custom cursor-pointer"
                to={`/user/${checkuserdata.userid}`}
              >
               <i class="fa-solid fa-user"></i>
                <span class="displayNone">&nbsp;Your Profile</span>
              </Link>
            </li>
            }
            

            <li class="nav-item">
                <Link
                  class="nav-link btn customTextColor paddingR_custom font_custom cursor-pointer p-4"
                  to="/feedback"
                >
              <div> 
              <i class="fa-solid fa-cart-shopping"></i>
              <span>{totalitems}</span>
              </div>
                </Link>
              </li>


           
            <li class="nav-item">
              <button
                class="donateBtn nav-link btn customTextColor paddingR_custom font_custom cursor-pointer"
                id="donateBtn"
                onClick={handleDonation}
              >
                <i class="fa-solid fa-heart cRed"></i>
                &nbsp;Donate
              </button>
            </li>
          </ul>
        </div>

        <div id="menuBar">
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasDarkNavbar"
            aria-controls="offcanvasDarkNavbar"
          >
            <i class="fa-solid fa-bars"></i>
          </button>
        </div>
        <div
          class="offcanvas offcanvas-start text-bg-dark"
          tabindex="-1"
          id="offcanvasDarkNavbar"
          aria-labelledby="offcanvasDarkNavbarLabel"
        >
          <button
            type="button"
            class="btn-close btn-close-white pla46"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
          <div class="offcanvas-header">
            <Link class="navbar-brand customTextColor" to="/">
              <div class="logoAtVertNav"></div>
              <div class="alignSelf_custom p-5">
                <h2 class="customTextColor pla">GOODWILL</h2>
              </div>
            </Link>
          </div>
          <div class="offcanvas-body">
            <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li class="nav-item">
                <Link
                  class="nav-link customTextColor font_custom p-4"
                  aria-current="page"
                  to="/"
                >
                  <center>
                    <i class="fa fa-home"></i>&nbsp;Home
                  </center>
                </Link>
              </li>
              <li class="nav-item">
                <Link
                  class="nav-link customTextColor font_custom p-4"
                  to="/services"
                >
                  <center>
                    <i class="fas fa-hands-helping"></i>&nbsp;Services
                  </center>
                </Link>
              </li>
              <li class="nav-item">
                <Link
                  class="nav-link customTextColor font_custom p-4"
                  to="/ngo"
                >
                  <center>
                    <i class="fa fa-users"></i>&nbsp;NGO
                  </center>
                </Link>
              </li>
              <li class="nav-item">
                <Link
                  class="nav-link customTextColor font_custom p-4"
                  to="/contact"
                >
                  <center>
                    <i class="fa fa-envelope"></i>&nbsp;Contact
                  </center>
                </Link>
              </li>
              <li class="nav-item">
                <Link
                  class="nav-link btn customTextColor paddingR_custom font_custom cursor-pointer p-4"
                  to="/login"
                >
                  <i class="fa fa-sign-in"></i>&nbsp;Log In
                </Link>
              </li>
              <li class="nav-item">
                <Link
                  class="nav-link btn customTextColor paddingR_custom font_custom cursor-pointer p-4"
                  to="/feedback"
                >
                  <i class="fa-regular fa-message"></i>
                  &nbsp;Feedback
                </Link>
              </li>
             
              <li class="nav-item">
                <Link
                  class="nav-link btn customTextColor paddingR_custom font_custom cursor-pointer p-4"
                  to="/feedback"
                >
                  <i class="fa-regular fa-cart-shopping"></i>
                </Link>
              </li>

             
              
              <li class="nav-item">
                <Link
                  to="#"
                  class="donateBtn nav-link btn customTextColor paddingR_custom font_custom cursor-pointer p-4 "
                >
                  <i class="fa-solid fa-heart cRed"></i>&nbsp;Donate
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
