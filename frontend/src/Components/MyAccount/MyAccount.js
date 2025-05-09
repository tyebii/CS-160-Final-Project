import { useEffect, useState } from "react";

import { useErrorResponse } from '../Utils/AxiosError';

import { useNavigate } from "react-router-dom";

import {useAuth} from "../../Context/AuthHook"

import axios from 'axios';

//Gets And Present Account Information
export function MyAccount (){

    const { handleError } = useErrorResponse();

    const navigate = useNavigate()

    const {auth, logout} = useAuth()

    const [result, setResult] = useState({})

    //Fetch The Account Information
    useEffect(() => {

        const fetchAccount = async () => {

            if(!auth){

                return

            }

            const endpoints = {

                Customer: "http://localhost:3301/api/customer/customer",

                Employee: "http://localhost:3301/api/customer/employee",

                Manager: "http://localhost:3301/api/customer/employee",

            };
        
            const endpoint = endpoints[auth];
        
            if (!endpoint) {
                
                logout();

                navigate("/login");

                return;

            }
        
            try {

                const response = await axios.get(endpoint, {

                withCredentials: true,

                headers: { 'Content-Type': 'application/json' },

                });

                setResult(response.data[0]);
        
            } catch (error) {

                handleError(error);

            }

        };
      
        fetchAccount();

    }, [auth]);
      
    //Delete The Account
    const handleDelete = async () => {

        try {

            await axios.delete("http://localhost:3301/api/customer/customer", {

            withCredentials: true,

            headers: { 'Content-Type': 'application/json' },

            });

            logout();

            navigate("/");

        } catch (error) {

            handleError(error);

        }

    };

    return (
        
        <section className="flex flex-col w-full h-full p-8 bg-white items-center text-center">

        <h2 className="py-4 px-8 text-3xl text-gray-800 mb-8">Account Details</h2>
    
        <div className="px-8 space-y-4 mb-12">
    
            <p className="text-lg text-gray-700"><span className="font-semibold text-xl text-gray-800">UserID:</span> {result.UserID}</p>
            
            <p className="text-lg text-gray-700"><span className="font-semibold text-gray-800">First Name:</span> {result.UserNameFirst}</p>
            
            <p className="text-lg text-gray-700"><span className="font-semibold text-gray-800">Last Name:</span> {result.UserNameLast}</p>
            
            <p className="text-lg text-gray-700"><span className="font-semibold text-gray-800">Phone Number:</span> {result.UserPhoneNumber}</p>
            
            {auth === "Customer" && (
                <>
                    <p className="text-lg text-gray-700"><span className="font-semibold text-gray-800">Customer ID:</span> {result.CustomerID}</p>
                    <p className="text-lg text-gray-700">
                        <span className="font-semibold text-gray-800">Join Date: </span> 
                        {result.JoinDate ? result.JoinDate.slice(0, 10) : "Loading..."}
                    </p>
                </>
            )}
    
            {(auth === "Manager" || auth === "Employee") && (
                <>
                    <p className="text-lg text-gray-700"><span className="font-semibold text-gray-800">Employee ID:</span> {result.EmployeeID}</p>
                    <p className="text-lg text-gray-700"><span className="font-semibold text-gray-800">Hire Date:</span> {result.EmployeeHireDate?.slice(0, 10)}</p>
                    <p className="text-lg text-gray-700"><span className="font-semibold text-gray-800">Status:</span> {result.EmployeeStatus}</p>
                    <p className="text-lg text-gray-700"><span className="font-semibold text-gray-800">Birth Date:</span> {result.EmployeeBirthDate?.slice(0, 10)}</p>
                    <p className="text-lg text-gray-700"><span className="font-semibold text-gray-800">Department:</span> {result.EmployeeDepartment}</p>
                    <p className="text-lg text-gray-700"><span className="font-semibold text-gray-800">Hourly Pay:</span> ${result.EmployeeHourly}</p>                    
                </>
            )}
    
            {auth === "Employee" && (          
                <p className="text-lg text-gray-700"><span className="font-semibold text-gray-800">Supervisor ID:</span> {result.SupervisorID}</p>
            )}
    
            {auth === "Customer" && (
                <div className="mb-10 flex justify-center items-center h-full">
                    <button onClick={handleDelete} className="bg-red-500 text-white px-8 py-2 rounded-lg hover:bg-red-600 transition-colors">
                        Delete Account
                    </button>
                </div>
            )}
        </div>
    
    </section>
    

    )
    
}