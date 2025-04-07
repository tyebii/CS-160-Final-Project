import { Link } from "react-router-dom";

export function TransactionCard({ transaction }) {
    return (
            <div className="mx-auto bg-white shadow-lg rounded-lg border border-gray-200 w-full max-w-lg mb-10">
                <Link to="/transaction/view" state={transaction}>
                    <div className="space-y-2 text-gray-700 p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Transaction Details</h2>
                        <p>
                            <span className="font-bold">Transaction ID:</span> {transaction.TransactionID}
                        </p>
                        <p>
                            <span className="font-bold">Amount Paid:</span> 
                            {transaction.TransactionStatus === 'In progress'
                            ? " In Progress"
                            : " $" + transaction.AmountPaid}
                        </p>
                        <p>
                            <span className="font-bold">Weight:</span> {transaction.TransactionWeight} LBS
                        </p>
                        <p>
                            <span className="font-bold">Address:</span> {transaction.TransactionAddress}
                        </p>
                        <p>
                            <span className="font-bold">Status:</span>
                            <span className={`ml-2 px-2 py-1 rounded text-white ${
                            transaction.TransactionStatus === 'Complete'
                                ? 'bg-green-500'
                                : transaction.TransactionStatus === 'In progress'
                                ? 'bg-yellow-500'
                                : transaction.TransactionStatus === 'Out For Delivery'
                                ? 'bg-orange-500'
                                : 'bg-red-500'
                            }`}>
                            {transaction.TransactionStatus}
                            </span>
                        </p>
                        <p>
                            <span className="font-bold">Date:</span> {new Date(transaction.TransactionDate).toLocaleDateString()}
                        </p>
                    </div>
                </Link>
            </div>

    );
}
