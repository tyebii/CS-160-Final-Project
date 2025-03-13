import React from "react";
//import FeaturedProductCard from "./Components-WelcomePage/FeaturedProductCard";
//import Category from "./Components-WelcomePage/Category";
import ItemView from "./Components-ItemView/ItemView";
import carrot from "./Components-WelcomePage/carrot.png"

// This is for Welcome Page
/** 
const App = () => {
  const featuredProducts = [
    { imageSrc: carrot, name: "Carrot1" },
    { imageSrc: carrot, name: "Carrot2" },
    { imageSrc: carrot, name: "Carrot3" },
  ];

  const categories = [
    { imageSrc: carrot, name: "Fresh Produce" },
    { imageSrc: carrot, name: "Dairy and Eggs" },
    { imageSrc: carrot, name: "Meat and Seafood" },
    { imageSrc: carrot, name: "Frozen Foods" },
    { imageSrc: carrot, name: "Bakery and Bread" },
    { imageSrc: carrot, name: "Pantry Staples" },
    { imageSrc: carrot, name: "Beverages" },
    { imageSrc: carrot, name: "Snacks and Sweets" },
    { imageSrc: carrot, name: "Health and Wellness" },
  ];

  return (
    <div className="container">
      <div className="welcome">
        <h1>Welcome to OFS!</h1>
      </div>

      <div className="featured-products">
        <h2 className="section-title">Featured Products</h2>
        <div className="products-slider">
          <button className="arrow">←</button>
          {featuredProducts.map((product, index) => (
            <FeaturedProductCard
              key={index}
              imageSrc={product.imageSrc}
              productName={product.name}
            />
          ))}
          <button className="arrow">→</button>
        </div>
      </div>

      <div className="categories">
        <h2 className="section-title">Browse Categories</h2>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <Category
              key={index}
              imageSrc={category.imageSrc}
              categoryName={category.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
**/

// This is for Item View
const App = () => {
  // Example Carrot Item
  const carrotItem = {
    imageSrc: carrot,
    itemName: 'Mike\'s Organic Carrots',
    distributor: 'Mike\'s Farm',
    availability: 'In Stock',
    expiration: '3/20/2025',
    storageType: 'Dry',
    cost: '$4.99',
    weight: '2 LBS',
    description: 'These fresh organic carrots are also rich in vitamin A and are great to eat raw or cooked!',
  };

  return (
    <div>
      <ItemView {...carrotItem} />
    </div>
  );
};

export default App;