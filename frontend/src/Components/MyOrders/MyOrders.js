//Import React Functions
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
//Import Axios
import axios from "axios"

//Import Auth
import { useAuth } from "../../Context/AuthHook"
//Import Custom Component 
import { TransactionCard } from "./Components/TransactionCard"



export function MyOrders (){
    const {logout} = useAuth()
    const [results, setResults] = useState([])

    //Load The User's Transactions
    useEffect(()=>{
        //Get The Token From The Local Storage
        const token = localStorage.getItem('accessToken');

        //If There Is No Token Alert The User and Log Them Out
        if (!token) {
            alert('No token found');
            logout()
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
                alert("No results found")
                return
            }
            setResults(response.data)
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
    },[])

    return(
        <div>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 pb-2">
                Transactions
            </h2>

            {results.length === 0 ? (
            <h3 className="text-2xl font-bold text-center">No results found</h3>
          ) : (
            results.map((result) => (
                <TransactionCard key={result.TransactionID} transaction={result} />
            ))
          )}
        </div>
    )
}