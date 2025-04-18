//Refactored April 12

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {useAuth} from "../../Context/AuthHook"

import axios from 'axios';

//Gets And Present Account Information
export function MyAccount (){

    const navigate = useNavigate()

    const {auth, logout} = useAuth()

    const [result, setResult] = useState({})
    
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {

        if (!auth || loaded) return;
        
        const token = localStorage.getItem('accessToken');

        if (!token) {

            alert('Login Information Not Found')

            logout()

            navigate('/login')

            return;

        }

        const endpoints = {
            Customer: "http://localhost:3301/api/customer/customer",
            Employee: "http://localhost:3301/api/customer/employee",
            Manager: "http://localhost:3301/api/customer/employee",
        };

        const endpoint = endpoints[auth];
        if (!endpoint) {
            alert("Invalid user role");
            logout();
            navigate("/login");
            return;
        }

        axios

            .get(endpoint, {
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

                setLoaded(true);
            })

            .catch((error) => {

                if (error.response?.status === 401) {

                    alert("You Need To Login Again!");

                    logout();

                    navigate('/login')

                }else if(error.response){

                    alert(`Error Status ${error.response?.status}: ${error.response?.data.error}`);

                }else{

                    alert("Contact With Backend Lost")

                }

            });

    }, [auth, loaded, logout, navigate]);
    
    return (
        
        <section className="bg-white rounded-lg p-8 m-8 max-w-4xl mx-auto shadow-2xl">

            <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Account Details</h2>

            <div className="space-y-4">

                <p className="text-lg text-gray-700"><span className="font-semibold text-gray-800">UserID:</span> {result.UserID}</p>
                
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
            </div>

        </section>

    )
}