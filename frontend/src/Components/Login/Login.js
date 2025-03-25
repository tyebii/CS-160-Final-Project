import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { Link } from "react-router-dom";
import {useAuth} from '../../Context/AuthHook'
import axios from 'axios'; // Make sure axios is imported

function Login() {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();  // Hook for navigation
    const { login , auth} = useAuth();
    const handleSubmit = (e) => {
        e.preventDefault();
        
        axios.post(
            "http://localhost:3301/api/login", 
            { // Request body (JSON payload)
                UserID: username,
                Password: password
            }, 
            { // Headers (Third Argument)
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        .then((results) => {
            let token = results.data.accessToken
            localStorage.setItem("accessToken", token);
            login()
            console.log(auth)
            navigate("/");
        })
        .catch((err) => {
            console.log("Error:", err.response ? err.response.data : err.message);
        });
    };

    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <div className="bg-white shadow-2xl rounded-3xl p-10 w-[450px]">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h1>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full p-4 text-lg border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-4 focus:ring-blue-400"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-4 text-lg border border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-4 focus:ring-blue-400"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 text-lg font-semibold rounded-xl hover:bg-blue-700 transition"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </form>

                {/* Styled Sign-Up Link */}
                <div className="mt-4 text-center">
                    <span className="text-gray-600 text-md">Don't have an account? </span>
                    <Link to="/signup" className="text-blue-600 font-semibold hover:underline hover:text-blue-800 transition">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
