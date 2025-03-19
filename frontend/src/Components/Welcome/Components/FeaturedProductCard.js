import React from "react";
import './FeaturedProductCard.css';
const FeaturedProductCard = ({ imageSrc, productName }) => {
  return (
    <div className="product-card">
      <img className="product-card-img" src={imageSrc} alt={productName} />
      <p className="product-name">{productName}</p>
      <button className="add-to-cart">View Item</button>
    </div>
  );
};

export default FeaturedProductCard;