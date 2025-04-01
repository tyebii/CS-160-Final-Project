//Import React Libraries 
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import AddressComponent from "./Components/AddressComponent"
import { AddressModal } from './Components/AddressModal';
import {useAuth} from '../../Context/AuthHook'
//Import Product Component
import ProductComponent from './Components/ProductComponent';

//Import axios
import axios from 'axios';

//Shopping cart component
function ShoppingCart() {

  const {logout} = useAuth()
  
  // State variables
  const [results, setResults] = useState([]);
  const [weight, setWeight] = useState(0);
  const [cost, setCost] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null); // Added state for selected address
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addresses, setAddresses] = useState([{Name: "In Store Pickup", Address: "272 E Santa Clara St", City: "San Jose", State:"CA", Zip:"95113"}]);

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
        setResults(response.data); 
      })
      .catch((error) => {
        console.error('Error:', error);
        if (error.response?.status === 401) {
          alert("You need to login again!")
          logout();
        }
      });

    axios
      .get('http://localhost:3301/api/address', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data)
        setAddresses((prevAddresses) => [...prevAddresses, ...response.data]);
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

    if(results.length==0){
      alert("Cannot checkout. There are no items")
      return
    }
    axios
        .post('http://localhost:3301/api/create-checkout-session', {
            items: results.map((item) => ({
                ItemID: item.ItemID,
                Quantity: item.OrderQuantity,
            })),
        }, {
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

  const handleAddressClick = () => {
    setAddressModalOpen(false);
  };

  const handleAddAddress = (e) => {
    const newAddress = {Address: document.getElementById("address").value,
                        City: document.getElementById("city").value,
                        Zip: document.getElementById("zip").value,
                        State: document.getElementById("state").value,
                        Name: document.getElementById("name").value 
    }

    const token = localStorage.getItem('accessToken');
    axios.post(
      `http://localhost:3301/api/address`,
      newAddress,
      {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      }
    )
    .then((response) => {
      console.log("Address Added");
      
      setAddresses((prevAddresses) => [...prevAddresses, newAddress]);
      setAddressModalOpen(false);
    })
    .catch((error) => {
      
      if (error.response?.status === 401) {
        alert("Need to log back in")
        logout();
      } 
      alert(error.message)
      setAddressModalOpen(false);
    });
  };

  const handleAddressSelection = (address) => {
    setSelectedAddress(address); 
  };

  return (
    <section className="w-full max-w-4xl mx-auto my-10 p-8 bg-gray-100 rounded-lg shadow-lg">
      {/*Header*/}
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold mb-2">Shopping Cart</h2>
        <h3 onClick={handleClear} className="text-md text-blue-500 underline hover:cursor-pointer">
          Clear
        </h3>
      </div>

      {/*Products in shopping cart */}
      <div className="grid gap-6 mb-8">
        {results.length === 0 ? (
          <h3 className="text-2xl font-semibold text-gray-500 text-center">No items in the cart</h3>
        ) : (
          results.map((result) => (
            <div className="flex items-center gap-4 p-4" key={result.ItemID}>
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

      
      <div className="relative container px-4 mx-auto">
        <div className="flex flex-wrap justify-center">
          {/* Address Section */}
          <div className="w-full lg:w-1/2 pb-8 bg-white p-6 rounded-lg shadow-lg border border-gray-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Address</h2>
            <div className="space-y-4">
            <form>
                {addresses.length === 0 ? (
                  <p className="text-gray-600">No address added yet.</p>
                ) : (
                  addresses.map((address, index) => (
                    <div key={index} className="flex items-center mb-4 w-full"> {/* Add w-full or custom width */}
                      <input
                        type="radio"
                        id={`address-${index}`}
                        name="address"
                        onChange={() => handleAddressSelection(address)} // Update selected address on change
                        className="mr-4"
                      />
                      <label htmlFor={`address-${index}`} className="text-gray-800 w-full"> {/* Optionally, add w-full here for the address component */}
                        <AddressComponent address={address} />
                      </label>
                    </div>
                  ))
                )}
              </form>
              <button
                className="text-blue-600 hover:text-blue-800 mt-4 text-sm"
                onClick={() => setAddressModalOpen(true)}
              >
                Add an Address
              </button>
            </div>

            {/* Address Modal */}
            {addressModalOpen && (
              <AddressModal onSubmit={handleAddAddress} onCancel={handleAddressClick} onClose={handleAddressClick}>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      name="Name"
                      id="name"
                      className="w-2/3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                      placeholder="Custom Name"
                      required
                    />
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      name="Address"
                      id="address"
                      className="w-2/3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                      placeholder="Address"
                      required
                    />
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      name="City"
                      id="city"
                      className="w-1/3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                      value="San Jose"
                      readOnly
                      required
                    />
                    <input
                      type="text"
                      name="State"
                      id="state"
                      className="w-1/3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                      value="CA"
                      readOnly
                      required
                    />
                    <input
                      type="text"
                      name="Zip"
                      id="zip"
                      className="w-1/3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                      placeholder="ZIP"
                      required
                    />
                  </div>
                </div>
              </AddressModal>
            )}
          </div>
        </div>
      </div>

      {/* Subtotal */}
      <div className="mt-12 text-center">
        <h1 className="text-3xl font-semibold mb-4">Subtotal</h1>
        <div className="p-6 border-2 border-gray-300 rounded-lg bg-white shadow-md text-lg">
          <h3 className="mb-3">Cost: ${cost}</h3>
          <h3>Weight: {weight} lbs</h3>
        </div>
      </div>

      {/* Submit */}
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
