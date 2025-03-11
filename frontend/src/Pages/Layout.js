import '../App.css';
import { Outlet} from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";
function Layout(){
    return (
        <div className='Layout'>
            <Navbar></Navbar>
            <Outlet />
        </div>
    );
}
export default Layout;