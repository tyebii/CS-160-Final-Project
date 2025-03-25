import React from 'react';
import './itemView.css';
import {useState} from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
const ItemView = () => {
  const {itemid} = useParams();
  const [results, setResults] = useState({});
  useEffect(() => {
    axios.get(`http://localhost:3301/searchItem/${itemid}`)
      .then((response) => {
        setResults(response.data[0]);
      })
      .catch((error) => {
        console.error("Error:", error);  
      });
      
  },[itemid]);
  
  return (

    <div className="item-product-container">
      <div className="item-product-top">
        <div className="item-product-image-container">
          <img  alt={results.ProductName} className="item-product-image" />
        </div>
        <div className="item-product-info">
          <h1 className="item-product-name">{results.ProductName}</h1>
          <p className="item-product-detail">Distributed By: {results.Distributor}</p>
          <p className="item-product-detail">Availability: {results.Quantity}</p>
          <p className="item-product-detail">Expiration: {results.Expiration}</p>
          <p className="item-product-detail">Storage Type: {results.StorageRequirment}</p>
          <p className="item-product-ID">Item ID: {itemid}</p>
          <p className="item-product-cost">Cost: {results.Cost}</p>
          <p className="item-product-weight">Weight: {results.Weight}</p>
        </div>
      </div>

      <h2 className="item-product-description-title">Description</h2>
      <p className="item-product-description">{results.Description}</p>

      <div className="buttons">
        <button className="edit-item">Edit</button>
        <button className="delete-item">Delete</button>
      </div>
    </div>
  );
};

export default ItemView;