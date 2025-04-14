// Import axios
import axios from "axios";

// Import navigation functionality
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { signUpFormat } from "../Utils/Formatting";

// Signup Component
export function Signup() {
    // Use navigate hook
    const navigate = useNavigate();

    // State for the form data
    const [formData, setFormData] = useState({
        UserID: "",
        Password: "",
        UserNameFirst: "",
        UserNameLast: "",
        UserPhoneNumber: ""
    });

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handler function on submit
    const clickSubmit = (e) => {
        // Prevent submission and refresh
        e.preventDefault();

        //Check Format
        if(signUpFormat(formData.UserID, formData.Password, formData.UserNameFirst, formData.UserNameLast, formData.UserPhoneNumber ) === false){
            return
        }

        // Make an axios request to the backend 
        axios.post(
            "http://localhost:3301/api/authentication/signup/customer", 
            formData
        )
        .then((results) => {
            console.log("Success");
            // Navigate home
            navigate("/");
        })
        .catch((error) => {
            alert(`Error Status ${error.response?.status}: ${error.response?.data.error}`);
        });
    };

    return (
        <section>
            <form onSubmit={clickSubmit} className="m-auto bg-white p-6 rounded-2xl shadow-lg w-96 mt-10">
                <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>
                
                <label className="block mb-2 text-gray-700">Username</label>
                <input
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    id="User-ID"
                    name="UserID"
                    type="text"
                    placeholder="Enter Username"
                    required
                    value={formData.UserID}
                    onChange={handleChange}
                />
                
                <label className="block mb-2 text-gray-700">Password</label>
                <input
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    id="Password"
                    name="Password"
                    type="password"
                    placeholder="Enter Password"
                    required
                    value={formData.Password}
                    onChange={handleChange}
                />
                
                <label className="block mb-2 text-gray-700">First Name</label>
                <input
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    id="First-Name"
                    name="UserNameFirst"
                    type="text"
                    placeholder="Enter First Name"
                    required
                    value={formData.UserNameFirst}
                    onChange={handleChange}
                />
                
                <label className="block mb-2 text-gray-700">Last Name</label>
                <input
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    id="Last-Name"
                    name="UserNameLast"
                    type="text"
                    placeholder="Enter Last Name"
                    required
                    value={formData.UserNameLast}
                    onChange={handleChange}
                />
                
                <label className="block mb-2 text-gray-700">Phone Number</label>
                <input
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    id="Phone-Number"
                    name="UserPhoneNumber"
                    type="text"
                    placeholder="Enter Phone Number"
                    required
                    value={formData.UserPhoneNumber}
                    onChange={handleChange}
                />
                
                <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200">
                    Sign Up
                </button>
            </form>
        </section>
        
    );
}
