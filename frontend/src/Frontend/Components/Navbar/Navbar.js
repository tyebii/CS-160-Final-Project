import "../Navbar/Navbar.css";

function Navbar(){
    return (
        <div className="Navbar">
            <div>
                <image className="OFSLogo" src = " "></image>
                <div className="BrowseDropdown">Browse</div>
            </div>
            <div>
                <div className="SearchBar">
                    
                </div>
                <ul>
                    <li>Login</li>
                    <li>Shopping Cart</li>
                </ul>
            </div>
        </div>
    );
}

export default Navbar;