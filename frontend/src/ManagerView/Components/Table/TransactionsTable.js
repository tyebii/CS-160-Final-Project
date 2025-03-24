import { useState, useEffect } from 'react';

function TransactionsTable() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const columns = ['Transaction ID', 'Customer ID', 'Cost', 'Weight', 'Address', 'State', 'Purchase Date', 'Robot ID'];

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch('http://localhost:3301/api/transactions');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setTransactions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    if (loading) return <p>Loading transactions...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <table border="1">
            <thead>
                <tr>
                    {columns.map((col, index) => <th key={index}>{col}</th>)}
                </tr>
            </thead>
            <tbody>
                {transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
                        <tr key={index}>
                            <td>{transaction.transaction_id}</td>
                            <td>{transaction.customer_id}</td>
                            <td>{transaction.cost}</td>
                            <td>{transaction.weight}</td>
                            <td>{transaction.address}</td>
                            <td>{transaction.state}</td>
                            <td>{transaction.purchase_date}</td>
                            <td>{transaction.robot_id}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={columns.length} style={{ textAlign: 'center' }}>
                            No transactions found.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

export default TransactionsTable;
