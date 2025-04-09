//Import React Functions
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

//Import Auth Context
import { useAuth } from '../../Context/AuthHook';

//Import Axios For Backend Queries
import axios from 'axios';

//Item View Component
const ItemView = () => {

  //Import Necessary Attributes From Auth Hook
  const { auth, logout } = useAuth();

  //Get The ItemID In The URL
  //Allows User To Bookmark Website URL
  const { itemid } = useParams();

  //Result Object From Querying For The Item 
  const [results, setResults] = useState({});
  const navigate = useNavigate();

  //On The Change Of The ItemID Refresh The Results
  useEffect(() => {
    //If There Is No Item ID Alert The User
    if (!itemid) {
      alert("Could not identify item id");
      return;
    }

    const token = localStorage.getItem('accessToken');


    //Determine The EndPoint Based On The Type Of User
    let endPoint = "";
    if (!auth || auth === "Customer") {
      endPoint = `http://localhost:3301/api/inventory/search/itemID/customer/${itemid}`;
    } else {
      if (!token) {
        alert('No token found');
        logout();
        return;
      }
      endPoint = `http://localhost:3301/api/inventory/search/itemID/employee/${itemid}`;
    }
    

    //Get Request To The Backend
    axios
      .get(endPoint,{
        headers: {
            'Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        if(response.data.length === 0){
          alert("No results found")
          navigate('/')
          return
        }
        setResults(response.data[0]);
      })
      .catch((error) => {
        //If Unauthorized Response
        if (error.response?.status === 401) {
          alert("You need to login again!");
          logout();
        }else{
          alert(`Error Status ${error.status}: ${error.response.data.error}`);
        }
      });
  }, [itemid]);

  //Adding The Item To Shopping Cart
  const clickAdd = (e) => {
    //Stop Default Functionality
    e.preventDefault();

    //Get The JWT Token
    const token = localStorage.getItem('accessToken');

    //If The JWT Token Is Not In The Storage
    if (!token) {
      alert("Login!");
      logout();
      return;
    }

    //Post Request To The Backend
    axios
      .post(
        `http://localhost:3301/api/shoppingcart/shoppingcart`,
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
        alert("Item added to shopping cart!");
        navigate("/");
      })
      .catch((error) => {
        //If Unauthorized Response
        if (error.response?.status === 401) {
          alert("Login Again!")
          logout();
        }else{
          alert(`Error Status ${error.status}: ${error.response.data.error}`);
        }
      });
  };

  //Handle Delete Functionality
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      
      //Get The JWT Token
      const token = localStorage.getItem('accessToken');
  
      //If The JWT Token Is Not In The Storage
      if (!token) {
        alert("Login!");
        logout();
        return;
      }
        
    //Post Request To The Backend
    axios
      .delete(
        `http://localhost:3301/api/inventory/delete/item/${results.ItemID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        alert('Item deleted successfully!');
        navigate('/');
      })
      .catch((error) => {
        //If Unauthorized Response
        if (error.response?.status === 401) {
          alert("Login Again!")
          logout();
        }else{
          alert(`Error Status ${error.status}: ${error.response.data.error}`);
        }
      });

    }
  };

  

  //Item View HTML
  return (
    <section className="w-[800px] mx-auto bg-gray-200 p-5 mt-12 flex flex-col">
      <div className="flex mb-5">
        <div className="border-2 border-gray-300 rounded-lg shadow-md bg-white p-3 w-[300px] h-[300px] flex items-center justify-center mr-5">
          {/* Need To Add Source Attribute */}
          <img
            src={results.ImageLink}
            alt={results.ProductName}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/*Populated From The Results State Variable*/}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">{results.ProductName}</h2>
          {auth === "Employee" || auth === "Manager" ? (
            <div>
              <p className="text-lg mb-2">Last Modification: {results.LastModification}</p>
              <p className="text-lg mb-2">ItemID: {results.ItemID}</p>
              <p className="text-lg mb-2">Category: {results.Category}</p>
              <p className="text-lg mb-2">Supplier Cost: {results.SupplierCost}</p>
            </div>): null
          }
          <p className="text-lg mb-2">Distributed By: {results.Distributor}</p>
          <p className="text-lg mb-2">Availability: {results.Quantity}</p>
          <p className="text-lg mb-2">Expiration: {results.Expiration}</p>
          <p className="text-lg mb-2">Storage Type: {results.StorageRequirement}</p>
          <p className="text-lg font-semibold mb-2">Cost: {results.Cost}</p>
          <p className="text-lg font-semibold mb-2">Weight: {results.Weight}</p>
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-3">Description</h3>
      <p className="text-gray-700 leading-relaxed mb-5">{results.Description}</p>

      {(auth === "Customer" || !auth) ? (
        <form className="flex flex-col items-center space-y-4 mt-6 w-full">
          <label htmlFor="quantity" className="text-lg font-semibold text-gray-700">
            Select Quantity:
          </label>

          {results.Quantity === 0 ? (
            <p className="text-red-600 font-medium">No Available Stock</p>
          ) : (
            <>
              <select
                id="quantity"
                className="border border-gray-300 rounded-lg p-2 text-center w-full max-w-xs focus:ring-2 focus:ring-red-500"
              >
                {Array.from({ length: results.Quantity }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>

              <button
                className="bg-red-500 hover:bg-red-600 text-white py-3 px-4 text-lg rounded-lg w-full max-w-md shadow-md transition-all"
                onClick={(e) => clickAdd(e)}
              >
                Add to Cart
              </button>
            </>
          )}
        </form>
      ) : null}

      {auth === "Manager" ? (
            <div className="mx-auto flex gap-4">
            <button
              onClick={() => navigate('/itemedit', { state: results })}
              className="bg-yellow-400 text-black py-3 px-6 text-lg font-semibold rounded-lg hover:bg-yellow-500 transition duration-200 w-full max-w-xs"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white py-3 px-6 text-lg font-semibold rounded-lg hover:bg-red-600 transition duration-200 w-full max-w-xs"
            >
              Delete
            </button>
        </div>):null}
  
    </section>
  );
};

export default ItemView;