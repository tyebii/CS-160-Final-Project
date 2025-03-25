import './Welcome.css';
import Carrot from './Images/carrot.png';
import bakeryAndBreadImage from '../../CategoryImages/bakeryandbread.jpg';
import beverages from '../../CategoryImages/beverages.jpg';
import dairyAndEggs from '../../CategoryImages/dairyeggs.webp';
import freshProduce from '../../CategoryImages/freshproduce.webp'
import frozenFoods from '../../CategoryImages/frozenfoods.jpg'
import healthAndWellness from '../../CategoryImages/healthandwellness.jpg'
import meatAndSeafood from '../../CategoryImages/meatseafood.webp'
import pantryStaples from '../../CategoryImages/pantrystaples.jpg'
import snacksAndSweets from '../../CategoryImages/snacksandsweets.jpg'

import { useState } from 'react';

import {Link } from "react-router-dom";
import FeaturedProductCard from './Components/FeaturedProductCard';
import CategoryCard from './Components/Category';
function Welcome(){
    const [index, changeIndex] = useState(0)

    const loadedFeatured = [
        {imageSrc:Carrot, productName:"Carrots"},
        {imageSrc:Carrot, productName:"Carrots"},
        {imageSrc:Carrot, productName:"Carrots"},
        {imageSrc:Carrot, productName:"Carrots"}
    ]

    const handleLeftClick = (e) => {
        changeIndex(index+1 % loadedFeatured.length)
    }

    const handleRightClick = (e) => {
        if(index - 1 == -1){
            changeIndex(loadedFeatured.length-1)
            return
        }
        changeIndex(index-1 % loadedFeatured.length)
        
    }

    return (
        <div class="container">
            <div class="welcome">
                <h1>Welcome to OFS!</h1>
            </div>
            
            <div class="featured-products">
                <h2 class="section-title">Featured Products</h2>
                <div class="products-slider">
                    <button class="arrow" onClick = {handleLeftClick}>←</button>
                    {
                        [...Array(3)].map((_, iter) => {
                            const tempIndex = (index + iter) % loadedFeatured.length;
                            return (
                                <FeaturedProductCard
                                    key={tempIndex}
                                    imageSrc={loadedFeatured[tempIndex].imageSrc}
                                    productName={loadedFeatured[tempIndex].productName}
                                />
                            );
                        })
                    
                        }
                    <button class="arrow" onClick = {handleRightClick}>→</button>
                </div>
            </div>
            
            <div class="categories">
                <h2 class="section-title">Browse Categories</h2>
                <div class="categories-grid">
                    <Link to = "/search/category/fresh-produce">
                        <CategoryCard imageSrc={freshProduce} categoryName="Fresh Produce" />
                    </Link>
                    <Link to = "/search/category/dairy-and-eggs">
                        <CategoryCard imageSrc={dairyAndEggs} categoryName="Dairy and Eggs" />
                    </Link>
                    <Link to = "/search/category/meat-and-seafood">
                        <CategoryCard imageSrc={meatAndSeafood} categoryName="Meat and Seafood" />
                    </Link>
                    <Link to = "/search/category/bakery-and-bread">
                        <CategoryCard imageSrc={bakeryAndBreadImage} categoryName="Bakery and Bread" />
                    </Link>
                    <Link to = "/search/category/pantry-staples">
                        <CategoryCard imageSrc={pantryStaples} categoryName="Pantry Staples" />
                    </Link>
                    <Link to = "/search/category/beverages">
                        <CategoryCard imageSrc={beverages} categoryName="Beverages" />
                    </Link>
                    <Link to = "/search/category/snacks-and-sweets">
                        <CategoryCard imageSrc={snacksAndSweets} categoryName="Snacks and Sweets" />
                    </Link>
                    <Link to = "/search/category/health-and-wellness">
                        <CategoryCard imageSrc={healthAndWellness} categoryName="Health and Wellness" />
                    </Link>
                    <Link to = "/search/category/health-and-wellness">
                        <CategoryCard imageSrc={frozenFoods} categoryName="Frozen Foods" />
                    </Link>
                </div>
            </div>
            <hr/>
        </div>
    );
}
export default Welcome;