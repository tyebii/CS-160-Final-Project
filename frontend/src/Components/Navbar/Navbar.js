//React functions
import { useState } from 'react';

import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';

//Import Auth Context
import { useAuth } from '../../Context/AuthHook';

import { useCart } from '../../Context/ShoppingcartContext';

// Images for the Navbar
import ofsLogo from './NavbarImages/ofsLogo.png';

import loginIcon from './NavbarImages/loginIcon.jpg';

import searchIcon from './NavbarImages/searchIcon.jpg';

import shoppingCartIcon from './NavbarImages/shoppingCart.png';

import dropDownIcon from './NavbarImages/dropdownIcon.png';

import portalIcon from './NavbarImages/portalIcon.png';

//Navbar Component
function Navbar() {

  const { auth, logout} = useAuth();
  
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("")

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const { cartItems } = useCart();

  //Set Dropdown Visibility
  const toggleDropdown = () => {

    setDropdownVisible(!dropdownVisible);

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

        <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-2xl w-72 z-10">

          {categories.map((category) => (

            <Link 

              key={category} 

              to={`/search/category/${category.trim().replace(/ /g, '-')}`} 

              className="block p-3 text-lg hover:bg-gray-300 rounded-lg"

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

    if (text.trim() === "") {

      alert("There Is Nothing To Search")

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

    <nav className="w-full h-48 bg-gray-100 px-8 flex justify-between items-center shadow-md">

      {/* Left: Logo and Dropdown */}
      <ul className="flex items-center space-x-6">

        {/* Logo */}
        <li>

          <img

            src={ofsLogo}

            alt="ofsLogo"

            className="w-64 h-40 object-contain hover:cursor-pointer"

            onClick={clickLogo}

          />

        </li>

        {/* Dropdown */}

          {auth !== "Employee" && auth !== "Manager" ? (    

            <li

            className="relative flex items-center space-x-2 px-4 py-2 hover:bg-gray-200 rounded-xl cursor-pointer transition duration-200"

            onClick={toggleDropdown}

            >

            <div className="text-2xl font-medium">

              <span className="flex items-center gap-2">

                Browse

                <img src={dropDownIcon} alt="dropdownIcon" className="mt-1 w-6 h-6" />

              </span>

              {renderDropdown(dropdownVisible)}
              
            </div>
          </li>

          ) : null}

        

      </ul>

      {/* Right: Search, Login, Cart, etc */}

      <ul className="flex items-center space-x-6">

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

              className="w-64 h-10 px-4 text-2xl outline-none"

            />

            <div

              className="px-3 py-2 border-l border-gray-400 hover:bg-gray-200 cursor-pointer transition duration-200"

              onClick={clickSearch}

            >

              <img src={searchIcon} alt="search icon" className="w-6 h-6" />

            </div>

          </li>

        </form>

        {/* Login / Logout */}
        <li

          onClick={auth ? clickLogout : clickLogin}

          className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-200 rounded-lg cursor-pointer transition duration-200"

        >

          <img src={loginIcon} alt="loginIcon" className="w-6 h-6" />

          <p className="text-2xl">{auth ? "Logout" : "Login"}</p>

        </li>

        {/* My Account */}

        {auth? (

          <li

            onClick={clickAccount}

            className="px-4 py-2 hover:bg-gray-200 rounded-lg cursor-pointer transition duration-200"

          >

            <p className="text-2xl">My Account</p>

          </li>

        ): null}

        {/* My Orders */}

        {auth === "Customer"? (

          <li

            onClick={clickOrders}

            className="px-4 py-2 hover:bg-gray-200 rounded-lg cursor-pointer transition duration-200"

          >

            <p className="text-2xl">My Orders</p>

          </li>

        ): null}

        {/* Portal / Cart */}

        {auth === "Manager" || auth === "Employee" ? (

          <li

            onClick={clickPortal}

            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-200 rounded-lg cursor-pointer transition duration-200"

          >

            <img

              src={portalIcon}

              alt="portal icon"

              className="w-8 h-8 object-contain"

            />

            <p className="text-2xl">Portal</p>

          </li>

        ) : auth === "Customer" ? (
          
          <li

            onClick={auth ? clickShoppingCart : clickLogin}

            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-200 rounded-lg cursor-pointer transition duration-200"

          >

            {cartItems.size > 0 && (

              <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded-full">

                {cartItems.size}

              </span>

            )}

            <img

              src={shoppingCartIcon}

              alt="shopping cart icon"

              className="w-8 h-8 object-contain"

            />

            <p className="text-2xl">Shopping Cart</p>

          </li>


        ):null}

      </ul>

    </nav>

  );

}

export default Navbar;
