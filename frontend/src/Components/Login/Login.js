//React Functions
import { useNavigate } from "react-router-dom";
import { useState } from 'react';

//Import Auth Hook
import {useAuth} from '../../Context/AuthHook'

//Import Axios
import axios from 'axios'; // Make sure axios is imported

//Login Component
function Login() {
    //Username Var
    const [username, setUserName] = useState("");

    //Password Var
    const [password, setPassword] = useState("");

    //Navigation Hook
    const navigate = useNavigate();  // Hook for navigation

    //Authentication Hook
    const {login} = useAuth();


    //Submission of Login Form
    const handleSubmit = (e) => {
        //Prevent page refresh and default sending
        e.preventDefault();

        //Axios request to backend
        axios.post(
            "http://localhost:3301/api/authentication/login", 
            { // Request body (JSON payload)
                UserID: username,
                Password: password
            }
        )
        //Results of request
        .then((results) => {
            //Result
            let token = results.data.accessToken

            //Set token in the local storage
            localStorage.setItem("accessToken", token);

            //Set the auth context to the token
            login()

            //Navigate home
            navigate("/");
        })
        .catch((err) => {
            alert(`Error Status ${err.status}: ${err.response.data.error}`);
        });
    };

    //Handle the signup
    const clickSignUp = () => {
        navigate("/signup")
    }

    //HTML
    return (
        <section className="flex justify-center items-center h-screen w-screen">
            <div className="bg-white shadow-2xl rounded-3xl p-10 w-[450px]">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h2>
                
                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                    <input
                        required
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full p-4 text-lg border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-4 focus:ring-blue-400"
                    />

                    <input
                        required    
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-4 text-lg border border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-4 focus:ring-blue-400"
                    />

                    <button
                        className="w-full bg-blue-600 text-white py-3 text-lg font-semibold rounded-xl hover:bg-blue-700 transition"
                    >
                        Submit
                    </button>
                </form>

                {/* Styled Sign-Up Link */}
                <div className="mt-4 text-center">
                    <span className="text-gray-600 text-md">Don't have an account? </span>
                    <p 
                    onClick={clickSignUp} 
                    className="text-blue-600 font-semibold text-sm inline-block hover:underline hover:cursor-pointer hover:text-blue-800 transition"
                    >
                        Sign Up
                    </p>
                </div>
            </div>
        </section>
    );
}

export default Login;
