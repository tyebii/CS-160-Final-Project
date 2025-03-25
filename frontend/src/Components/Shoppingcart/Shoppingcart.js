import React, { useEffect, useState } from 'react';
import ProductComponent from './Components/ProductComponent';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ShoppingCart() {
  // Array holding shopping cart items
  const [results, setResults] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No token found");
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
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []); // Removed token from dependency array as it's inside useEffect

  return (
    <section className='w-full'>
      <div className='p-5 ml-7 text-center'>
        <h2 className='text-3xl font-bold'>Shopping Cart</h2>
        <h3 className='text-sm underline hover:cursor-pointer'>Deselect Items</h3>
      </div>

      <div className='grid gap-4'>
        {results.length === 0 ? (
          <h3 className='text-2xl font-bold text-center'>No results found</h3>
        ) : (
          results.map((result) => (
            <Link key={result.ItemID} to={`/itemview/${result.ItemID}`}>
              <ProductComponent result={result}></ProductComponent>
            </Link>
          ))
        )}
      </div>

      <div className='mt-24'>
        <h1 className='text-3xl text-center mb-5'>Subtotal</h1>
        <div className='w-full max-w-6xl mx-auto p-5 border-2 border-gray-300 rounded-lg bg-white outline outline-2 outline-black text-lg'>
          <h3 className='mb-3'>X items Cost: $xxx</h3>
          <h3>X items Weight: xxxx</h3>
        </div>
      </div>

      <button className='bg-yellow-400 hover:bg-yellow-500 text-black text-2xl py-3 px-4 rounded-lg w-full max-w-lg mt-16'>
        Proceed to Checkout
      </button>
    </section>
  );
}

export default ShoppingCart;
