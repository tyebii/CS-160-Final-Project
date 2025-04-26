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

            <article className="text-center p-20">

                <h2 className="text-center text-5xl mb-20 font-extrabold text-black tracking-wide">Featured Products</h2>

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
    <div className="w-64 h-[26rem] bg-white border border-gray-200 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center p-5 transform hover:scale-[1.06] hover:-translate-y-1 hover:border-pink-400 group">

        {/* Product Image */}
        <div className="w-48 h-48 flex items-center justify-center bg-gradient-to-br from-pink-100 via-yellow-100 to-blue-100 rounded-xl overflow-hidden shadow-inner group-hover:shadow-xl transition duration-300">
        
            <img 
            
            className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-300" 
                
            src={imageSrc} 
                
            alt={productName} 
            />

        </div>

        {/* Product Name */}
        <p className="text-xl font-extrabold text-gray-800 mt-4 text-center group-hover:text-pink-600 transition-colors duration-300 tracking-wide">
        
            {productName}

        </p>

        {/* Fancy Labels */}
        <div className="flex flex-col items-center mt-2 gap-1">

            <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800 font-semibold shadow-sm">
                
                💲 {cost}

            </span>

            <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 font-semibold shadow-sm">
                
                📦 {distributor}

            </span>

        </div>

        {/* View Button */}
        <button 

        onClick={clickView}

        className="mt-auto bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
        
        >

        🛒 View Item

        </button>

    </div>


    
  );
  

};


