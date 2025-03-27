import React, { useEffect, useState } from 'react';
import ProductComponent from './Components/ProductComponent';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ShoppingCart() {
  const [results, setResults] = useState([]);
  
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
        setResults(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  return (
    <section className="w-full max-w-4xl mx-auto my-10 p-8 bg-gray-100 rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold mb-2">Shopping Cart</h2>
        <h3 className="text-md text-blue-500 underline hover:cursor-pointer">Deselect Items</h3>
      </div>

      <div className="grid gap-6 mb-8">
        {results.length === 0 ? (
          <h3 className="text-2xl font-semibold text-gray-500 text-center">No items in the cart</h3>
        ) : (
          results.map((result) => (
            <div className="flex items-center gap-4 p-4 bg-white border-2 border-gray-300 rounded-lg shadow-md" key={`${result.ItemID}`}>
              <input type="checkbox" className="h-5 w-5 text-blue-500" />
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
          <h3 className="mb-3">Cost: ${results.reduce((sum, item) => sum + (item.Cost * item.OrderQuantity), 0)}</h3>
          <h3>Weight: {results.reduce((sum, item) => sum + (item.Weight * item.OrderQuantity), 0)} lbs</h3>
        </div>
      </div>

      <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-xl py-3 px-6 rounded-lg w-full mt-10 transition duration-300 ease-in-out">
        Proceed to Checkout
      </button>
    </section>
  );
}

export default ShoppingCart;