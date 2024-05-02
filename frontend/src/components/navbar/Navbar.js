// /* eslint-disable react/style-prop-object */
// /* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/features/auth/authSlice";
import cartSlice from "../../redux/features/auth/cartSlice";
import { FaCartShopping } from "react-icons/fa6";
import CustomDropdown from "../CartContainer/CustomDropdownList/CustomDropdown";
import TbContent from "../CartContainer/TbContent";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const checkuserdata = useSelector((state) => state.auth)
  const cartitems = useSelector((state) => state.cart)
  // console.log(cartitems);
  const navigate = useNavigate();
  const [showCartDetails, setshowCartDetails] = useState(false)
  const handleDonation = () => {
    if (!isLoggedIn) {
      alert("Plz login first");
    } else if(checkuserdata.mode=='User') {
      console.log("hello", checkuserdata);
      navigate(`/user/${checkuserdata.userid}`);
    }
    else{
      console.log("Ngo local host", checkuserdata);
      navigate("/ngo2ngodonation");
    }
  };
  const handleCartDetails = () => {
    // console.log('cart');
    setshowCartDetails(!showCartDetails);
  }
  return (
    <nav className="flex items-center justify-between flex-wrap pt-2 pb-2">
      <div className="flex items-center flex-shrink-0 text-white mr-6 lg:mr-72">
        {/* <img src={locofy} className="w-100 h-10 mr-2" alt="Logo" /> */}
        <span className="text-black lg:px-[5rem] sm:px-2 fond-bold">GoodWill</span>
      </div>
      <div className="block lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center px-3 py-2 rounded text-black-500 hover:text-black-400"
        >
          <svg
            className={`fill-current h-3 w-3 ${isOpen ? "hidden" : "block"}`}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
          <svg
            className={`fill-current h-3 w-3 ${isOpen ? "block" : "hidden"}`}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
          </svg>
        </button>
      </div>
      <div
        className={`w-full block flex-grow lg:flex lg:items-center lg:w-auto ${isOpen ? "block" : "hidden"}`}
      >
        <div className="text-sm lg:flex-grow">
          <Link to="/" className="block lg:inline-block lg:mt-0 text-white-900 mr-4 text-lg fond-bold">
            Home
          </Link>
          <Link to="/services" className="block lg:inline-block lg:mt-0 text-white-900 mr-4 text-lg fond-bold">
            Services
          </Link>
          <Link to="/ngo" className="block lg:inline-block lg:mt-0 text-white-900 mr-4 text-lg fond-bold">
            NGO
          </Link>
          <Link to="/contact" className="block lg:inline-block lg:mt-0 text-white-900 mr-4 text-lg fond-bold">
            Contact
          </Link>
          <Link to="/feedback" className="block lg:inline-block lg:mt-0 text-white-900 mr-4 text-lg fond-bold">
            Feedback
          </Link>
          <Link to="/chatapp" className="block lg:inline-block lg:mt-0 text-white-900 mr-4 text-lg fond-bold">
          chatapp
          </Link>
         

          {checkuserdata.isLoggedIn === false ?
            <Link
              to="/login"
              className="block lg:inline-block lg:mt-0 text-white-900 mr-4 text-lg fond-bold"
            >
              <span class="displayNone">Log In</span>
            </Link>
            :
            checkuserdata.mode=='User'?<Link
              to={`/user/${checkuserdata.userid}`}
            >
              <span class="block lg:inline-block lg:mt-0 text-white-900 mr-4 text-lg fond-bold">&nbsp;Your Profile</span>
            </Link>
            :<Link
            to={`/Ngo_dashboard`}
          >
            <span class="block lg:inline-block lg:mt-0 text-white-900 mr-4 text-lg fond-bold">&nbsp;Your Profile</span>
          </Link>
          }
        </div>
        <div>
          <div className="flex">
          {checkuserdata.isLoggedIn && <div className="cartcontainer m-auto pr-2" onClick={handleCartDetails}>
              <FaCartShopping className="cursor-pointer " size="30px" /> {cartitems.length}
              {/* {showCartDetails && cartitems.length !== 0 && <CustomDropdown seq_arr={cartitems.cartitems} />} */}
            </div>}

            <button className="inline-flex items-center bg-amber-500 border-0 py-0 px-4 text-white rounded-full mr-2"
              id="donateBtn"
              onClick={handleDonation}
            >
              Donate
            </button>
           { <CustomDropdown isOpen={showCartDetails} setshowCartDetails={setshowCartDetails} seq_arr={cartitems.cartitems} />}
          </div>

        </div>
      </div>
    </nav>
  )
}
export default Navbar
