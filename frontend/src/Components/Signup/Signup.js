// Import axios
import axios from "axios";

// Import navigation functionality
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Signup Component
export function Signup() {
    // Use navigate hook
    const navigate = useNavigate();

    const format = ()=> {
        if(formData.UserID==null){
            alert("Please Fill In User ID")
            return false
          } 
          
        if(formData.UserNameFirst==null){
              alert("Please Fill In First Name")
              return false
          } 
          
        if(formData.UserNameLast==null){
              alert("Please Fill In Last Name")
              return false
          } 
          
        if(formData.UserPhoneNumber==null){
              alert("Please Fill In Phone Number")
              return false
          } 

        if(formData.Password==null){
              alert("Please Fill In Password")
              return false
          }

        if(typeof formData.UserID !== "string"){
            alert("User ID Must Be A String")
            return false
        }
    
        if(typeof formData.Password !== "string"){
            alert("Password Must Be A String")
            return false
        }
        
        if (typeof formData.UserNameFirst !== "string"){
            alert("First Name Must Be A String")
            return false
        }
    
        if (typeof formData.UserNameLast !== "string"){
            alert("Last Name Must Be A String")
            return false
        }
    
        if (typeof formData.UserPhoneNumber !== "string"){
            alert("Phone Number Must Be A String")
            return false
        }

        if(formData.UserID.trim().length < 5){
            alert("User ID Must Be At Least 5 Characters Long")
            return false
        }
    
        if(formData.UserID.length > 255){
            alert("User ID Must Be Less Than or Equal To 255 Characters Long")
            return false
        }
    
        if(formData.UserNameFirst.trim().length < 2){
            alert("First Name Must Be At Least 2 Characters Long")
            return false
        }
    
        if(formData.UserNameFirst.length > 255){
            alert("First Name Must Be Less Than or Equal To 255 Characters Long")
            return false
        }
    
        if(formData.UserNameLast.trim().length < 2){
            alert("Last Name Must Be At Least 2 Characters Long")
            return false
        }
    
        if(formData.UserNameLast.length > 255){
            alert("Last Name Must Be Less Than or Equal To 255 Characters Long")
            return false
        }

        const hasSpaces = (input) => /\s/.test(input);

        if(hasSpaces(formData.UserID)){
            alert("User ID Must Not Contain Spaces")
            return false
        }

        if(hasSpaces(formData.Password)){
            alert("Password Must Not Contain Spaces")
            return false
        }

        if(hasSpaces(formData.UserNameFirst)){
            alert("First Name Must Not Contain Spaces")
            return false
        }

        if(hasSpaces(formData.UserNameLast)){
            alert("Last Name Must Not Contain Spaces")
            return false
        }

        if(hasSpaces(formData.UserPhoneNumber)){
            alert("Phone Number Must Not Contain Spaces")
            return false
        }
    
        const regexNumber = /^1-\d{3}-\d{3}-\d{4}$/;
    
        if(!formData.UserPhoneNumber.match(regexNumber)){
            alert("Phone Number Must Be In The Format 1-XXX-XXX-XXXX")
            return false
        }

        const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if(!formData.Password.match(regexPassword)){
            alert("Password Must Be At Least 8 Characters Long, Contain At Least One Uppercase Letter, One Lowercase Letter, One Number, And One Special Character")
            return false
        }

        return true
    }

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
        if(format() === false){
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
            alert(`Error Status ${error.response.status}: ${error.response.data.error}`);
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
