
import React, { useEffect } from "react";
import "../navbar/Navbar.css";
import { Link } from "react-router-dom";

const NavBar = () => {
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

  // const displayText = (y) => {
  //   const elements = document.getElementsByClassName("displayNone");
  //   if (y.matches) {
  //     for (let i = 0; i < elements.length; i++) {
  //       elements[i].style.display = "none";
  //     }
  //     document.getElementById("donateBtn").style.marginTop = ".1rem";
  //   } else {
  //     for (let i = 0; i < elements.length; i++) {
  //       elements[i].style.display = "block";
  //       document.getElementById("donateBtn").style.marginTop = "1.3rem";
  //     }
  //   }
  // };

  useEffect(() => {
    const x = window.matchMedia("(max-width: 68.438rem)");
    const y = window.matchMedia("(max-width: 88.438rem)");

    // displayText(y);
    displayMenuBar(x);

    // const handleTextChange = () => displayText(y);
    const handleMenuBarChange = () => displayMenuBar(x);

    // y.addListener(handleTextChange);
    x.addListener(handleMenuBarChange);

    return () => {
      // y.removeListener(handleTextChange);
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
                to="/adminDashboard"
                aria-haspopup="true"
                role="button"
                aria-expanded="false"
              >
                <i className="fa fa-dashboard"></i>
                <span class="displayNone">Dashboard</span>
              </Link>
            </li>
            <li class="nav-item">
              <Link
                class="nav-link btn customTextColor paddingR_custom font_custom cursor-pointer "
                to="/"
              >
                <i class="fas fa-sign-out-alt "></i>&nbsp;{" "}
                <span class="displayNone">Sign Out</span>
              </Link>
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
                  to="/adminDashboard"
                >
                  <center>
                    <i className="fa fa-dashboard"></i>&nbsp; DashBoard
                  </center>
                </Link>
              </li>
              <li class="nav-item">
                <Link
                  class="nav-link btn customTextColor paddingR_custom font_custom cursor-pointer p-4"
                  to="/login"
                >
                  <i class="fas fa-sign-out-alt"></i>&nbsp; Sign Out
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
