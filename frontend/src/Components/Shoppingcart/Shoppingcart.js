//Import React Libraries 
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

//Import Product Component
import ProductComponent from './Components/ProductComponent';

//Import axios
import axios from 'axios';

//Shopping cart component
function ShoppingCart() {
  // State variables
  const [results, setResults] = useState([]);
  const [weight, setWeight] = useState(0);
  const [cost, setCost] = useState(0);

  
  //Navigation Hook
  const navigate = useNavigate();  // Hook for navigation
  // Fetch shopping cart on load
  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      console.error('No token found');
      return;
    }

    axios
      .get('http://localhost:3301/api/shoppingcart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setResults(response.data); // Update results
      })
      .catch((error) => {
        console.error('Error:', error);
        if (error.response?.status === 401) {
          alert("You need to login again!")
          logout();
        }
      });
  }, []);

  // Recalculate weight and cost when `results` changes
  useEffect(() => {
    setWeight(results.reduce((sum, item) => sum + item.Weight * item.OrderQuantity, 0));
    setCost(results.reduce((sum, item) => sum + item.Cost * item.OrderQuantity, 0));
  }, [results]);

  // Clear cart
  const handleClear = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return console.error('No token found');

    axios
      .delete('http://localhost:3301/api/shoppingcart/clear', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setResults([]); // Empty cart
      })
      .catch((error) => console.error('Error:', error));
  };

  // Remove item
  const clickRemove = (itemid) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return console.error('No token found');

    axios
      .delete('http://localhost:3301/api/shoppingcart', {
        headers: { Authorization: `Bearer ${token}` },
        data: { ItemID: itemid },
      })
      .then(() => {
        setResults((prevItems) => prevItems.filter((item) => item.ItemID !== itemid));
      })
      .catch((error) => console.error('Error:', error));
  };

  // Checkout
  const clickCheckout = () => {
    const token = localStorage.getItem('accessToken');
    axios
        .post('http://localhost:3301/api/create-checkout-session', {
            // Data sent to the backend
            items: results.map((item) => ({
                ItemID: item.ItemID,
                Quantity: item.OrderQuantity,
            })),
            Weight: weight
        }, {
            // This is where the Authorization header should be
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.status === 200 && response.data.url) {
            window.location.href = response.data.url;
          } else {
            console.error("Unexpected response format:", response);
            alert("An error occurred while processing your payment.");
          }
        })
        .catch((error) => console.error('Error:', error));
};



  return (
    <section className="w-full max-w-4xl mx-auto my-10 p-8 bg-gray-100 rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold mb-2">Shopping Cart</h2>
        <h3 onClick={handleClear} className="text-md text-blue-500 underline hover:cursor-pointer">
          Clear
        </h3>
      </div>

      <div className="grid gap-6 mb-8">
        {results.length === 0 ? (
          <h3 className="text-2xl font-semibold text-gray-500 text-center">No items in the cart</h3>
        ) : (
          results.map((result) => (
            <div className="flex items-center gap-4 p-4 bg-white border-2 border-gray-300 rounded-lg shadow-md" key={result.ItemID}>
              <button
                onClick={() => clickRemove(result.ItemID)}
                className="bg-red-500 h-8 w-8 text-blue-500 rounded-full flex items-center justify-center text-white hover:cursor-pointer hover:bg-red-600"
              >
                X
              </button>
              <Link to={`/itemview/${result.ItemID}`} className="flex-grow hover:text-blue-600">
                <ProductComponent result={result} />
              </Link>
            </div>
          ))
        )}
      </div>

      <div className="mt-12 text-center">
        <h1 className="text-3xl font-semibold mb-4">Subtotal</h1>
        <div className="p-6 border-2 border-gray-300 rounded-lg bg-white shadow-md text-lg">
          <h3 className="mb-3">Cost: ${cost.toFixed(2)}</h3>
          <h3>Weight: {weight} lbs</h3>
        </div>
      </div>

      <button
        onClick={clickCheckout}
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-xl py-3 px-6 rounded-lg w-full mt-10 transition duration-300 ease-in-out"
      >
        Proceed to Checkout
      </button>
    </section>
  );
}

export default ShoppingCart;
