//Import React Icons
import {

  FaTrash,

} from "react-icons/fa";

import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import AddressComponent from "./Components/AddressComponent"

import { AddressModal } from './Components/AddressModal';

import ProductComponent from './Components/ProductComponent';

import axios from 'axios';

import { validateAddress, validateID, validateName } from '../Utils/Formatting';

import { useErrorResponse } from '../Utils/AxiosError';

import { useCart } from '../../Context/ShoppingcartContext';

//Shopping Cart Component
function ShoppingCart() {

  const { removeItem, clearItems } = useCart()

  const [isProcessing, setIsProcessing] = useState(false);

  const { handleError } = useErrorResponse();

  const [results, setResults] = useState([]);

  const [weight, setWeight] = useState(0);

  const [deliveryFee, setDeliveryFee] = useState(0);

  const [cost, setCost] = useState(0);

  const [selectedAddress, setSelectedAddress] = useState(null);

  const [addressModalOpen, setAddressModalOpen] = useState(false);

  const [addresses, setAddresses] = useState([{ Name: "In Store Pickup", Address: "272 E Santa Clara St, San Jose, CA 95112" }]);

  //Load The Shopping Cart And Addresses
  useEffect(() => {

    (async () => {

      try {

        const [cartRes, addressRes] = await Promise.all([

          axios.get('http://localhost:3301/api/shoppingcart/shoppingcart', {

            withCredentials: true,

            headers: { 'Content-Type': 'application/json' }

          }),

          axios.get('http://localhost:3301/api/address/address', {

            withCredentials: true,

            headers: { 'Content-Type': 'application/json' }

          })

        ]);

        setResults(cartRes.data);

        setAddresses(prev => {

          const existingAddresses = new Set(prev.map(addr => addr.Address));

          const newUniqueAddresses = addressRes.data.filter(addr => !existingAddresses.has(addr.Address));

          return [...prev, ...newUniqueAddresses];

        });

      } catch (error) {

        handleError(error);

      }

    })();

  }, []);

  //Load The Total
  useEffect(() => {

    const newWeight = results.reduce((sum, item) => sum + item.Weight * item.OrderQuantity, 0);

    const newCost = results.reduce((sum, item) => sum + item.Cost * item.OrderQuantity, 0);

    setWeight(newWeight);

    setCost(newCost);

    setDeliveryFee(newWeight >= 20 ? 10 : 0);

  }, [results, selectedAddress]);

  // Clear The Cart
  const handleClear = async () => {

    try {

      if (results.length == 0) {

        alert("Nothing To Clear");

        return

      }

      await axios.delete('http://localhost:3301/api/shoppingcart/shoppingcart/clear', {

        withCredentials: true,

        headers: { 'Content-Type': 'application/json' }

      });

      clearItems();

      setResults([]);

    } catch (error) {

      handleError(error);

    }

  };

  //Remove From The Cart
  const clickRemove = async (itemid) => {

    if (!validateID(itemid, "ItemID")) {

      return;

    }

    try {

      await axios.delete('http://localhost:3301/api/shoppingcart/shoppingcart', {

        withCredentials: true,

        headers: { 'Content-Type': 'application/json' },

        data: { ItemID: itemid },

      });

      removeItem(itemid)

      setResults((prevItems) => prevItems.filter((item) => item.ItemID !== itemid));

    } catch (error) {

      handleError(error);

    }

  };

  //Click Checkout
  const clickCheckout = async () => {

    if (isProcessing) return;

    setIsProcessing(true);

    if (selectedAddress == null) {

      alert("Must Select Address")

      setIsProcessing(false);

      return

    }

    if (weight > 200 && selectedAddress.Address != addresses[0].Address) {

      alert("Cannot Have A Transaction Over 200 LBS Be Delivered")

      setIsProcessing(false);

      return

    }

    if (results.length === 0) {

      alert("Cannot checkout. There are no items");

      setIsProcessing(false);

      return;

    }

    for (let i = 0; i < results.length; i++) {

      if (results[i].Quantity == 0) {

        alert("Cannot Order Something Of Zero Quantity")

        return

      }

      if (results[i].Quantity < results[i].OrderQuantity) {

        alert("Not Enough Supply")

        return

      }

    }

    if (! await validateAddress(selectedAddress?.Address, "Address")) {

      setIsProcessing(false);

      return;

    }

    if (cost < 0.5) {

      alert("Cost Must Be Greater Than $.5 To Checkout");

      setIsProcessing(false);

      return;

    }

    try {

      const response = await axios.post(

        'http://localhost:3301/api/stripe/create-checkout-session',

        {

          TransactionAddress: selectedAddress.Address,

        },

        {

          withCredentials: true,

          headers: { 'Content-Type': 'application/json' }

        }

      );

      clearItems();

      window.location.href = response.data.url;

    } catch (error) {

      handleError(error);

      setIsProcessing(false);

    }

  };

  //Enables Users To Add Addresses
  const handleAddAddress = async (e) => {

    e.preventDefault();

    const formData = new FormData(e.target);

    const name = formData.get("Name");

    const address = formData.get("Address");

    const composedAddress = address

    const isAddressValid = await validateAddress(composedAddress, "Address");

    const isNameValid = validateName(name, "Name");

    if (!isAddressValid || !isNameValid) {

      return;

    }

    if (address === "272 East Santa Clara Street, San Jose, California 95113, United States" || address === "272 E Santa Clara St, San Jose, CA 95112") {

      alert("Cannot Add Store")

      return

    }

    try {

      const response = await axios.post(

        `http://localhost:3301/api/address/address`,

        {

          address: composedAddress,

          name: name,

        },

        {

          withCredentials: true,

          headers: { 'Content-Type': 'application/json' },

        }

      );

      setAddresses((prevAddresses) => [

        ...prevAddresses,

        { Address: composedAddress, Name: name },

      ]);

      setAddressModalOpen(false);

    } catch (error) {

      handleError(error);

      setAddressModalOpen(false);

    }

  };

  return (

    <section className="md:flex w-full p-8 bg-white flex-1">

      <div className="flex md:w-2/3 md:flex-row justify-between mb-8">

        <div className="flex flex-col w-full gap-2">

          <div className="grid h-[400px] overflow-y-auto">

            <h2 className="text-3xl mx-8 my-4">Your Cart <span className="text-gray-500">({results.length})</span></h2>

            <h2 className="text-2xl mx-8 my-4">Free Delivery Under 20 LBS </h2>

            <hr className="border-1 mx-6 mb-4"></hr>

            {results.length === 0 ? (

              <h3 className="text-2xl font-semibold text-gray-500 text-center">No items in the cart</h3>

            ) : (

              results.map((result) => (

                <div className="relative flex items-center" key={result.ItemID}>

                  <Link to={`/itemview/${result.ItemID}`} className="flex-grow hover:text-blue-600">

                    <ProductComponent result={result} />

                  </Link>

                  <div className="absolute right-4 flex justify-center items-center h-full w-1/8 md:w-1/6">

                    <FaTrash onClick={() => clickRemove(result.ItemID)} className="bg-white text-3xl text-gray-400 hover:cursor-pointer hover:text-red-500 transition duration-300" />

                  </div>

                </div>

              ))

            )}

          </div>



          <div className="flex justify-end mx-4">

            <h3 onClick={handleClear} className="w-auto h-7 px-3 mr-auto m-4 text-lg text-white bg-green-600 shadow-md rounded-lg hover:scale-105 transition-all duration-300 hover:shadow-lg hover:cursor-pointer">

              Clear Cart

            </h3>

            <div className="flex justify-between gap-6 text-gray-700">

              <div className="flex flex-col border-gray-300 text-lg font-semibold">

                <h3>Weight:</h3>

                <h3>Subtotal:</h3>

                <h3>Delivery Fee:</h3>

                <h3>Total:</h3>

              </div>

              <div className="flex flex-col text-end border-gray-300 text-lg">

                <h3>{weight.toFixed(2)} lbs</h3>

                <h3>{cost}</h3>

                <h3>{deliveryFee.toFixed(2)}</h3>

                <h3>${(deliveryFee + cost).toFixed(2)} </h3>

              </div>

            </div>

          </div>

        </div>

      </div>

      <div className="container md:w-1/3 mx-auto">

        <div className="flex flex-wrap justify-center">

          <div className="w-full px-8 py-4 ">

            <h2 className="text-3xl text-gray-800 mb-8">Delivery Options</h2>

            <div className="h-[350px] overflow-y-auto border border-gray-300">

              <button

                className="flex ml-16 my-4 text-blue-600 hover:text-blue-800 hover:underline text-sm"

                onClick={() => setAddressModalOpen(true)}

              >

                Add an Address

              </button>

              <form>

                {addresses.length === 0 ? (

                  <p className="text-gray-500">No address added yet.</p>

                ) : (

                  addresses.map((address) => (

                    <div key={address.Address} className="flex items-center my-2 w-full">

                      <input

                        type="radio"

                        id={address.Address}

                        name="address"

                        onChange={() => setSelectedAddress(address)}

                        className="ml-8 mr-4"

                      />

                      <label htmlFor={address.Address} className="flex text-gray-800 md:w-full lg:w-3/4">

                        <AddressComponent address={address} setAddress={setAddresses} addressList={addresses} />

                      </label>

                    </div>

                  ))

                )}

              </form>



            </div>

            {addressModalOpen && (

              <AddressModal submitHandle={handleAddAddress} onCancel={() => { setAddressModalOpen(false) }} onClose={() => { setAddressModalOpen(false) }}></AddressModal>

            )}

          </div>

        </div>

        <div className="flex w-2/3 mx-auto mt-10 md:mt-16">

          <button

            onClick={clickCheckout}

            disabled={isProcessing}

            className={`${isProcessing ? "bg-gray-300 cursor-not-allowed text-black" : "bg-green-600 hover:bg-green-400 text-white"

              } text-2xl py-3 px-6 rounded-lg w-full transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg`}

          >

            {isProcessing ? "Processing..." : "Proceed to Checkout"}

          </button>

        </div>



      </div>



    </section>

  );

}

export default ShoppingCart;
