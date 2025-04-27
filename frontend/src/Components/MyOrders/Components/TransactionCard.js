//Import React Functions
import { Link } from "react-router-dom";

//Import Transaction Card
export function TransactionCard({ transaction }) {

    return (

        <div className="mx-auto bg-white shadow-xl rounded-lg border border-gray-300 w-full max-w-lg mb-10 overflow-hidden">

            <Link to="/transaction/view" state={transaction}>

                <div className="p-6 space-y-4 text-gray-700">

                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Transaction Details</h2>

                    <p className="text-lg">

                        <span className="font-semibold text-gray-800">Transaction ID:</span> {transaction.TransactionID}

                    </p>

                    <p className="text-lg">

                        <span className="font-semibold text-gray-800">Amount Paid: </span> 

                        {transaction.TransactionStatus === 'Failed'

                            ? <span className="text-red-500">Failed</span>

                            : "$" + transaction.AmountPaid}

                    </p>

                    <p className="text-lg">

                        <span className="font-semibold text-gray-800">Weight:</span> {transaction.TransactionWeight?.toFixed(2)} LBS

                    </p>

                    <p className="text-lg">

                        <span className="font-semibold text-gray-800">Address:</span> {transaction.TransactionAddress}

                    </p>

                    <p className="text-lg">

                        <span className="font-semibold text-gray-800">Status:</span>

                        <span className={`ml-2 px-3 py-1 rounded-full font-semibold text-white ${

                            transaction.TransactionStatus === 'Complete'

                                ? 'bg-green-600'

                                : transaction.TransactionStatus === 'In progress'

                                ? 'bg-yellow-500'

                                : transaction.TransactionStatus === 'Pending Delivery'

                                ? 'bg-orange-500': transaction.TransactionStatus === 'Failed'?

                                'bg-red-500'

                                : 'bg-blue-600'

                            }`}>

                            {transaction.TransactionStatus}

                        </span>

                    </p>
                        
                    {transaction.TransactionFailure?(                    
                        
                        <p className="text-lg">

                            <span className="font-semibold text-gray-800">Reason For Failure:</span> {transaction.TransactionFailure} 

                        </p>

                    ):null}


                    <p className="text-lg">

                        <span className="font-semibold text-gray-800">Date:</span> {transaction.TransactionDate?new Date(transaction.TransactionDate).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }):null} 

                    </p>

                </div>

            </Link>

        </div>

    );
    
}
