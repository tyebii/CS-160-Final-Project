//Import React Libraries 
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

//Import Product Component
import ProductComponent from './Components/ProductComponent';

//Import axios
import axios from 'axios';

//Shopping cart component
function ShoppingCart() {
  //State variable to cause rerenders when the db is fetched or cleared
  const [results, setResults] = useState([]);
  
  //On load of the page access the db and get the products associated with user
  useEffect(() => {
    //Get token from local storage
    const token = localStorage.getItem('accessToken');

    //If token not in local storage
    if (!token) {
      console.error('No token found');
      return;
    }

    //Get request fetch the shopping cart
    axios
      .get('http://localhost:3301/api/shoppingcart', {
        //How backend recieves the token
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        //When data is recieved store in state variable
        setResults(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  //When the user clicks clear
  const clickClear = ()=>{
    //Get the token
    const token = localStorage.getItem('accessToken');

    //If the token is not there
    if (!token) {
      console.error('No token found');
      return;
    }

    //Request the backend to clear user's shopping cart
    axios
      .delete('http://localhost:3301/api/shoppingcart/clear', {
        //How the backend recieves the token
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        //Set the results state to empty if deletion is successful
        setResults([])
        console.log("Cleared");
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  //Remove select item
  const clickRemove = (itemid) => {
    // Get the token
    const token = localStorage.getItem('accessToken');

    if (!token) {
        console.error('No token found');
        return;
    }

    // Request the backend to remove the item
    axios
        .delete('http://localhost:3301/api/shoppingcart', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: { ItemID: itemid }
        })
        .then(() => {
            console.log("Deleted");
            // Update the UI by removing the item from state
            setResults(prevItems => prevItems.filter(item => item.ItemID !== itemid));
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};



  //Shopping cart component
  return (
    <section className="w-full max-w-4xl mx-auto my-10 p-8 bg-gray-100 rounded-lg shadow-lg">
      {/* Title and Clear Button*/}
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold mb-2">Shopping Cart</h2>
        <h3 onClick = {clickClear} className="text-md text-blue-500 underline hover:cursor-pointer">Clear</h3>
      </div>

      {/*The Items in the Cart*/}
      <div className="grid gap-6 mb-8">
        {results.length === 0 ? (
          <h3 className="text-2xl font-semibold text-gray-500 text-center">No items in the cart</h3>
        ) : (
          results.map((result) => (
            <div className="flex items-center gap-4 p-4 bg-white border-2 border-gray-300 rounded-lg shadow-md" key={`${result.ItemID}`}>
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

      {/* Subtotals */}
      <div className="mt-12 text-center">
        <h1 className="text-3xl font-semibold mb-4">Subtotal</h1>
        <div className="p-6 border-2 border-gray-300 rounded-lg bg-white shadow-md text-lg">
          <h3 className="mb-3">Cost: ${results.reduce((sum, item) => sum + (item.Cost * item.OrderQuantity), 0)}</h3>
          <h3>Weight: {results.reduce((sum, item) => sum + (item.Weight * item.OrderQuantity), 0)} lbs</h3>
        </div>
      </div>

      {/* Proceed to checkout */}
      <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-xl py-3 px-6 rounded-lg w-full mt-10 transition duration-300 ease-in-out">
        Proceed to Checkout
      </button>
    </section>
  );
}

export default ShoppingCart;