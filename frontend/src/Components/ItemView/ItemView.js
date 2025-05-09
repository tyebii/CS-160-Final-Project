import React, { useState, useEffect } from 'react';

import { useParams, useNavigate } from 'react-router-dom';

import { useAuth } from '../../Context/AuthHook';

// Redirect Modal
import { RedirectModal } from '../ItemView/RedirectModal';

// Import Formatter
import { validateID, validateQuantity } from '../Utils/Formatting';

import { useErrorResponse } from '../Utils/AxiosError';

import { useCart } from '../../Context/ShoppingcartContext';

import axios from 'axios';

// Item View Component
const ItemView = ({ searchType, query }) => {

  const { addItem } = useCart();

  const { handleError } = useErrorResponse();

  const { auth } = useAuth();

  const [quantity, setQuantity] = useState(1);

  const { itemid } = useParams();

  const [results, setResults] = useState({});

  const [featured, setFeatured] = useState(false)

  const [redirectModalOpen, setRedirectModalOpen] = useState(false);

  const navigate = useNavigate();

  //Pull Item Information
  useEffect(() => {

    const fetchInventory = async () => {

      if (auth === undefined){

        return; 

      }


      if (!validateID(itemid)) {

        navigate('/');

        return;

      }
  
      try {

        let endPoint = "";
  
        if (auth == null || auth === "Customer") {

          endPoint = `http://localhost:3301/api/inventory/search/itemID/customer/${itemid}`;
       
        } else {

          endPoint = `http://localhost:3301/api/inventory/search/itemID/employee/${itemid}`;
        
        }
  
        const response = await axios.get(endPoint, {

          withCredentials: true,

          headers: {

            'Content-Type': 'application/json',

          },

        });
  
        if (response.data.length === 0) {

          alert("No Item Found")

          navigate('/');

          return;

        }
  
        setResults(response.data[0]);

        setFeatured(response.data[0].FeaturedID != null);

        return
  
      } catch (error) {

        handleError(error);

      }

    };
  
    fetchInventory();

  }, [itemid, auth]);  

  // Adding The Item To Shopping Cart
  const clickAdd = async (e) => {

    e.preventDefault();

    if (!validateID(itemid)) {

      return;

    }

    if (isNaN(quantity)) {

      alert("Quantity Must Be A Number");

      return;

    }

    const numericQty = Number(quantity);

    if (!validateQuantity(numericQty)) {
      
      return;

    }

    try {

      await axios.post(

        `http://localhost:3301/api/shoppingcart/shoppingcart`,

        {

          ItemID: itemid,

          Quantity: numericQty,

        },

        {

          withCredentials: true,

          headers: {

            'Content-Type': 'application/json',

          },

        }

      );
      
      addItem(itemid)

      if(!searchType || !query){
        
        navigate("/")

        return 

      }

      navigate(`/search/${searchType}/${query}`);

      return 

    } catch (error) {

      handleError(error);

    }
    
  };

  // Handle Delete Functionality
  const handleDelete = async () => {

    if (!window.confirm('Are you sure you want to delete this item?')) {

      return;

    }
  
    if (!validateID(itemid)) {

      return;

    }
  
    try {

      await axios.delete(

        `http://localhost:3301/api/inventory/delete/item/${itemid}`,

        {

          withCredentials: true,

          headers: {

            'Content-Type': 'application/json',

          },

        }

      );

      navigate('/');

      return
  
    } catch (error) {

      handleError(error);
      
      return

    }

  };
  
  //Handle Add To Featured
  const handleAddFeatured = async () => {

    if (!validateID(itemid)) {

      return;

    }

    try {

      await axios.post(

        `http://localhost:3301/api/inventory/featured`,

        { ItemID: itemid },

        {

          withCredentials: true,

          headers: {

            'Content-Type': 'application/json',

          },

        }

      );

      setFeatured(true);

      return

    } catch (error) {

      handleError(error);

    }

  };

  //Handle Delete From Featured
  const handleDeleteFeatured = async () => {

    if (!validateID(itemid)) {

      return;

    }
  
    try {

      await axios.delete(

        `http://localhost:3301/api/inventory/featured/${itemid}`,

        {

          withCredentials: true,

          headers: {

            'Content-Type': 'application/json',

          },

        }

      );

      setFeatured(false);

      return
  
    } catch (error) {

      handleError(error);

    }

  };
  
  return (

  <section className="w-full bg-white shadow-lg p-8 flex flex-col gap-8 flex-grow">

      <div className="grid md:grid-cols-2 px-8 justify-between">

        <div className="flex flex-col md:w-1/2 ">

          <div className="flex flex-col space-y-5 pt-4">

            <h2 className="text-5xl font-bold text-gray-900">{results.ProductName}</h2>

            <h3 className="text-3xl font-semibold text-gray-900">${(results.Cost * 1).toFixed(2)}</h3>

            {(auth === "Employee" || auth === "Manager") && (

              <div className="space-y-1 text-gray-700">

                <p><span className="font-semibold">Last Modified:</span> {results.LastModification?.slice(0, 10)}</p>

                <p><span className="font-semibold">Item ID:</span> {results.ItemID}</p>

                <p><span className="font-semibold">Category:</span> {results.Category}</p>

                <p><span className="font-semibold">Supplier Cost:</span> ${results.SupplierCost}</p>

              </div>

            )}


            <div className="space-y-1 text-gray-700">

              <p><span className="font-semibold">Last Modified:</span> {results.LastModification? results.LastModification.slice(0,10):null}</p>

              <p><span className="font-semibold">Availability:</span> {results.Quantity}</p>

              <p><span className="font-semibold">Expiration:</span> {results.Expiration?.slice(0, 10)}</p>

              <p><span className="font-semibold">Storage Type:</span> {results.StorageRequirement}</p>

              <p><span className="font-semibold">Item Weight:</span> {results.Weight} lbs</p>

            </div>

          </div>

          <hr className="my-4 border-gray-200 border-2"></hr>

        </div>



        <div className="my-4 row-span-1 md:row-span-2 w-full md:w-[300px] lg:w-[500px] md:h-[500px] flex items-center justify-center">

          <img

            src={results.ImageLink}

            alt={results.ProductName}

            className="max-w-full max-h-full object-contain"

          />

        </div>

        {(auth === "Customer" || !auth) && (

          <form className="flex flex-col gap-4">

            <label htmlFor="quantity" className="text-lg font-semibold text-gray-800">

              Select Quantity:

            </label>


            {results.Quantity === 0 ? (

              <p className="text-green-600 font-medium">No Available Stock</p>

            ) : (

              <>

                <select

                  id="quantity"

                  required

                  value={quantity}

                  onChange={(e) => setQuantity(Number(e.target.value))}

                  className="border border-gray-300 rounded-lg p-2 max-w-20 focus:ring-2 focus:ring-green-400"

                >

                  {Array.from({ length: Math.min(results.Quantity, 100) }, (_, i) => (

                    <option key={i + 1} value={i + 1}>{i + 1}</option>

                  ))}

                </select>

                <div className="font-semibold text-xl">
                  Total: ${((quantity * results.Cost * 100) / 100).toFixed(2)}
                </div>

                <div className="flex flex-row xl:w-5/6 space-x-4">

                  <button

                    onClick={clickAdd}
                    

                    className="bg-green-600 hover:bg-gray-200 text-white hover:text-gray-800 font-semibold py-3 px-24 rounded-lg max-w-md shadow-md transition-all"
                  >

                    Add to Cart

                  </button>

                  {redirectModalOpen && (

                    <RedirectModal onBack={() => {setRedirectModalOpen(false)}} onClose={() => { setRedirectModalOpen(false) }}></RedirectModal>

                  )}

                </div>

              </>

            )}

          </form>

        )}

      </div>

      <hr className="border-gray-200 border-2"></hr>

      <div>

        <h3 className="text-3xl font-bold text-gray-800 mb-2">Product Information</h3>

        <p className="text-gray-600 leading-relaxed">{results.Description}</p>

      </div>

      {auth === "Manager" && (

        <div className="flex justify-center gap-4 mt-6">

          <button

            onClick={() => navigate('/itemedit', { state: results })}

            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-lg shadow transition"

          >

            Edit

          </button>

          <button

            onClick={handleDelete}

            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow transition"

          >

            Delete

          </button>

          <button

            onClick={featured ? handleDeleteFeatured : handleAddFeatured}

            className="bg-blue-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow transition"

          >

            {featured ? "Remove From Featured" : "Add To Featured"}

          </button>

        </div>

      )}

    </section>

  );

};

export default ItemView;