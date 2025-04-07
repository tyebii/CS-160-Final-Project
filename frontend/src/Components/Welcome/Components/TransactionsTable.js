import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../Context/AuthHook';
import { useNavigate } from 'react-router-dom';
import {link} from 'react-router-dom';
function TransactionsTable() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const { logout } = useAuth();

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

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('No token found');
            logout();
            return;
        }

        axios.get('http://localhost:3301/api/transaction/transactions/pending', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                setTransactions(response.data);
            })
            .catch((error) => {
                if (error.response?.status === 401) {
                    alert("You need to login again!");
                    logout();
                } else {
                    alert(`Error Status ${error.status}: ${error.response.data.error}`);
                }
            });
    }, []);

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
                                    <td className="px-2 py-2 border">${transaction.TransactionCost}</td>
                                    <td className="px-2 py-2 border">{transaction.TransactionWeight} kg</td>
                                    <td className="px-2 py-2 border break-words">{transaction.TransactionAddress}</td>
                                    <td className="px-2 py-2 border">{transaction.TransactionStatus}</td>
                                    <td className="px-2 py-2 border">{transaction.TransactionDate?.slice(0, 10)}</td>
                                    <td className="px-2 py-2 border">{transaction.RobotID || "N/A"}</td>
                                    <td className="px-2 py-2 border">{transaction.PaymentMethod || "N/A"}</td>
                                    <td className="px-2 py-2 border">{transaction.Currency || "N/A"}</td>
                                    <td className="px-2 py-2 border">{transaction.AmountPaid ? `$${transaction.AmountPaid}` : "N/A"}</td>
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

export default TransactionsTable;
