//Category Images

import bakeryAndBreadImage from './CategoryImages/bakeryandbread.jpg';
import beverages from './CategoryImages/beverages.jpg';
import dairyAndEggs from './CategoryImages/dairyeggs.webp';
import freshProduce from './CategoryImages/freshproduce.webp';
import frozenFoods from './CategoryImages/frozenfoods.jpg';
import healthAndWellness from './CategoryImages/healthandwellness.jpg';
import meatAndSeafood from './CategoryImages/meatseafood.webp';
import pantryStaples from './CategoryImages/pantrystaples.jpg';
import snacksAndSweets from './CategoryImages/snacksandsweets.jpg';

//React Functions
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import FeaturedProductCard from './Components/FeaturedProductCard';
import CategoryCard from './Components/Category';

//Import axios
import axios from 'axios';

//Welcome Page Component
function Welcome() {
    //loaded features
    const [loadedFeatured, setFeatured] = useState([])

    useEffect(() => {
        axios.get("http://localhost:3301/api/featured")
            .then((results) => {
                setFeatured(results.data);
            })
            .catch((error) => {
                if (error.response?.data?.error) {
                    alert(`Error Status ${error.status}: ${error.response.data.error}`);
                } else {
                    alert("Backend Down");
                }
            });
    }, []);
    



    //Carousel Index
    const [index, changeIndex] = useState(0);

    //Sample Featured Items

    //Carousel Left Click
    const handleLeftClick = () => {
        changeIndex((index + 1) % loadedFeatured.length);
    };

    //Carousel Right Click
    const handleRightClick = () => {
        if(index - 1 === -1){
            changeIndex(loadedFeatured.length - 1);
            return;
        }
        changeIndex((index - 1) % loadedFeatured.length);
    };

    return (
        <div className="max-w-screen-xl mx-auto px-5">

            <h1 className="text-4xl font-bold text-center mb-8">Welcome to OFS!</h1>
            

            {/*Carousel*/}
            <section className="text-center mb-10">
                <h2 className="text-2xl mb-4">Featured Products</h2>
                <div className="flex items-center justify-center gap-4 overflow-x-auto p-3">
                    <button className="text-2xl bg-blue-500 text-white rounded-full p-3 hover:bg-blue-700" onClick={handleLeftClick}>←</button>
                    {
                        loadedFeatured.length > 0 ? (
                            [...Array(3)].map((_, iter) => {
                                const tempIndex = (index + iter) % loadedFeatured.length;
                                return (
                                    <FeaturedProductCard
                                        key={loadedFeatured[tempIndex].ItemID}
                                        item = {loadedFeatured[tempIndex].ItemID}
                                        imageSrc={loadedFeatured[tempIndex].ImageLink}
                                        productName={loadedFeatured[tempIndex].ProductName}
                                    />
                                );
                            })
                        ) : (
                            <p>Loading featured products...</p>
                        )
                    }
                    <button className="text-2xl bg-blue-500 text-white rounded-full p-3 hover:bg-blue-700" onClick={handleRightClick}>→</button>
                </div>
            </section>

            <section className="mt-10">
                <h2 className="text-2xl mb-6 text-center">Browse Categories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-3 justify-center">
                    <Link to="/search/category/Fresh-Produce">
                        <CategoryCard imageSrc={freshProduce} categoryName="Fresh Produce" />
                    </Link>
                    <Link to="/search/category/Dairy-and-Eggs">
                        <CategoryCard imageSrc={dairyAndEggs} categoryName="Dairy and Eggs" />
                    </Link>
                    <Link to="/search/category/Meat-and-Seafood">
                        <CategoryCard imageSrc={meatAndSeafood} categoryName="Meat and Seafood" />
                    </Link>
                    <Link to="/search/category/Bakery-and-Bread">
                        <CategoryCard imageSrc={bakeryAndBreadImage} categoryName="Bakery and Bread" />
                    </Link>
                    <Link to="/search/category/Pantry-Staples">
                        <CategoryCard imageSrc={pantryStaples} categoryName="Pantry Staples" />
                    </Link>
                    <Link to="/search/category/Beverages">
                        <CategoryCard imageSrc={beverages} categoryName="Beverages" />
                    </Link>
                    <Link to="/search/category/Snacks-and-Sweets">
                        <CategoryCard imageSrc={snacksAndSweets} categoryName="Snacks and Sweets" />
                    </Link>
                    <Link to="/search/category/Health-and-Wellness">
                        <CategoryCard imageSrc={healthAndWellness} categoryName="Health and Wellness" />
                    </Link>
                    <Link to="/search/category/Frozen-Foods">
                        <CategoryCard imageSrc={frozenFoods} categoryName="Frozen Foods" />
                    </Link>
                </div>
            </section>
            <hr className="border-t border-gray-300 my-10" />
        </div>
    );
}

export default Welcome;
