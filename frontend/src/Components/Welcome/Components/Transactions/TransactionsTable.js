//Import React Functions
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

//The Search Icon
import WelcomesearchIcon from './searchIcon.jpg';

//Import Axios
import axios from 'axios';

//Error Message Hook
import { useErrorResponse } from '../../../Utils/AxiosError';

import { validateID } from '../../../Utils/Formatting';

//Transaction Area
export default function TransactionArea({ trigger, setTrigger, auth, logout }) {

    var [transactionSearchInput, setTransactionSearchInput] = useState(""); 

    const navigate = useNavigate();

    const { handleError } = useErrorResponse(); 
  
    var clickTransactionSearch = (e) => {

        if(!validateID(transactionSearchInput)) {

            return

        }

        axios.post(

            `http://localhost:3301/api/transaction/transactions/id`,

            {

                TransactionID: transactionSearchInput 

            },

            {

                withCredentials: true,

                headers: { 'Content-Type': 'application/json' }

            }

        )

        .then((response) => {

            if (response.data.length === 0) {

                alert("No transaction found with that ID.");

                return;

            }

            navigate("/transaction/view", { state: response.data[0] });

        })

        .catch((error) => {

            handleError(error)

        });
    }

    return (

        (auth === "Employee" || auth === "Manager") ? (

            <article className="w-[100%] mx-auto px-5 py-5 bg-gray-200 rounded-lg shadow-md mb-20">

                <h2 className="text-center text-3xl font-bold mb-6 text-gray-800">Current Transactions</h2>

                <TransactionsTable trigger = {trigger} setTrigger = {setTrigger} logout={logout} />

                {/* Manager-Only Search */}
                {auth === "Manager" && (

                    <div className="flex flex-col items-center gap-10 py-10">

                        <div className="w-full max-w-xl bg-white shadow-md rounded-xl p-6">

                            <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">Transaction Search</h2>

                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                
                                <input

                                    onChange={(e) => setTransactionSearchInput(e.target.value)}

                                    value={transactionSearchInput}

                                    type="text"

                                    placeholder="Search Transactions"

                                    className="flex-grow px-4 py-2 text-lg focus:outline-none"

                                    required

                                />

                                <img

                                    onClick={clickTransactionSearch}

                                    src={WelcomesearchIcon}

                                    alt="search icon"

                                    className="w-5 h-5 m-5 hover:cursor-pointer"

                                />

                            </div>

                        </div>

                    </div>

                )}

            </article>

        ) : null

    );

}

//Transaction Table Component
function TransactionsTable({trigger, logout}) {

    const navigate = useNavigate();

    const { handleError } = useErrorResponse(); 
  
    const [transactions, setTransactions] = useState([]);

    const columns = [

        'Transaction ID',

        'Customer ID',

        'Cost',

        'Weight',

        'Address',

        'State',

        'Purchase Date',

        'Robot ID',

        'Payment Method',

        'Currency',

        'Amount Paid',

        'Charge Status',

        'Stripe ID',

        'Receipt'

    ];

    //Query The Backend For The Transactions
    useEffect(() => {

        axios.get('http://localhost:3301/api/transaction/transactions/pending', {

            withCredentials: true,

            headers: { 'Content-Type': 'application/json' }

        })

        .then((response) => {

            setTransactions(response.data);

        })

        .catch((error) => {

            handleError(error)

        });

    },[trigger]);

    return (

        <div className="mx-auto">

            <div className="overflow-auto rounded-lg shadow-md">

                <table className="min-w-full table-fixed border border-gray-300 text-sm">

                    <thead className="bg-gray-100">

                        <tr>

                            {columns.map((col, index) => (

                                <th

                                    key={index}

                                    className="px-3 py-2 border-b text-left font-semibold text-gray-700 break-words"

                                >

                                    {col}

                                </th>

                            ))}

                        </tr>

                    </thead>

                    <tbody>

                        {transactions.length > 0 ? (

                            transactions.map((transaction, index) => (

                                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                    
                                    <td className="px-2 py-2 border break-words hover:cursor-pointer hover:underline" onClick = {()=>{navigate("/transaction/view", { state:  transaction  })}}>{transaction.TransactionID}</td>

                                    <td className="px-2 py-2 border break-words">{transaction.CustomerID}</td>

                                    <td className="px-2 py-2 border">${transaction.TransactionCost.toFixed(2)}</td>

                                    <td className="px-2 py-2 border">{transaction.TransactionWeight.toFixed(2)} lbs</td>

                                    <td className="px-2 py-2 border break-words">{transaction.TransactionAddress}</td>

                                    <td className="px-2 py-2 border">{transaction.TransactionStatus}</td>

                                    <td className="px-2 py-2 border">{transaction.TransactionDate?.slice(0, 10)}</td>

                                    <td className="px-2 py-2 border">{transaction.RobotID || "N/A"}</td>

                                    <td className="px-2 py-2 border">{transaction.PaymentMethod || "N/A"}</td>

                                    <td className="px-2 py-2 border">{transaction.Currency || "N/A"}</td>

                                    <td className="px-2 py-2 border">{transaction.AmountPaid ? `$${transaction.AmountPaid.toFixed(2)}` : "N/A"}</td>

                                    <td className="px-2 py-2 border">{transaction.ChargeStatus || "N/A"}</td>

                                    <td className="px-2 py-2 border break-words">{transaction.StripeTransactionID || "N/A"}</td>

                                    <td className="px-2 py-2 border">

                                        {transaction.ReceiptURL ? (

                                            <a

                                                href={transaction.ReceiptURL}

                                                target="_blank"

                                                rel="noopener noreferrer"
                                                
                                                className="text-blue-600 underline"

                                            >

                                                View

                                            </a>

                                        ) : (

                                            "N/A"

                                        )}

                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td

                                    colSpan={columns.length}

                                    className="text-center px-4 py-4 text-gray-500 italic"

                                >

                                    No transactions found.

                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );
    
}


