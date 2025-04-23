//Refactored on Apr 12

//React Functions
import { useNavigate } from "react-router-dom";

import { useState } from 'react';

//Import Auth Hook
import {useAuth} from '../../Context/AuthHook'

//Import Format
import { loginFormat } from "../Utils/Formatting";

//Import Axios
import axios from 'axios'; 

//Error Message Hook
import { useErrorResponse } from '../Utils/AxiosError';

//Login Component
function Login() {
    
    const { handleError } = useErrorResponse();  

    const [username, setUserName] = useState("");

    const [password, setPassword] = useState("");

    const navigate = useNavigate(); 

    const {login} = useAuth();

    const handleSubmit = (e) => {

        e.preventDefault();

        if(!loginFormat(username,password)){

            return;

        }

        axios.post(

            "http://localhost:3301/api/authentication/login", 

            { 
                UserID: username,

                Password: password

            }

        )

        .then((results) => {

            let token = results.data?.accessToken

            localStorage.setItem("accessToken", token);

            login()

            navigate("/");

            return;

        })

        .catch((error) => {

            handleError(error)

            return ;

        });

    };

    const clickSignUp = () => {

        navigate("/signup")

        return;

    }

    return (

        <section className="flex justify-center items-center h-screen w-screen">

            <div className="bg-white shadow-2xl rounded-3xl p-10 w-[450px]">

                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h2>
                
                {/* Login Form */}
                <form onSubmit={handleSubmit}>

                    <input

                        required

                        type="text"

                        minLength={5}
                        
                        maxLength={255}

                        placeholder="Username"

                        value={username}

                        onChange={(e) => setUserName(e.target.value)}

                        className="w-full p-4 text-lg border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-4 focus:ring-blue-400"
                   
                   />

                    <input

                        required   

                        type="password"

                        min={7}

                        maxLength={255}

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
