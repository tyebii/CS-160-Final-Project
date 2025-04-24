//Refactored Apr 12

//Import React Functions
import { useState, useEffect } from "react"

//Import Axios
import axios from "axios"

//Import Custom Component 
import { TransactionCard } from "./Components/TransactionCard"

//Error Message Hook
import { useErrorResponse } from '../Utils/AxiosError';


//List Of Transactions
export function MyOrders (){

    const { handleError } = useErrorResponse(); 

    const [results, setResults] = useState([])

    useEffect(()=>{

        axios

        .get("http://localhost:3301/api/transaction/transactions/customer", {

            withCredentials: true,

            headers: { 'Content-Type': 'application/json' }

        })

        .then((response) => {

            if(response.length === 0){

                alert("No Results Found")

                return;

            }else{

                setResults(response.data)

                return;

            }

        })

        .catch((error) => {

            handleError(error)

            return;

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