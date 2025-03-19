import './Welcome.css';
import Carrot from './Images/carrot.png';
import {Link } from "react-router-dom";
import FeaturedProductCard from './Components/FeaturedProductCard';
import CategoryCard from './Components/Category';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

function Welcome(){
    const responsive = {
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 3
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1
        }
    };

    return (
        <div className="container">
            <div className="welcome">
                <h1>Welcome to OFS!</h1>
            </div>
            
            <div className="featured-products">
                <h2 className="section-title">Featured Products</h2>
                    <Carousel renderButtonGroupOutside={true} partialVisible={false} responsive={responsive} ssr={true} draggable={false} showDots={true} infinite={true} autoPlay={false} dotListClass="carousel-dots" itemClass="carousel-item-padding-40-px" containerClass="carousel-container">
                        <FeaturedProductCard imageSrc={Carrot} productName="Carrots1" />
                        <FeaturedProductCard imageSrc={Carrot} productName="Carrots2" />
                        <FeaturedProductCard imageSrc={Carrot} productName="Carrots3" />
                        <FeaturedProductCard imageSrc={Carrot} productName="Carrots4" />
                        <FeaturedProductCard imageSrc={Carrot} productName="Carrots5" />
                        <FeaturedProductCard imageSrc={Carrot} productName="Carrots6" />
                    </Carousel>
            </div>
            
            <div className="welcome-categories">
                <h2 className="section-title">Browse Categories</h2>
                <div className="welcome-categories-grid">
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
                    <Link to = "/search/category/health-and-wellness">
                        <CategoryCard imageSrc={Carrot} categoryName="Frozen Foods" />
                    </Link>
                </div>
            </div>
            <hr/>
        </div>
    );
}
export default Welcome;