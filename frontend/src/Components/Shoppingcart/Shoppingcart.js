//Import React Libraries 
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

//Import Custom Components 
import AddressComponent from "./Components/AddressComponent"
import { AddressModal } from './Components/AddressModal';

//Import Auth Context 
import {useAuth} from '../../Context/AuthHook'

//Import Product Component
import ProductComponent from './Components/ProductComponent';

//Import axios
import axios from 'axios';

//Shopping cart component
function ShoppingCart() {

  //Get the logout function from the auth context
  const {logout} = useAuth()
  
  // State Variable For Product Fetch 
  const [results, setResults] = useState([]);

  //State Variable For The Sum of The Results Weight
  const [weight, setWeight] = useState(0);

  //State Variable For The Delivery Fee
  const [deliveryFee, setDeliveryFee] = useState(0);

  //State Variable For The Sum of The Results Cost
  const [cost, setCost] = useState(0);

  //State Variable For The Current Address Selected Among the Radio Options 
  const [selectedAddress, setSelectedAddress] = useState(null); 

  //State Variable For The Visibility Of The AddressModal  
  const [addressModalOpen, setAddressModalOpen] = useState(false);

  //State Variable For The User's Addresses
  const [addresses, setAddresses] = useState([{Name: "In Store Pickup", Address: "272 E Santa Clara St", City: "San Jose", State:"CA", Zip:"95113"}]);

  //Fetches the User's Products And Addresses When The Page Mounts
  //This is likely causing a double logout alert
  useEffect(() => {

    //Get the JWT Token From The Local Storage
    const token = localStorage.getItem('accessToken');

    //If There Is No Token Alert The User and Log Them Out
    if (!token) {
      alert('No token found');
      logout()
      return;
    }

    //Fetch The User's Shopping Cart 
    axios
      .get('http://localhost:3301/api/shoppingcart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        //Set The Results State Variable To The Fetched Products
        setResults(response.data); 
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

    //Fetch the User's Associated Addresses
    axios
      .get('http://localhost:3301/api/address', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        //Set the Results State Variable To Previous State Plus The Response 
        setAddresses((prevAddresses) => [...prevAddresses, ...response.data]);
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

  }, []);

  //Recalulate The Cost And Weight State Variables When State Variable 'results' Changes
  useEffect(() => {
    // Compute weight and cost
    const newWeight = results.reduce((sum, item) => sum + item.Weight * item.OrderQuantity, 0);
    const newCost = results.reduce((sum, item) => sum + item.Cost * item.OrderQuantity, 0);
  
    // Update state variables
    setWeight(newWeight);
    setCost(newCost);
    setDeliveryFee(newWeight > 20 ? 10 : 0);
  }, [results]);

  //Clears The Cart
  const handleClear = () => {

    //Get The Token From The Local Storage
    const token = localStorage.getItem('accessToken');

    //If There Is No Token Alert The User and Log Them Out
    if (!token) {
      alert('No token found');
      logout()
      return;
    }

    //Deletes The User's Shopping Cart
    axios
      .delete('http://localhost:3301/api/shoppingcart/clear', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        //Set The Result's State To Reflect Change
        alert("Cleared Your Shoppingcart!")
        setResults([]);
      })
      .catch((error) => {
        //If Unauthorized Response
        if (error.response?.status === 401) {
          alert("You need to login again!");
          logout();
        }else{
          alert(`Error Status ${error.status}: ${error.response.data.error}`);
        }
      })
  };

  //Remove A Given Item From The User's Shopping Cart
  const clickRemove = (itemid) => {
    //Get The Token From The Local Storage
    const token = localStorage.getItem('accessToken');

    //If There Is No Token Alert The User and Log Them Out
    if (!token) {
      alert('No token found');
      logout()
      return;
    }

    //Delete An Item From The Shopping Cart
    axios
      .delete('http://localhost:3301/api/shoppingcart', {
        headers: { Authorization: `Bearer ${token}` },
        data: { ItemID: itemid },
      })
      .then(() => {
        alert("Deleted The Item!")
        //Set The Results To An Updated Form Where The Removed Item Is No Longer Present
        setResults((prevItems) => prevItems.filter((item) => item.ItemID !== itemid));
      })
      .catch((error) => {
        //If Unauthorized Response
        if (error.response?.status === 401) {
          alert("You need to login again!");
          logout();
        }else{
          alert(`Error Status ${error.status}: ${error.response.data.error}`);
        }
      })
  };

  // Checkout
  const clickCheckout = () => {
    //Get The Token From The Local Storage
    const token = localStorage.getItem('accessToken');

    //If There Is No Token Alert The User and Log Them Out
    if (!token) {
      alert('No token found');
      logout()
      return;
    }

    //If the Cart Is Empty Do Not Allow Checkout
    if(results.length==0){
      alert("Cannot checkout. There are no items")
      return
    }

    if(!selectedAddress){
      alert("Select Address!")
      return
    }

    //Create A Stripe Session Checkout
    axios
        .post('http://localhost:3301/api/create-checkout-session', {
            items: results.map((item) => ({
                ItemID: item.ItemID,
                Quantity: item.OrderQuantity,
            })),
            TransactionCost: cost + deliveryFee, 
            TransactionWeight: weight,
            TransactionAddress: selectedAddress.Address,
            TransactionStatus: "In Progress",
            TransactionDate: new Date(),
            InStore: selectedAddress == addresses[0]? true:false
        }, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          //If Successful Redirect To Success Page
          window.location.href = response.data.url;
        })
        .catch((error) => {
          //If Unauthorized Response
          if (error.response?.status === 401) {
            alert("You need to login again!");
            logout();
          }else{
            alert(`Error Status ${error.status}: ${error.response.data.error}`);
          }
        })
  };

  //Adds An Address To User
  const handleAddAddress = (e) => {
    //Gets The Address Values
    const newAddress = {Address: document.getElementById("address").value,
                        City: document.getElementById("city").value,
                        Zip: document.getElementById("zip").value,
                        State: document.getElementById("state").value,
                        Name: document.getElementById("name").value 
    }

    //Get The Token From The Local Storage
    const token = localStorage.getItem('accessToken');

    //If There Is No Token Alert The User and Log Them Out
    if (!token) {
      alert('No token found');
      logout()
      return;
    }

    //Adds The Address To The User
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
      alert("Address Added!");
      //Append New Address
      setAddresses((prevAddresses) => [...prevAddresses, newAddress]);
      //Close The Modal
      setAddressModalOpen(false);
    })
    .catch((error) => {
      //If Unauthorized Response
      if (error.response?.status === 401) {
        alert("You need to login again!");
        logout();
      }else{
        alert(`Error Status ${error.status}: ${error.response.data.error}`);
      }
      setAddressModalOpen(false);
    });
  };

  //HTML
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
      <div className="grid mb-8">
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

      {/* Address Section */}
      <div className="relative container px-4 mx-auto">
        <div className="flex flex-wrap justify-center">
          
          <div className="w-full lg:w-1/2 pb-8 bg-white p-6 rounded-lg shadow-lg border border-gray-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Address</h2>
            <div className="space-y-4">
            <form>
                {addresses.length === 0 ? (
                  <p className="text-gray-600">No address added yet.</p>
                ) : (
                  addresses.map((address) => (
                    <div key={address.Address} className="flex items-center mb-4 w-full"> {/* Add w-full or custom width */}
                      <input
                        type="radio"
                        id={address.Address}
                        name="address"
                        onChange={() => setSelectedAddress(address)} // Update selected address on change
                        className="mr-4"
                      />
                      <label htmlFor={address.Address} className="text-gray-800 w-full"> {/* Optionally, add w-full here for the address component */}
                        <AddressComponent address={address} setAddress={setAddresses} addressList={addresses}/>
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
              <AddressModal onSubmit={handleAddAddress} onCancel={()=>{setAddressModalOpen(false)}} onClose={()=>{setAddressModalOpen(false)}}>
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
          <h3>Raw Cost: ${cost}</h3>
          <h3>Weight: {weight} lbs</h3>
          <h3>Delivery Fee: ${deliveryFee} </h3>
          <h3>Total: ${deliveryFee + cost} </h3>
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
