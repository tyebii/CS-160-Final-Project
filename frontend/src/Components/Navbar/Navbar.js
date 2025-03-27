import "../Navbar/Navbar.css";
import { useEffect, useRef } from "react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import ofsLogo from "./NavbarImages/ofsLogo.png";
import loginIcon from "./NavbarImages/loginIcon.jpg";
import searchIcon from "./NavbarImages/searchIcon.jpg";
import shoppingCartIcon from "./NavbarImages/shoppingCart.png";
import dropDownIcon from "./NavbarImages/dropdownIcon.png";
function Navbar() {
  const [textInput, settextInput] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  useEffect(() => {
    settextInput("");
  }, []);

  function formatText(text) {
    var sol = "";
    var i = 0;
    while (i < text.length) {
      if (text[i] === " ") {
        while (i < text.length && text[i] === " ") {
          i++;
        }
        if (i == text.length) {
          return sol;
        }
        sol += "-";
      } else {
        sol += text[i];
        i += 1;
      }
    }
    return sol;
  }

  return (
    <div className="Navbar-Background">
      <div className="Image-Browse-Container">
        <Link to="/">
          <img className="ofsLogo" src={ofsLogo} alt="logo"></img>
        </Link>
        <div className="Browse-Container" onClick={toggleDropdown}>
          <h1>Browse</h1>
          <img className="dropdownIcon" src={dropDownIcon}></img>
          <div className={`dropdown-content ${dropdownVisible ? "show" : ""}`}>
            <Link to="/search/category/fresh-produce">Fresh Produce</Link>
            <Link to="/search/category/dairy-and-eggs">Dairy and Eggs</Link>
            <Link to="/search/category/meat-and-seafood">Meat and Seafood</Link>
            <Link to="/search/category/frozen-foods">Frozen Foods</Link>
            <Link to="/search/category/bakery-and-bread">Bakery and Bread</Link>
            <Link to="/search/category/pantry-staples">Pantry Staples</Link>
            <Link to="/search/category/beverages">Beverages</Link>
            <Link to="/search/category/snacks-and-sweets">
              Snacks and Sweets
            </Link>
            <Link to="/search/category/health-and-wellness">
              Health and Wellness
            </Link>
          </div>
        </div>
      </div>
      <div className="Search-Login-Shoppingcart-Container">
        <div className="Search-Container">
          <input
            onChange={(e) => {
              settextInput(e.target.value);
            }}
            value={textInput}
            type="text"
            placeholder="Search"
          ></input>
          <Link
            to={
              textInput !== "" ? `/search/product/${formatText(textInput)}` : ""
            }
            className="SearchIcon"
            onClick={() => {
              settextInput("");
            }}
          >
            <img src={searchIcon} alt="search icon" />
          </Link>
        </div>
        <Link to="/login" className="Links">
          <div className="Login">
            <img className="LoginIcon" src={loginIcon} alt="logo"></img>
            <h1>Login</h1>
          </div>
        </Link>
        <Link to="/shoppingcart" className="Links">
          <div className="Shoppingcart">
            <img
              className="ShoppingcartIcon"
              src={shoppingCartIcon}
              alt="logo"
            ></img>
            <h1>Shopping Cart</h1>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
