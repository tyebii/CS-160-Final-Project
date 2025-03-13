import './Welcome.css';
import Carrot from './Images/carrot.png';
import {Link } from "react-router-dom";
import FeaturedProductCard from './Components/FeaturedProductCard';
import CategoryCard from './Components/Category';
function Welcome(){
    return (
        <div class="container">
            <div class="welcome">
                <h1>Welcome to OFS!</h1>
            </div>
            
            <div class="featured-products">
                <h2 class="section-title">Featured Products</h2>
                <div class="products-slider">
                    <button class="arrow">←</button>
                        <FeaturedProductCard imageSrc={Carrot} productName="Carrots" />
                        <FeaturedProductCard imageSrc={Carrot} productName="Carrots" />
                        <FeaturedProductCard imageSrc={Carrot} productName="Carrots" />
                    <button class="arrow">→</button>
                </div>
            </div>
            
            <div class="categories">
                <h2 class="section-title">Browse Categories</h2>
                <div class="categories-grid">
                    <Link to = "/search/category/fresh-produce">
                        <CategoryCard imageSrc={Carrot} categoryName="Fresh Produce" />
                    </Link>
                    <Link to = "/search/category/dairy-and-eggs">
                        <CategoryCard imageSrc={Carrot} categoryName="Dairy and Eggs" />
                    </Link>
                    <Link to = "/search/category/meat-and-seafood">
                        <CategoryCard imageSrc={Carrot} categoryName="Meat and Seafood" />
                    </Link>
                    <Link to = "/search/category/bakery-and-bread">
                        <CategoryCard imageSrc={Carrot} categoryName="Bakery and Bread" />
                    </Link>
                    <Link to = "/search/category/pantry-staples">
                        <CategoryCard imageSrc={Carrot} categoryName="Pantry Staples" />
                    </Link>
                    <Link to = "/search/category/beverages">
                        <CategoryCard imageSrc={Carrot} categoryName="Beverages" />
                    </Link>
                    <Link to = "/search/category/snacks-and-sweets">
                        <CategoryCard imageSrc={Carrot} categoryName="Snacks and Sweets" />
                    </Link>
                    <Link to = "/search/category/health-and-wellness">
                        <CategoryCard imageSrc={Carrot} categoryName="Health and Wellness" />
                    </Link>
                </div>
            </div>
            <hr/>
        </div>
    );
}
export default Welcome;