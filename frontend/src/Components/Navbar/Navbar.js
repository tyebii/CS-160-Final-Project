//React functions
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Context/AuthHook';

// Images for the Navbar
import ofsLogo from './NavbarImages/ofsLogo.png';
import loginIcon from './NavbarImages/loginIcon.jpg';
import searchIcon from './NavbarImages/searchIcon.jpg';
import shoppingCartIcon from './NavbarImages/shoppingCart.png';
import dropDownIcon from './NavbarImages/dropdownIcon.png';
import { useNavigate } from 'react-router-dom';

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

  //Format the search input
  function formatText(text){
    var sol = "";
    var i = 0
    while(i < text.length){
        if(text[i] === " "){
            while (i<text.length && text[i] === " "){
                i++;
            }
            if (i==text.length){
                return sol;
            }
            sol += "-";
        }
        else{
            sol += text[i];
            i +=1 
        }
    }
    return sol;
  }

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
            to={`/search/category/${category.replace(/ /g, '-')}`} 
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
    navigate(`/search/item/${formatText(text.toLowerCase())}`);
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

  //Component
  return (
    <nav className="w-full h-48 bg-gray-100 flex justify-between items-center">
      {/*Logo and Dropdown Menu*/}
      <ul className="flex items-center ml-0">
        {/*Logo*/}
        <li>
          <img src={ofsLogo} alt="ofsLogo" className="w-72 h-48 hover:cursor-pointer" onClick={clickLogo}/>
        </li>
        {/*Dropdown*/}
        <li className="relative flex items-center p-5 hover:bg-gray-300 rounded-xl hover:cursor-pointer" onClick={toggleDropdown}>
          <p className="text-xl">Browse</p>
          <img src={dropDownIcon} alt="dropdownIcon" className="w-12 h-12 pl-2" />
          {renderDropdown(dropdownVisible)}
        </li>
      </ul>

      {/*Search Bar*/}
      <ul className="flex items-center mr-24 space-x-8">
        <li className="flex items-center bg-white border-2 border-black rounded-lg">
            <input onChange={(e)=>{setSearchText(e.target.value)}} value = {searchText} type="text" placeholder="Search" className="w-72 h-12 text-lg p-2 outline-none"/>
            <div className="p-2 border-l-2 border-black hover:bg-gray-300 rounded-lg">
              <img src={searchIcon} onClick={clickSearch} alt="search icon" className="w-10 h-8 hover:cursor-pointer" />
            </div>
        </li>

        {/*Login*/}
        <li onClick={auth ? clickLogout : clickLogin} className="flex items-center space-x-2 p-2 hover:bg-gray-300 rounded-lg hover:cursor-pointer">
          <img src={loginIcon} alt="loginIcon" className="w-12 h-12" />
          <p>{auth ? "Logout" : "Login"}</p>
        </li>

        {/* View Account */}
        {auth ? (
          <li 
            onClick={clickAccount}
            className="flex items-center space-x-2 p-2 hover:bg-gray-300 hover:cursor-pointer rounded-lg"
          >
            <p>My Account</p>
          </li>
        ) : null}

        {/* View Orders */}
        {auth ? (
          <li 
            onClick={clickOrders}
            className="flex items-center space-x-2 p-2 hover:bg-gray-300 hover:cursor-pointer rounded-lg"
          >
            <p>My Orders</p>
          </li>
        ) : null}

        {/*Shopping Cart*/}
        <li onClick={auth ? clickShoppingCart : clickLogin} className="flex items-center space-x-2 p-2 hover:bg-gray-300 hover:cursor-pointer rounded-lg">
          <img src={shoppingCartIcon} alt="shopping cart icon" className="w-20 h-12" />
          <p>Shopping Cart</p>
        </li>



      </ul>

    </nav>
  );
}

export default Navbar;
