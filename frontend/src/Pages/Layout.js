import '../App.css';
import { Outlet} from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";
import Contact from "../Components/Contact/ContactInfo";
function Layout(){
    return (
        <div className='Layout'>
            <Navbar></Navbar>
            <Outlet />
            <Contact></Contact>
        </div>
    );
}
export default Layout;