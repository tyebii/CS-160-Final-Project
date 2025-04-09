//Import Custom Hook
import { useAuth } from "../../Context/AuthHook";

//Import Transaction Details Component
export function TransactionDetails({transaction}) {
  
  //If there is no transaction, return a message
  if (!transaction) {
    return (
      <section className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold text-gray-600">No transaction data found.</p>
      </section>
    );
  }

  //Get the Auth Context
  const { auth } = useAuth();

  //Build the Transaction Details Page
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

          <DetailRow label="Transaction Cost" value={`$${transaction.TransactionCost}`} />
          <DetailRow label="Transaction Weight" value={`${transaction.TransactionWeight} lbs`} />
          <DetailRow label="Transaction Address" value={transaction.TransactionAddress} />
          <DetailRow
            label="Transaction Status"
            value={transaction.TransactionStatus}
            isBadge
          />
          <DetailRow label="Transaction Date" value={new Date(transaction.TransactionDate).toLocaleDateString()} />
          <DetailRow label="Robot ID" value={transaction.RobotID} defaultValue="None" />
          <DetailRow label="Payment Method" value={transaction.PaymentMethod} defaultValue="None" />
          <DetailRow label="Charge Status" value={transaction.ChargeStatus} defaultValue="None" />
          <DetailRow label="Receipt URL" value={transaction.ReceiptURL} defaultValue="None" />
          <DetailRow label="Currency" value={transaction.Currency} defaultValue="None" />
          <DetailRow label="Amount Paid" value={transaction.AmountPaid} defaultValue="None" />
        </div>
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
                : "bg-red-500"
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
  
