import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthHook';
import axios from 'axios';

const ItemView = () => {
  const { auth, logout } = useAuth();
  const { itemid } = useParams();
  const [results, setResults] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!itemid) {
      console.log("Could not identify item id");
      return;
    }

    let endPoint = "";
    if (!auth || auth === "Customer") {
      endPoint = `http://localhost:3301/api/search/itemID/customer/${itemid}`;
    } else {
      endPoint = `http://localhost:3301/api/search/itemID/employee/${itemid}`;
    }

    axios
      .get(endPoint)
      .then((response) => {
        setResults(response.data[0]);
      })
      .catch((error) => {
        console.log(error.message);
        if (error.response?.status === 401) {
          alert("You need to login again!");
          logout();
        }
      });
  }, [itemid]);

  const clickAdd = (e) => {
    e.preventDefault();

    if (!auth) {
      navigate('/login');
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log("Couldn't identify token");
      return;
    }

    axios
      .post(
        `http://localhost:3301/api/shoppingcart`,
        {
          ItemID: results.ItemID,
          Quantity: document.getElementById("quantity").value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("Item added to shopping cart:", response.data);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error:", error);
        if (error.response?.status === 401) {
          logout();
        }
      });
  };

  return (
    <section className="w-[800px] mx-auto bg-gray-200 p-5 mt-12 flex flex-col">
      <div className="flex mb-5">
        <div className="border-2 border-gray-300 rounded-lg shadow-md bg-white p-3 w-[300px] h-[300px] flex items-center justify-center mr-5">
          <img
            alt={results.ProductName}
            className="max-w-full max-h-full object-contain"
          />
        </div>

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

      <h2 className="text-2xl font-bold mb-3">Description</h2>
      <p className="text-gray-700 leading-relaxed mb-5">{results.Description}</p>

      {/* Select the quantity from 1 - max availability */}
      <form className="flex flex-col items-center space-y-4">
        <label htmlFor="quantity" className="text-lg font-semibold">
          Select Quantity:
        </label>
        {results.Quantity === 0 ? (
          <p>No Available Stock</p>
        ) : (
          <>
            <select
              id="quantity"
              className="border border-gray-300 rounded-lg p-2 text-center w-full max-w-xs"
            >
              {Array.from({ length: results.Quantity }, (_, i) => (
                <option key={i + 1} value={i + 1} className="text-center">
                  {i + 1}
                </option>
              ))}
            </select>
            <button
              className="bg-red-500 hover:bg-red-600 text-white py-3 px-4 text-lg rounded-lg w-full max-w-md"
              onClick={(e) => clickAdd(e)}
            >
              Add to Cart
            </button>
          </>
        )}
      </form>
    </section>
  );
};

export default ItemView;