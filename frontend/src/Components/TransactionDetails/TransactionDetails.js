//Import Custom Hook
import { useAuth } from "../../Context/AuthHook";

import { validateID } from "../Utils/Formatting";

import { useState } from "react";

import axios from "axios";

//Error Message Hook
import { useErrorResponse } from '../Utils/AxiosError';

//Transaction Details Component
export function TransactionDetails({transaction}) {

  console.log(transaction)

  const { auth} = useAuth();

  const { handleError } = useErrorResponse(); 
  
  if (!transaction) {

    return (

      <section className="flex items-center justify-center min-h-screen">

        <p className="text-lg font-semibold text-gray-600">No transaction data found.</p>

      </section>

    );

  }

  const [transactionStatus, setTransactionStatus] = useState(transaction.TransactionStatus)

  const [visibility,setVisibility] = useState(true)

  //Click Fullfill
  const handleFulfill = async () => {

    if (!validateID(transaction.TransactionID)) {
  
      alert("Invalid Transaction ID");
  
      return;
  
    }
  
    try {
  
      await axios.post(

        `http://localhost:3301/api/transaction//transactions/fulfill`,

        {

          TransactionID: transaction.TransactionID,

        },

        {

          withCredentials: true,

          headers: { 'Content-Type': 'application/json' },

        }
        
      );
  
      alert("Successfully Fulfilled");
  
      setVisibility(false);
  
      setTransactionStatus("Fulfilled");
  
    } catch (error) {
  
      handleError(error);
  
    }
  
  };
  

  return (

    <section className="flex items-center justify-center min-h-screen  p-6">

      <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl w-full border border-gray-300">

        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Transaction Summary</h2>

        <div className="space-y-4">

          <DetailRow label="Transaction ID" value={transaction.TransactionID} />

          <DetailRow label="Customer ID" value={transaction.CustomerID} />

          {auth === "Manager" || auth === "Employee" ? (<>

            <DetailRow label="Stripe Transaction ID" value={transaction.StripeTransactionID} defaultValue="None" />

            <DetailRow label="User ID" value={transaction.UserID} />

            <DetailRow label="First Name" value={transaction.UserNameFirst} />

            <DetailRow label="Last Name" value={transaction.UserNameLast} />

            <DetailRow label="Phone Number" value={transaction.UserPhoneNumber} />

          </>): null}

          <DetailRow label="Transaction Cost" value={`$${transaction.TransactionCost.toFixed(2)}`} />

          <DetailRow label="Transaction Weight" value={`${transaction.TransactionWeight.toFixed(2)} lbs`} />

          <DetailRow label="Transaction Address" value={transaction.TransactionAddress} />

          <DetailRow

            label="Transaction Status"

            value={transactionStatus}

            isBadge

          />

          <DetailRow label="Transaction Date" value={new Date(transaction.TransactionDate).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} />

          <DetailRow label="Transaction Arrival Date" value={transaction.TransactionTime ? new Date(transaction.TransactionTime).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }) : "N/A"} />


          <DetailRow label="Robot ID" value={transaction.RobotID} defaultValue="None" />

          <DetailRow label="Payment Method" value={transaction.PaymentMethod} defaultValue="None" />

          <DetailRow label="Charge Status" value={transaction.ChargeStatus} defaultValue="None" />

          <DetailRow label="Receipt URL" value={transaction.ReceiptURL} defaultValue="None" />

          <DetailRow label="Currency" value={transaction.Currency} defaultValue="None" />

          <DetailRow label="Amount Paid" value={`$${transaction.AmountPaid.toFixed(2)}`} defaultValue="None" />

        </div>

        {(auth === "Manager" || auth === "Employee") && transaction.TransactionStatus === "Complete" && visibility ? (

        <div className="flex justify-center mt-4">

          <button onClick={handleFulfill} className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">

            Fulfill

          </button>

        </div>

    ) : null}

      </div>

    </section>

  );

}

//Each Row
const DetailRow = ({ label, value, defaultValue = "", isBadge = false }) => {

    if (!value){

      value = defaultValue;

    }

    return (

      <p className="text-gray-700">

        <strong className="font-semibold text-gray-800">{label}:</strong>{" "}

        {isBadge ? (

          <span

            className={`ml-2 px-2 py-1 rounded text-white text-sm ${

              value === "Complete"

                ? "bg-green-500"

                : value === "In progress"

                ? "bg-yellow-500"

                : "bg-blue-500"

            }`}

          >

            {value}

          </span>

        ) : (

          <span

            className={`ml-2 text-gray-900 ${
              
              label === "Receipt URL" ? "break-words" : ""

            }`}

          >

            {label === "Receipt URL" ? (

              <a

                href={value}

                target="_blank"

                rel="noopener noreferrer"

                className="text-blue-600"

              >

                {value}

              </a>

            ) : (

              value

            )}

          </span>

        )}

      </p>

    );

  };
  
  
