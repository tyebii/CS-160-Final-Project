import React from "react";

const FeaturedProductCard = ({ imageSrc, productName }) => {
  return (
    <div className="product-card">
      <img src={imageSrc} alt={productName} />
      <p className="product-name">{productName}</p>
      <button className="add-to-cart">Add to Cart</button>
    </div>
  );
};

export default FeaturedProductCard;