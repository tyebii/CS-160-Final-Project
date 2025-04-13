//Refactored Apr 12

//Import React Functions
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

//Import Axios
import axios from "axios"

//Import Auth
import { useAuth } from "../../Context/AuthHook"

//Import Custom Component 
import { TransactionCard } from "./Components/TransactionCard"

//List Of Transactions
export function MyOrders (){

    const {logout} = useAuth()

    const navigate = useNavigate()

    const [results, setResults] = useState([])

    useEffect(()=>{

        const token = localStorage.getItem('accessToken');

        //If There Is No Token Alert The User and Log Them Out
        if (!token) {

            alert('No token found');

            logout()

            navigate('/login')

            return;
            
        }

        axios
        .get("http://localhost:3301/api/transaction/transactions/customer", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {

            if(response.length === 0){

                alert("No Results Found")

            }else{

                setResults(response.data)

            }



        })
        .catch((error) => {

            if (error.response?.status === 401) {

                alert("You need to login again!");

                logout();

                navigate('/login')

            }else{

                alert(`Error Status ${error.response?.status}: ${error.response?.data.error}`);

            }

        });

    },[])

    return(

        <section className="max-w-5xl mx-auto px-6 py-10 bg-gray-50 rounded-xl shadow-lg mt-10 mb-10 border border-gray-200">

            <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-8 border-b pb-4">
                Transactions
            </h2>

            {results.length === 0 ? (
                <h3 className="text-2xl font-semibold text-center text-gray-600 py-10">
                    No results found
                </h3>
            ) : (
                <div className="">
                    {results.map((result) => (
                        <TransactionCard key={result.TransactionID} transaction={result} />
                    ))}
                </div>
            )}

        </section>

    )
}