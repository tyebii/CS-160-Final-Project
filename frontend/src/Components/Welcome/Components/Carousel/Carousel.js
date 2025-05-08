import { useNavigate } from "react-router-dom";

import { useState, useEffect } from 'react';

import axios from "axios";

import { useErrorResponse } from '../../../Utils/AxiosError';

//Carousel Component
export default function Carousel({ auth }) {

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

        if (window.innerWidth >= 1280) {
            changeIndex((index + 1) % loadedFeatured.length);
        } else {
            changeIndex((index + 1) % loadedFeatured.length);
        }


    };

    //Carousel Left Click
    var handleRightClick = () => {

        if (index - 1 === -1) {

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

            for (let i = 0; i < Math.min(5, loadedFeatured.length); i++) {

                tempIndex = (index + i) % loadedFeatured.length;

                featuredProducts.push((

                    <FeaturedProductCard

                        key={loadedFeatured[tempIndex].ItemID}

                        item={loadedFeatured[tempIndex].ItemID}

                        cost={loadedFeatured[tempIndex].Cost}

                        distributor={loadedFeatured[tempIndex].Distributor}

                        imageSrc={loadedFeatured[tempIndex].ImageLink}

                        productName={loadedFeatured[tempIndex].ProductName}

                    />

                ));

            }

            return featuredProducts;

        } else {

            return <p className="text-2xl text-gray-800">No Featured Products</p>;

        }

    }

    return (

        (auth === null || auth === "Customer") ? (

            <article className="text-center p-16">

                <h2 className="text-center text-5xl font-semibold text-black tracking-wide">Featured Products</h2>

                <div className="flex items-center overflow-hidden relative">

                    <button

                        className="z-10 text-2xl bg-green-800 text-white rounded-full p-3 hover:bg-green-600"

                        onClick={handleRightClick}

                    >

                        ←

                    </button>

                    <div className="w-11/12 flex mx-auto items-center justify-center overflow-hidden gap-6 px-4 pt-8 pb-10
                     [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">

                        {/* Render carousel items */}

                        {loadCarousel()}

                    </div>


                    <button

                        className="z-10 text-2xl bg-green-800 text-white rounded-full p-3 hover:bg-green-600"

                        onClick={handleLeftClick}

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

  const navigate = useNavigate();

  const clickView = () => {

        navigate(`/itemview/${item}`);

    };

    return (
        <button onClick={clickView} className="w-64 h-[26rem] bg-white border border-gray-200 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between items-center p-5 transform hover:scale-[1.06] hover:-translate-y-1 hover:border-green-600 group">

            {/* Product Image */}
            <div className="w-48 h-48 flex items-center justify-center bg-gradient-to-br from-pink-100 via-yellow-100 to-blue-100 rounded-xl overflow-hidden shadow-inner group-hover:shadow-xl transition duration-300">

                <img

                    className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-300"

                    src={imageSrc}

                    alt={productName}
                />

            </div>

            {/* Product Name */}
            <p className="text-3xl font-semibold text-green-950 mt-2 text-center group-hover:text-green-600 transition-colors duration-300 tracking-wide">

                {productName}

            </p>

            {/* Fancy Labels */}
            <div className="flex flex-col items-center gap-1">

                <span className="px-3 pb-1 text-sm">

                    {distributor}

                </span>

                <span className="px-3 pb-1 w-1/2 text-2xl font-semibold">

                    ${cost.toFixed(2)}

                </span>



            </div>

            {/* View Button */}
            <button

                onClick={clickView}

                className=" bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"

            >

                🛒 View Item

            </button>

        </button>



    );


};


