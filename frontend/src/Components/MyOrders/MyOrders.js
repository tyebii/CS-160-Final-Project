import { useState, useEffect } from "react"

import axios from "axios"

import { TransactionCard } from "./Components/TransactionCard"

import { useErrorResponse } from '../Utils/AxiosError';

//List Of Transactions
export function MyOrders() {

    const { handleError } = useErrorResponse();

    const [results, setResults] = useState([])

    //Fetch The Customer's Transactions
    useEffect(() => {

        const fetchTransactions = async () => {

            try {

                const response = await axios.get("http://localhost:3301/api/transaction/transactions/customer", {

                    withCredentials: true,

                    headers: { 'Content-Type': 'application/json' },

                });

                if (response.data.length === 0) {

                    return;

                }

                setResults(response.data);

            } catch (error) {

                handleError(error);

            }

        };

        fetchTransactions();

    }, []);

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