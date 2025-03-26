import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../Context/AuthHook';

const ItemView = () => {
  const { auth} = useAuth();

  const { itemid } = useParams();
  const [results, setResults] = useState({});

  useEffect(() => {
    let endPoint = ``
    
    console.log("This is auth", auth)
    if(!auth || auth == "Customer"){
      endPoint = `http://localhost:3301/api/search/itemID/customer/${itemid}`
    }else{
      endPoint = `http://localhost:3301/api/search/itemID/employee/${itemid}`
    }
    axios.get(endPoint)
      .then((response) => {
        setResults(response.data[0]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [itemid]);

  const clickAdd = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken'); // Assuming you store the token in localStorage
    console.log(token)
    axios.post(
      `http://localhost:3301/api/shoppingcart`,
      {
        // Data to send in the request body
        ItemID: results.ItemID,
        Quantity: document.getElementById("quantitySelect").value
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      }
    )
      .then((response) => {
        console.log("Item added to shopping cart:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <section id ="quantitySelect" className="w-[800px] mx-auto bg-gray-200 p-5 mt-12 flex flex-col">
      {/* Top Section */}
      <div className="flex mb-5">
        {/* Product Image */}
        <div className="border-2 border-gray-300 rounded-lg shadow-md bg-white p-3 w-[300px] h-[300px] flex items-center justify-center mr-5">
          <img 
            alt={results.ProductName} 
            className="max-w-full max-h-full object-contain" 
          />
        </div>

        {/* Product Information */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{results.ProductName}</h1>
          <p className="text-lg mb-2">Distributed By: {results.Distributor}</p>
          <p className="text-lg mb-2">Availability: {results.Quantity}</p>
          <p className="text-lg mb-2">Expiration: {results.Expiration}</p>
          <p className="text-lg mb-2">Storage Type: {results.StorageRequirement}</p>
          <p className="text-lg font-semibold mb-2">Cost: {results.Cost}</p>
          <p className="text-lg font-semibold mb-2">Weight: {results.Weight}</p>
        </div>
      </div>

      {/* Description Section */}
      <h2 className="text-2xl font-bold mb-3">Description</h2>
      <p className="text-gray-700 leading-relaxed mb-5">{results.Description}</p>

      {/* Add to Cart Button */}
      
        
        
      <form className="flex flex-col items-center space-y-4">
        <label htmlFor="quantity" className="text-lg font-semibold">
          Select Quantity:
        </label>
        <select
          id="quantity"
          className="border border-gray-300 rounded-lg p-2 text-center w-full max-w-xs"
        >
          {Array.from({ length: results.Quantity}, (_, i) => (
            <option key={i+1} value={i+1} className="text-center">
              {i+1}
            </option>
          ))}
        </select>

        <button
          className="bg-red-500 hover:bg-red-600 text-white py-3 px-4 text-lg rounded-lg w-full max-w-md"
          onClick={(e) => {clickAdd(e)}}
        >
          Add to Cart
        </button>
      </form>


        
      
    </section>
  );
};

export default ItemView;
