//Refactored April 12

//Import React Functions
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Import Custom Context
import {useAuth} from "../../Context/AuthHook"

//Import Axios
import axios from 'axios';

//My Account Area
export function MyAccount (){

    const navigate = useNavigate()

    const {logout} = useAuth()

    const [result, setResult] = useState({})

    useEffect(() => {

        const token = localStorage.getItem('accessToken');

        if (!token) {

            alert('Login Information Not found')

            logout()

            navigate('/login')

            return;

        }

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

                if (error.response?.status === 401) {

                    alert("You Need To login Again!");

                    logout();

                    navigate('/login')

                }else{

                    alert(`Error Status ${error.status}: ${error.response.data.error}`);

                }

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