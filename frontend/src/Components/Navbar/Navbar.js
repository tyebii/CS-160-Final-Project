import { useState } from 'react';

import { useEffect } from 'react';

import { useRef } from 'react';

import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../Context/AuthHook';

//Import React Icons
import {

  FaBars,

} from "react-icons/fa";

// Images for the Navbar
import ofsLogoBig from './NavbarImages/ofsLogo_big.png';

import { useCart } from '../../Context/ShoppingcartContext';

import loginIcon from './NavbarImages/loginIcon.jpg';

import searchIcon from './NavbarImages/searchIcon.jpg';

import shoppingCartIcon from './NavbarImages/shoppingCart.png';

import dropDownIcon from './NavbarImages/dropdownIcon.png';

import portalIcon from './NavbarImages/portalIcon.png';

//Formatting for the Navbar input
import {validateProduct} from '../Utils/Formatting'

//Navbar Component
function Navbar() {

  const { auth, logout } = useAuth();

  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("")

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const dropdownRef = useRef();

  useEffect(() => {
    document.body.addEventListener('click', () => {
      if (dropdownRef.current && !event.composedPath().includes(dropdownRef.current)) {
        setDropdownVisible(false)
      }
    });
  }, []);

  const { cartItems } = useCart();

  //Set Dropdown Visibility
  const toggleDropdown = () => {

    setDropdownVisible(!dropdownVisible);

  };

  //Set Drawer Visibility
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  //Render The Dropdown
  const renderDropdown = (visible) => {

    if (!visible) return null;

    const categories = [

      'Fresh Produce',

      'Dairy and Eggs',

      'Meat and Seafood',

      'Frozen Foods',

      'Bakery and Bread',

      'Pantry Staples',

      'Beverages',

      'Snacks and Sweets',

      'Health and Wellness',

    ];

    return (

      <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-white shadow-lg border rounded-2xl w-36 md:w-48 z-10">

        {categories.map((category) => (

          <Link

            key={category}

            to={`/search/category/${category.trim().replace(/ /g, '-')}`}

            className="block p-3 text-lg text-black hover:bg-gray-300 rounded-lg"

          >

            {category}

          </Link>

        ))}

      </div>

    );

  };

  //Clicking The Logo
  const clickLogo = () => {

    navigate('/');

  }

  //Clicking The Search Icon
  const clickSearch = () => {

    let text = searchText;

    if(validateProduct(text) === false){

      return;

    }

    setSearchText("")

    navigate(`/search/item/${text.trim().replace(/ /g, '-')}`);

  }

  //Click login icon
  const clickLogin = () => {

    navigate("/login")

  }

  //Logout Click
  const clickLogout = () => {

    logout()

    navigate("/")

  }

  //Click shopping cart
  const clickShoppingCart = () => {

    navigate("/shoppingcart")

  }

  //Click orders
  const clickOrders = () => {

    navigate("/orders")

  }

  //Click orders
  const clickAccount = () => {

    navigate("/account")

  }

  //Click portal
  const clickPortal = () => {

    navigate("/portal")

  }

  return (

    <nav className="relative w-full h-16 bg-green-900 flex justify-between items-center shadow-md">

      {/* Left: Logo and Dropdown */}
      <ul className="flex items-center gap-2 pl-4">

        {/* Logo */}
        <li>

          <img

            className="invert min-w-20 min-h-16 h-16  object-contain hover:cursor-pointer"

            src={ofsLogoBig}

            alt="ofsLogoBig"

            onClick={clickLogo}

          />

        </li>

        {/* Dropdown */}

        <li

          className="relative flex items-center space-x-2 mx-2 p-2 md:pr-4 hover:bg-green-800 rounded-xl cursor-pointer transition duration-200"

          ref={dropdownRef}

        >

          {auth !== "Employee" && auth !== "Manager" ? (

            <div className="text-lg md:text-2xl text-white mx-2">

              <span className="flex items-center" onMouseOver={toggleDropdown}>

                Categories

                <img src={dropDownIcon} alt="dropdownIcon" className="invert mt-1 w-4 md:w-6 h-4 md:h-6 mx-2" />

              </span>

              {renderDropdown(dropdownVisible)}

            </div>

          ) : null}

        </li>

      </ul >

      {/* Right: Search, Login, Cart, etc */}

      < ul className="flex w-full justify-end items-center space-x-6 pr-4" >

        {/* Search Bar */}

        <form
          onSubmit={(e) => {

            e.preventDefault();

            clickSearch();

          }}

        >
          <li className="flex items-center bg-white border border-gray-400 rounded-lg overflow-hidden">

            <input

              onChange={(e) => setSearchText(e.target.value)}

              required

              value={searchText}

              maxLength={255}

              type="search"

              placeholder="Search"

              className="w-full h-10 px-4 text-2xl outline-none"

            />

            <div

              className="px-3 py-2 border-l border-gray-400 hover:bg-gray-200 cursor-pointer transition duration-200"

              onClick={clickSearch}

            >

              <img src={searchIcon} alt="search icon" className="min-w-6 h-6" />

            </div>

          </li >

        </form >

        {/* Portal / Cart */}

        {
          auth === "Manager" || auth === "Employee" ? (

            <li

              onClick={clickPortal}

              className="hidden lg:flex items-center space-x-2 p-2 hover:bg-green-800 rounded-lg cursor-pointer transition duration-200 text-white"

            >

              <img

                src={portalIcon}

                alt="portal icon"

                className="w-8 h-8 invert object-contain"

              />

              <p className="text-2xl">Portal</p>

            </li>

          ) : (

            <li

              onClick={auth ? clickShoppingCart : clickLogin}

              className="hidden lg:flex items-center space-x-2 text-nowrap py-2 px-4 hover:bg-green-800 rounded-lg cursor-pointer transition duration-200 text-white"

            >

              <img

                src={shoppingCartIcon}

                alt="shopping cart icon"

                className="w-8 h-8 invert object-contain"

              />

              {cartItems.size > 0 && (

                <span className="absolute z-10 scale-50 top-2 translate-x-1.5 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded-full">

                  {cartItems.size}

                </span>

              )}

              <p className="text-2xl">My Cart</p>

            </li>

          )
        }


        {/* Login / Logout */}
        <li

          onClick={auth ? clickLogout : clickLogin}

          className="hidden lg:flex items-center space-x-2 p-2 hover:bg-green-800 text-white rounded-lg cursor-pointer transition duration-200"

        >

          <img src={loginIcon} alt="loginIcon" className="invert w-6 h-6" />

          <p className="text-2xl">{auth ? "Logout" : "Login"}</p>

        </li>

        {/* Sidebar */}
        <FaBars
          className="flex min-w-8 items-center text-4xl text-white space-x-2 hover:cursor-pointer"
          onClick={toggleDrawer}
        >
        </FaBars>

        <div
          className={`absolute top-0 right-0 z-20 w-24 md:w-48 h-auto bg-white border rounded-bl-xl shadow-lg transition-transform transform ${drawerOpen ? "-translate-x-0" : "translate-x-full"}`}
        >
          <div className="p-4 mt-4 text-xl">

            <ul className="space-y-4">

              {/* Portal / Cart */}
              {auth === "Manager" || auth === "Employee" ? (

                <li

                  onClick={clickPortal}

                  className="hover:text-green-600 rounded-lg cursor-pointer transition duration-200"

                >

                  <p className="">Portal</p>

                </li>

              ) : (

                <li

                  onClick={() => { { auth ? clickShoppingCart() : clickLogin() }; toggleDrawer() }}

                  className="hover:text-green-600 rounded-lg cursor-pointer transition duration-200"

                >
              
                  <p className="">Shopping Cart</p>

                </li>

              )}

              {/* My Account */}
              {auth ? (

                <li

                  onClick={() => { clickAccount(); toggleDrawer() }}

                  className="hover:text-green-600 rounded-lg cursor-pointer transition duration-200"

                >

                  <p className="">My Account</p>

                </li>

              ) : null}

              {/* My Orders */}
              {auth === "Customer" ? (

                <li

                  onClick={() => { clickOrders(); toggleDrawer() }}

                  className="hover:text-green-600 rounded-lg cursor-pointer transition duration-200"

                >

                  <p className="">My Orders</p>

                </li >

              ) : null}

              <li

                onClick={auth ? clickLogout : clickLogin}

                className="hover:text-red-500 rounded-lg cursor-pointer transition duration-200"

              >

                <p className="">{auth ? "Logout" : "Login"}</p>

              </li>

            </ul >

          </div >

          <button
            onClick={toggleDrawer}
            className="absolute top-0 right-4 text-gray-600 hover:text-black text-2xl font-bold"
          >
            &times;
          </button>

        </div >

      </ul >

    </nav >

  );

}

export default Navbar;
