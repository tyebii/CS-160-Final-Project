//Refactored Apr 12

//Import React Functions
import { useState, useEffect } from "react"

//Import Axios
import axios from "axios"

//Import Custom Component 
import { TransactionCard } from "./Components/TransactionCard"

//Token Validation Hook
import { useValidateToken } from '../Utils/TokenValidation';

//Error Message Hook
import { useErrorResponse } from '../Utils/AxiosError';


//List Of Transactions
export function MyOrders() {

    const validateToken = useValidateToken();

    const { handleError } = useErrorResponse();

    const [results, setResults] = useState([])

    useEffect(() => {

        const token = validateToken()

        if (token == null) {

            return;

        }

        axios

            .get("http://localhost:3301/api/transaction/transactions/customer", {

                headers: {

                    Authorization: `Bearer ${token}`,

                },

            })

            .then((response) => {

                if (response.length === 0) {

                    alert("No Results Found")

                    return;

                } else {

                    setResults(response.data)

                    return;

                }

            })

            .catch((error) => {

                handleError(error)

                return;

            });

    }, [])

    return (

        <section className="w-full mx-auto px-6 py-10 border border-gray-200">

            <h2 className="text-3xl mx-8 my-4">Transaction History</h2>

            <hr className="border-1 mx-6 mb-4 border-gray-300"></hr>

            <div className="mx-8 p-4 grid h-[400px] overflow-y-auto border border-gray-300 rounded-md">

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

            </div>

        </section>

    )
}