//Import UseEffect
import { useEffect, useState } from "react";

//Import Use Navigate
import { useNavigate } from "react-router-dom";

//Import Axios
import axios from 'axios';

//Token Validation Hook
import { useValidateToken } from '../Utils/TokenValidation';

//Error Message Hook
import { useErrorResponse } from '../Utils/AxiosError';

//Gets And Present Account Information
export function MyAccount (){

    const validateToken = useValidateToken();

    const { handleError } = useErrorResponse(); 

    const navigate = useNavigate()

    const [result, setResult] = useState({})

    useEffect(() => {

        const token = validateToken();

        axios

            .get("http://localhost:3301/api/customer/customer", {

                headers: {

                    Authorization: `Bearer ${token}`,

                },

            })

            .then((response) => {

                if(response.data.length === 0){

                    alert("No Results Found")

                    navigate('/')

                }

                setResult(response.data[0])

            })

            .catch((error) => {

                handleError(error);

            });

    }, []);
    
    return (
        
        <section className="bg-white rounded-lg p-8 m-8 max-w-4xl mx-auto shadow-2xl">

            <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Account Details</h2>

            <div className="space-y-4">

                <p className="text-lg text-gray-700"><span className="font-semibold text-gray-800">UserID:</span> {result.UserID}</p>
                
                <p className="text-lg text-gray-700"><span className="font-semibold text-gray-800">First Name:</span> {result.UserNameFirst}</p>
                
                <p className="text-lg text-gray-700"><span className="font-semibold text-gray-800">Last Name:</span> {result.UserNameLast}</p>
                
                <p className="text-lg text-gray-700"><span className="font-semibold text-gray-800">Phone Number:</span> {result.UserPhoneNumber}</p>
                
                <p className="text-lg text-gray-700"><span className="font-semibold text-gray-800">Customer ID:</span> {result.CustomerID}</p>
                
                <p className="text-lg text-gray-700">

                    <span className="font-semibold text-gray-800">Join Date: </span> 

                    {result.JoinDate ? result.JoinDate.slice(0, 10) : "Loading..."}

                </p>

            </div>

        </section>

    )
}