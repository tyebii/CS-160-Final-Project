//Import react libraries
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

//Authentication context
import { useAuth } from '../../Context/AuthHook';

//Import Axios
import axios from 'axios';

//Item view component
const ItemView = () => {

  //Use the auth var from the hook
  const {auth, logout} = useAuth();

  //Get the itemid from the url
  const { itemid } = useParams();

  //State variable to manage displaying the shopping cart
  const [results, setResults] = useState({});

  //Navigate hook
  const navigate = useNavigate() 

  //On the load of the page and changes of itemid
  useEffect(() => {
    if(!itemid){
      console.log("Could not identify item id")
      return;
    }
    //Backend endpoint
    let endPoint = ``
    
    //Checking whether we should ping the customer or employee endpoint
    if(!auth || auth == "Customer"){
      endPoint = `http://localhost:3301/api/search/itemID/customer/${itemid}`
    }else{
      endPoint = `http://localhost:3301/api/search/itemID/employee/${itemid}`
    }

    //Axios request to backend
    axios.get(endPoint)
      .then((response) => {
        //If data is there, then set results
        setResults(response.data[0]);
      })
      .catch((error) => {
        console.log(error.message)
        if(error.response.status === 401){
          alert("You need to login again!")
          logout()
        }
      });
  }, [itemid]);

  //When add to cart is clicked
  const clickAdd = (e) => {
    //Prevent the page from refreshing
    e.preventDefault();
    
    //If there is no authentication context redirect to the login page
    if(!auth){
      navigate('/login')
      return;
    }

    //Get the token from the local storage
    const token = localStorage.getItem('accessToken'); 
    console.log("Retrieved Token:", token);
    //Check if token is in local storage
    if(!token){
      console.log("couldn't identify token")
      return
    }
   
    //Request the backend in order to insert into DB
    axios.post(
      `http://localhost:3301/api/shoppingcart`,
      //Json for data transfer
      {
        ItemID: results.ItemID,
        Quantity: document.getElementById("quantity").value
      },
      //Make sure backend recieves token
      {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      }
    )
      .then((response) => {
        //If successfully added, then navigate home
        console.log("Item added to shopping cart:", response.data);
        navigate("/")
      })
      .catch((error) => {
        console.error("Error:", error);
        if(error.response.status === 401){
          logout()
        }
      });
  };

  return (
    <section className="w-[800px] mx-auto bg-gray-200 p-5 mt-12 flex flex-col">
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

      
      {/* Select the quantity from 1 - max availability */}
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

        {/* Add to Cart Button */}
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
