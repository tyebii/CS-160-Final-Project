import React from 'react';
import './itemView.css';

const ItemView = ({ imageSrc, itemName, distributor, availability, expiration, storageType, cost, weight, description }) => {
  //console.log({ imageSrc, itemName, distributor, availability, expiration, storageType, cost, weight, description });

  return (
    <div className="product-container">
      <div className="product-top">
        <div className="product-image-container">
          <img src={imageSrc} alt={itemName} className="product-image" />
        </div>
        <div className="product-info">
          <h1 className="product-name">{itemName}</h1>
          <p className="product-detail">Distributed By: {distributor}</p>
          <p className="product-detail">Availability: {availability}</p>
          <p className="product-detail">Expiration: {expiration}</p>
          <p className="product-detail">Storage Type: {storageType}</p>
          <p className="product-cost">Cost: {cost}</p>
          <p className="product-weight">Weight: {weight}</p>
        </div>
      </div>

      <h2 className="product-description-title">Description</h2>
      <p className="product-description">{description}</p>

      <button className="add-to-cart">Add to Cart</button>
    </div>
  );
};

export default ItemView;