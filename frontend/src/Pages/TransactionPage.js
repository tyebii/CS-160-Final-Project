import { TransactionDetails } from "../Components/TransactionDetails/TransactionDetails";
import { useLocation } from "react-router-dom";

export function TransactionPage() {
    const location = useLocation();
    const transaction = location.state;
  
    console.log(transaction);
    return (
        <TransactionDetails transaction={transaction}/>
    );
}