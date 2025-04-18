import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import AddressComponent from "./Components/AddressComponent"

import { AddressModal } from './Components/AddressModal';

import ProductComponent from './Components/ProductComponent';

import axios from 'axios';

import { validateAddress, validateID, validateName} from '../Utils/Formatting';

//Token Validation Hook
import { useValidateToken } from '../Utils/TokenValidation';

//Error Message Hook
import { useErrorResponse } from '../Utils/AxiosError';

//Shopping Cart Component
function ShoppingCart() {

  const validateToken = useValidateToken();

  const { handleError } = useErrorResponse(); 
  
  const [results, setResults] = useState([]);

  const [weight, setWeight] = useState(0);

  const [deliveryFee, setDeliveryFee] = useState(0);

  const [cost, setCost] = useState(0);

  const [selectedAddress, setSelectedAddress] = useState(null); 

  const [addressModalOpen, setAddressModalOpen] = useState(false);

  const [addresses, setAddresses] = useState([{Name: "In Store Pickup", Address: "272 E Santa Clara St, San Jose, CA 95112"}]);

  //Load The Shopping Cart And Addresses
  useEffect(() => {

    const token = validateToken()

    axios

      .get('http://localhost:3301/api/shoppingcart/shoppingcart', {

        headers: {

          Authorization: `Bearer ${token}`,

        },

      })

      .then((response) => {

        setResults(response.data); 

      })

      .catch((error) => {

          handleError(error)

    });

    axios

      .get('http://localhost:3301/api/address/address', {

        headers: {

          Authorization: `Bearer ${token}`,

        },

      })

      .then((response) => {

        setAddresses(prev => {

          const existingAddresses = new Set(prev.map(addr => addr.Address));
          
          const newUniqueAddresses = response.data.filter(addr => !existingAddresses.has(addr.Address));

          return [...prev, ...newUniqueAddresses];
        
        });
        
      })

      .catch((error) => {

        handleError(error)

      });

  }, []);

  //Load The Total
  useEffect(() => {

    const newWeight = results.reduce((sum, item) => sum + item.Weight * item.OrderQuantity, 0);

    const newCost = results.reduce((sum, item) => sum + item.Cost * item.OrderQuantity, 0);
  
    setWeight(newWeight);

    setCost(newCost);

    setDeliveryFee(newWeight >= 20 ? 10 : 0);

  }, [results]);

  //Clear The Cart
  const handleClear = () => {

    const token = validateToken()

    axios

      .delete('http://localhost:3301/api/shoppingcart/shoppingcart/clear', {

        headers: { Authorization: `Bearer ${token}` },

      })

      .then(() => {

        alert("Cleared Your Shoppingcart!")

        setResults([]);

      })
  
      .catch((error) => {
        
        handleError(error)

      })

  };

  //Remove From The Cart
  const clickRemove = (itemid) => {

    const token = validateToken()

    if(!validateID(itemid)){

      return res.status(statusCode.BAD_REQUEST).json({ error: "Item ID Is Invalid" });

    }

    axios

      .delete('http://localhost:3301/api/shoppingcart/shoppingcart', {

        headers: { Authorization: `Bearer ${token}` },

        data: { ItemID: itemid },

      })

      .then(() => {

        alert("Deleted The Item!")

        setResults((prevItems) => prevItems.filter((item) => item.ItemID !== itemid));

      })
      .catch((error) => {
        
        handleError(error);

      })

  };

  //Click Checkout
  const clickCheckout = () => {

    const token = validateToken()

    if(results.length==0){

      alert("Cannot checkout. There are no items")

      return

    }

    if(!validateAddress(selectedAddress.Address)){

      alert("Select Address!")

      return

    }
    
    axios

        .post('http://localhost:3301/api/stripe/create-checkout-session', {

            TransactionAddress: selectedAddress.Address,

        }, {

            headers: { Authorization: `Bearer ${token}` },

        })

        .then((response) => {

          window.location.href = response.data.url;

        })

        .catch((error) => {

          handleError(error);

        })

  };

  const handleAddAddress = (e) => {

    e.preventDefault();
  
    const token = validateToken();
  
    const formData = new FormData(e.target);

    const name = formData.get("Name");

    const address = formData.get("Address");

    const zip = formData.get("Zip");
  
    const composedAddress = `${address}, San Jose, CA ${zip}`;

    if (!validateAddress(composedAddress)) {

      return;

    }
  
    if (!validateName(name)) {

      return;

    }
  
    axios.post(

      `http://localhost:3301/api/address/address`,

      {

        address: composedAddress,

        name: name

      },

      {

        headers: {

          Authorization: `Bearer ${token}`,

        },

      }

    )

    .then((response) => {

      alert("Address Added!");

      setAddresses((prevAddresses) => [...prevAddresses, {

        Address: composedAddress,

        Name: name

      }]);

      setAddressModalOpen(false);

    })

    .catch((error) => {

      handleError(error)

      setAddressModalOpen(false);

    });

  };
  

  return (
    <section className="w-full max-w-4xl mx-auto my-10 p-8 bg-gray-100 rounded-lg shadow-lg">

      <div className="text-center mb-6">

        <h2 className="text-4xl font-bold mb-2">Shopping Cart</h2>

        <h3 onClick={handleClear} className="text-md text-blue-500 underline hover:cursor-pointer">

          Clear

        </h3>

      </div>

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

                    <div key={address.Address} className="flex items-center mb-4 w-full"> 

                      <input

                        type="radio"

                        id={address.Address}

                        name="address"

                        onChange={() => setSelectedAddress(address)} 

                        className="mr-4"

                      />

                      <label htmlFor={address.Address} className="text-gray-800 w-full"> 

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

            {addressModalOpen && (

              <AddressModal submitHandle={handleAddAddress} onCancel={()=>{setAddressModalOpen(false)}} onClose={()=>{setAddressModalOpen(false)}}></AddressModal>

            )}

          </div>

        </div>

      </div>

      <div className="mt-12 text-center">

        <h1 className="text-3xl font-semibold mb-4">Subtotal</h1>

        <div className="p-6 border-2 border-gray-300 rounded-lg bg-white shadow-md text-lg">

          <h3>Raw Cost: ${cost}</h3>

          <h3>Weight: {weight} lbs</h3>

          <h3>Delivery Fee: ${deliveryFee} </h3>

          <h3>Total: ${deliveryFee + cost} </h3>

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
