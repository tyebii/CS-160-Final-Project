import '../App.css';
import { Outlet} from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";
import Contact from "../Components/Contact/ContactInfo";
function Layout(){
    return (
        <div className='Layout'>
            <Navbar></Navbar>
            <div className='flex flex-col justify-between w-full items-center h-[100%]'>
                <Outlet />
                <Contact></Contact>
            </div>
        </div>
    );
}
export default Layout;