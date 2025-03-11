import '../Navbar/Navbar.css'
import React, { useState } from 'react';
import {Link } from "react-router-dom";
import ofsLogo from "./NavbarImages/ofsLogo.png"
import loginIcon from "./NavbarImages/loginIcon.jpg"
import searchIcon from "./NavbarImages/searchIcon.jpg"
import shoppingCartIcon from "./NavbarImages/shoppingCart.png"
import dropDownIcon from "./NavbarImages/dropdownIcon.png"
function Navbar(){
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };


    return( 
        <div className = "Navbar-Background">
            <div className="Image-Browse-Container"> 
                <Link to="/">
                    <img  className = "ofsLogo" src = {ofsLogo}  alt = "logo"></img>
                </Link>
                <div className="Browse-Container" onClick={toggleDropdown}>
                    <h1>Browse</h1>
                    <img className = "dropdownIcon" src = {dropDownIcon}></img>
                    <div className={`dropdown-content ${dropdownVisible ? 'show' : ''}`}>
                            <a href="#">Fresh Produce</a>
                            <a href="#">Dairy and Eggs</a>
                            <a href="#">Meat and Seafood</a>
                            <a href="#">Frozen Foods</a>
                            <a href="#">Bakery and Bread</a>
                            <a href="#">Pantry Staples</a>
                            <a href="#">Beverages</a>
                            <a href="#">Snacks and Sweets</a>
                            <a href="#">Health and Wellness</a>
                    </div>
                </div>
                
                
                
               
            </div>
            <div className="Search-Login-Shoppingcart-Container">
                <div className='Search-Container'>
                    <input type="text" placeholder='Search'></input>
                    <Link to ="/search" className = "SearchIcon">
                        <img src = {searchIcon}></img>
                    </Link>
                </div>
                <Link to="/login" className='Links'>
                    <div className='Login'>
                        <img className = "LoginIcon" src = {loginIcon} alt = "logo"></img>
                        <h1>Login</h1>
                    </div>
                </Link>
                <Link to="/shoppingcart" className='Links'>
                    <div className='Shoppingcart'>
                        <img className = "ShoppingcartIcon" src = {shoppingCartIcon} alt = "logo"></img>
                        <h1>Shopping Cart</h1>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Navbar;