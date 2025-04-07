//Import React Functions
import { useEffect, useState } from "react";

import {useAuth} from "../../Context/AuthHook"

//Import axios
import axios from 'axios';

export function MyAccount (){
    const {logout} = useAuth()
    const [result, setResult] = useState({})
    useEffect(() => {
        //Get The Token From The Local Storage
        const token = localStorage.getItem('accessToken');

        //If There Is No Token Alert The User and Log Them Out
        if (!token) {
        alert('No token found');
        logout()
        return;
        }

        axios
            .get("http://localhost:3301/api/customer/customer", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setResult(response.data[0])
            })
            .catch((error) => {
                //If Unauthorized Response
                if (error.response?.status === 401) {
                    alert("You need to login again!");
                    logout();
                }else{
                    alert(`Error Status ${error.status}: ${error.response.data.error}`);
                }
            });
    }, []);
    
    return (
        <section className="bg-gray-50 rounded-lg p-6 m-6 max-w-4xl mx-auto shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Account Details</h2>
            <p className="text-lg text-gray-700 mb-3"><span className="font-bold text-gray-800">UserID:</span> {result.UserID}</p>
            <p className="text-lg text-gray-700 mb-3"><span className="font-bold text-gray-800">First Name:</span> {result.UserNameFirst}</p>
            <p className="text-lg text-gray-700 mb-3"><span className="font-bold text-gray-800">Last Name:</span> {result.UserNameLast}</p>
            <p className="text-lg text-gray-700 mb-3"><span className="font-bold text-gray-800">Phone Number:</span> {result.UserPhoneNumber}</p>
            <p className="text-lg text-gray-700 mb-3"><span className="font-bold text-gray-800">Customer ID:</span> {result.CustomerID}</p>
            <p className="text-lg text-gray-700"><span className="font-bold text-gray-800">Join Date:</span> {result.JoinDate}</p>
        </section>
    )
}