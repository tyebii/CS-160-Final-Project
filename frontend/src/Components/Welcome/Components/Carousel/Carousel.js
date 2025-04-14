//Import React Functions
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';

//Import Axios
import axios from "axios";

//Carousel Component
export default function Carousel({auth}) {

    //The Items That Are On The Carousel
    var [loadedFeatured, setFeatured] = useState([])
    //Carousel Index
    var [index, changeIndex] = useState(0);

    //Get The Featured Items From The Backend
    useEffect(() => {
        //Don't Fetch The Results If The User Is An Employee Or Manager
        if (auth === "Employee" || auth === "Manager") {
            return; 
        }

        //Request The Featured Items From The Backend
        axios.get("http://localhost:3301/api/inventory/featured")
            .then((results) => {
                console.log(results)
                //Set The Featured Items To The State
                setFeatured(results.data);
            })
            .catch((error) => {
                if (error.response?.data?.error) {
                    alert(`Error Status ${error.response.status}: ${error.response.data.error}`);
                } else {
                    alert(error.message);
                }
            });
    }, [auth]);

    //Carousel Right Click
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
        //Checks If The Featured Items Are Loaded
        if (loadedFeatured.length > 0) {
            let tempIndex = index;
            const featuredProducts = []; // Array to store JSX elements

            // Loop to collect 3 products at a time
            for (let i = 0; i < 3; i++) {
                tempIndex = (index + i) % loadedFeatured.length;
                featuredProducts.push((
                    <FeaturedProductCard
                        key={loadedFeatured[tempIndex].ItemID}
                        item={loadedFeatured[tempIndex].ItemID}
                        imageSrc={loadedFeatured[tempIndex].ImageLink}
                        productName={loadedFeatured[tempIndex].ProductName}
                    />
                ));
            }
            return featuredProducts; // Return the array of JSX elements
        }else{
            return <p className="text-2xl text-gray-500">No Featured Products</p>;
        }
    }

    //Return The Carousel
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
const FeaturedProductCard = ({ item, imageSrc, productName }) => {

  //Import Navigate 
  const navigate = useNavigate();

  //View The Item
  const clickView = () => {
    navigate(`/itemview/${item}`);
  };

  return (
    <div className="w-64 h-96 bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center p-5 transform hover:scale-105">
      {/* Product Image */}
      <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
        <img className="object-cover w-full h-full" src={imageSrc} alt={productName} />
      </div>

      {/* Product Name */}
      <p className="text-xl font-semibold text-gray-800 mt-3">{productName}</p>

      {/* View Button */}
      <button 
        onClick={clickView} 
        className="mt-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300">
        View Item
      </button>
    </div>
  );
};


