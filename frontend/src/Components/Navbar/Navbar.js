//React functions
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

//Import Auth Context
import { useAuth } from '../../Context/AuthHook';

// Images for the Navbar
import ofsLogo from './NavbarImages/ofsLogo.png';
import loginIcon from './NavbarImages/loginIcon.jpg';
import searchIcon from './NavbarImages/searchIcon.jpg';
import shoppingCartIcon from './NavbarImages/shoppingCart.png';
import dropDownIcon from './NavbarImages/dropdownIcon.png';
import portalIcon from './NavbarImages/portalIcon.png';

//Navbar Component
function Navbar() {
  //Authentication hook
  const { auth, logout} = useAuth();
  
  //Navigation hook
  const navigate = useNavigate();

  //Text
  const [searchText, setSearchText] = useState("")

  //Dropdown Visibility
  const [dropdownVisible, setDropdownVisible] = useState(false);

  //Invert the dropdown
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //Renders the components of the browse
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
  
      //Drop Down Menu
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
  
  //Click the OFS logo
  const clickLogo = () => {
    navigate('/');
  }

  //Click the search icon
  const clickSearch = () => {
    let text = searchText; 
    if (text.trim() === "") {
      return;
    }

    setSearchText("")
    navigate(`/search/item/${text.trim().replace(/ /g, '-')}`);
  }

  //Click login icon
  const clickLogin = () => {
    navigate("/login")
  }

  //Logout
  const clickLogout = () => {
    logout()
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

  //Component
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
        <li
          className="relative flex items-center space-x-2 px-4 py-2 hover:bg-gray-200 rounded-xl cursor-pointer transition duration-200"
          onClick={toggleDropdown}
        >
          <p className="text-2xl font-medium">
            {auth === "Employee" || auth === "Manager" ? "Tools" : "Browse"}
          </p>
          <img src={dropDownIcon} alt="dropdownIcon" className="w-6 h-6" />
          {renderDropdown(dropdownVisible)}
        </li>
      </ul>

      {/* Right: Search, Login, Cart, etc */}
      <ul className="flex items-center space-x-6">
        {/* Search Bar */}
        <li className="flex items-center bg-white border border-gray-400 rounded-lg overflow-hidden">
          <input
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            type="text"
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

        {/* Login / Logout */}
        <li
          onClick={auth ? clickLogout : clickLogin}
          className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-200 rounded-lg cursor-pointer transition duration-200"
        >
          <img src={loginIcon} alt="loginIcon" className="w-6 h-6" />
          <p className="text-2xl">{auth ? "Logout" : "Login"}</p>
        </li>

        {/* My Account */}
        {auth === "Customer" && (
          <li
            onClick={clickAccount}
            className="px-4 py-2 hover:bg-gray-200 rounded-lg cursor-pointer transition duration-200"
          >
            <p className="text-2xl">My Account</p>
          </li>
        )}

        {/* My Orders */}
        {auth === "Customer" && (
          <li
            onClick={clickOrders}
            className="px-4 py-2 hover:bg-gray-200 rounded-lg cursor-pointer transition duration-200"
          >
            <p className="text-2xl">My Orders</p>
          </li>
        )}

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
        ) : (
          <li
            onClick={auth ? clickShoppingCart : clickLogin}
            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-200 rounded-lg cursor-pointer transition duration-200"
          >
            <img
              src={shoppingCartIcon}
              alt="shopping cart icon"
              className="w-8 h-8 object-contain"
            />
            <p className="text-2xl">Shopping Cart</p>
          </li>
        )}
      </ul>
    </nav>

  );
}

export default Navbar;
