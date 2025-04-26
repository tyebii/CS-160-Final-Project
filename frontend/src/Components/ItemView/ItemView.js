// Import React Functions
import React, { useState, useEffect } from 'react';

import { useParams, useNavigate } from 'react-router-dom';

// Import Auth Context
import { useAuth } from '../../Context/AuthHook';

// Import Formatter
import { validateID, validateQuantity } from '../Utils/Formatting';

//Error Message Hook
import { useErrorResponse } from '../Utils/AxiosError';

// Import Axios For Backend Queries
import axios from 'axios';

// Item View Component
const ItemView = ({ searchType, query }) => {

  const { handleError } = useErrorResponse(); 

  const { auth} = useAuth();

  const [quantity, setQuantity] = useState(1);

  const { itemid } = useParams();

  const [results, setResults] = useState({});

  const [featured, setFeatured] = useState(false)

  const navigate = useNavigate();

  //Pull Item Information
  useEffect(() => {

    const fetchInventory = async () => {

      if (!validateID(itemid)) {

        navigate('/');

        return;

      }
  
      try {

        let endPoint = "";
  
        if (!auth || auth === "Customer") {

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

          navigate('/');

          return;

        }
  
        setResults(response.data[0]);

        setFeatured(response.data[0].FeaturedID != null);
  
      } catch (error) {

        handleError(error);

      }

    };
  
    fetchInventory();

  }, [itemid]);  

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

      navigate(`/search/${searchType}/${query}`);

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
  
    } catch (error) {

      handleError(error);

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
  
    } catch (error) {

      handleError(error);

    }

  };
  
  return (

    <section className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-12 mb-12 flex flex-col space-y-8">

      <div className="flex flex-col md:flex-row gap-6">

        <div className="border border-gray-300 rounded-xl shadow-md bg-gray-50 p-4 w-full md:w-[300px] h-[300px] flex items-center justify-center">

          <img

            src={results.ImageLink}

            alt={results.ProductName}

            className="max-w-full max-h-full object-contain"

          />

        </div>

        <div className="flex-1 space-y-3">

          <h2 className="text-3xl font-bold text-gray-900">{results.ProductName}</h2>


          {(auth === "Employee" || auth === "Manager") && (

            <div className="space-y-1 text-gray-700">

              <p><span className="font-semibold">Last Modified:</span> {results.LastModification?.slice(0,10)}</p>

              <p><span className="font-semibold">Item ID:</span> {results.ItemID}</p>

              <p><span className="font-semibold">Category:</span> {results.Category}</p>

              <p><span className="font-semibold">Supplier Cost:</span> ${results.SupplierCost}</p>

            </div>

          )}


          <div className="space-y-1 text-gray-700">

            <p><span className="font-semibold">Distributed By:</span> {results.Distributor}</p>

            <p><span className="font-semibold">Availability:</span> {results.Quantity}</p>

            <p><span className="font-semibold">Expiration:</span> {results.Expiration?.slice(0,10)}</p>

            <p><span className="font-semibold">Storage Type:</span> {results.StorageRequirement}</p>

            <p className="text-lg font-semibold text-gray-900">Cost: ${results.Cost}</p>

            <p className="text-lg font-semibold text-gray-900">Weight: {results.Weight} lbs</p>

          </div>

        </div>

      </div>

      <div>

        <h3 className="text-2xl font-bold text-gray-800 mb-2">Description</h3>

        <p className="text-gray-600 leading-relaxed">{results.Description}</p>

      </div>



      {(auth === "Customer" || !auth) && (

        <form className="flex flex-col items-center space-y-4">

          <label htmlFor="quantity" className="text-lg font-semibold text-gray-700">

            Select Quantity:

          </label>


          {results.Quantity === 0 ? (

            <p className="text-red-600 font-medium">No Available Stock</p>

          ) : (

            <>

              <select

                id="quantity"

                required

                value={quantity}

                onChange={(e) => setQuantity(Number(e.target.value))}

                className="border border-gray-300 rounded-lg p-2 w-full max-w-xs focus:ring-2 focus:ring-red-500"

              >

                {Array.from({ length: results.Quantity }, (_, i) => (

                  <option key={i + 1} value={i + 1}>{i + 1}</option>

                ))}

              </select>


              <button

                onClick={clickAdd}

                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg w-full max-w-md shadow-md transition-all"
              
              >

                Add to Cart

              </button>

            </>

          )}

        </form>

      )}

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

            onClick={featured?handleDeleteFeatured:handleAddFeatured}

            className="bg-blue-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow transition"

          >

            {featured?"Remove From Featured":"Add To Featured"}

          </button>

        </div>

      )}

    </section>

  );

};


export default ItemView;
