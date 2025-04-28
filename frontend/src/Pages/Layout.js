import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";
import Contact from "../Components/Contact/ContactInfo";

function Layout() {
    return (
        <div className="min-h-screen flex flex-col items-center box-border">
            <Navbar />
            <div className="flex flex-col justify-between w-full flex-grow bg-white">
                <Outlet />
            </div>
            <Contact />
        </div>
    );
}

export default Layout;
