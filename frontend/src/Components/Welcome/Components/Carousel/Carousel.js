//Import React Functions
import { useNavigate } from "react-router-dom";

import { useState, useEffect } from 'react';

//Import Axios
import axios from "axios";

//Error Message Hook
import { useErrorResponse } from '../../../Utils/AxiosError';

//Carousel Component
export default function Carousel({auth}) {

    var [loadedFeatured, setFeatured] = useState([])

    var [index, changeIndex] = useState(0);

    const { handleError } = useErrorResponse(); 

    //Get The Featured Items From The Backend
    useEffect(() => {

        if (auth === "Employee" || auth === "Manager") {

            return; 

        }

        axios.get("http://localhost:3301/api/inventory/featured")

            .then((results) => {
                
                setFeatured(results.data);

            })
            .catch((error) => {

                handleError(error)

            });

    }, [auth]);

    //Handle Left Click
    var handleLeftClick = () => {

        changeIndex((index + 1) % loadedFeatured.length);

    };

    //Carousel Left Click
    var handleRightClick = () => {

        if(index - 1 === -1){

            changeIndex(loadedFeatured.length - 1);

            return;

        }

        changeIndex((index - 1) % loadedFeatured.length);

    };

    //Loads The Carousel Items
    var loadCarousel = () => {

        if (loadedFeatured.length > 0) {

            let tempIndex = index;

            const featuredProducts = []; 

            for (let i = 0; i < Math.min(3,loadedFeatured.length) ; i++) {

                tempIndex = (index + i) % loadedFeatured.length;

                featuredProducts.push((

                    <FeaturedProductCard

                        key={loadedFeatured[tempIndex].ItemID}

                        item={loadedFeatured[tempIndex].ItemID}

                        cost ={loadedFeatured[tempIndex].Cost}

                        distributor ={loadedFeatured[tempIndex].Distributor}

                        imageSrc={loadedFeatured[tempIndex].ImageLink}

                        productName={loadedFeatured[tempIndex].ProductName}

                    />

                ));

            }

            return featuredProducts; 

        }else{

            return <p className="text-2xl text-gray-500">No Featured Products</p>;

        }

    }

    return (
        
        (auth === null || auth === "Customer") ? (

            <article className="text-center mb-10">

                <h2 className="text-2xl mb-4">Featured Products</h2>

                <div className="flex items-center justify-center gap-4 overflow-x-auto p-3">

                    <button

                        className="text-2xl bg-blue-500 text-white rounded-full p-3 hover:bg-blue-700"

                        onClick={handleLeftClick}

                    >

                        ←

                    </button>
    
                        {/* Render carousel items */}

                        {loadCarousel()}
    
                    <button

                        className="text-2xl bg-blue-500 text-white rounded-full p-3 hover:bg-blue-700"

                        onClick={handleRightClick}

                    >

                        →

                    </button>

                </div>

            </article>  

        ) : null

    );
    
} 






//Featured Product Card
const FeaturedProductCard = ({ item, cost, distributor, imageSrc, productName }) => {

  //Import Navigate 
  const navigate = useNavigate();

  //View The Item
  const clickView = () => {

    navigate(`/itemview/${item}`);

  };

  return (
    <div className="w-64 h-[26rem] bg-white border border-gray-200 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col items-center p-5 transform hover:scale-[1.06] hover:border-red-500 group">
      
      {/* Product Image */}
      <div className="w-48 h-48 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-inner group-hover:shadow-lg transition duration-300">
        
        <img 

          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300" 
          
          src={imageSrc} 

          alt={productName} 

        />

      </div>
  
      {/* Product Name */}
      <p className="text-lg font-bold text-gray-800 mt-4 text-center group-hover:text-red-600 transition-colors duration-300">
        
        {productName}

      </p>
  
      {/* Optional Price Label */}
    <span className="mt-1 text-sm text-gray-500">Cost: {cost}</span>

    <span className="mt-1 text-sm text-gray-500">Distributor: {distributor}</span>
  
      {/* View Button */}
      <button 

        onClick={clickView}

        className="mt-auto bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full font-medium shadow-md hover:shadow-lg hover:brightness-110 hover:scale-105 transition-all duration-300 flex items-center gap-2"
      
      >

        View Item

      </button>

    </div>
    
  );
  

};


