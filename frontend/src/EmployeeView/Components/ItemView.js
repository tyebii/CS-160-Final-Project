import React from 'react';
import './itemView.css';
import {useState} from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Flag from '../Images/red-flag.png';

const ItemView = () => {
    const [showFlagInput, setShowFlagInput] = useState(false);
    const [flagMessage, setFlagMessage] = useState('');

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
            <div className="item-product-flag">
                <div className="item-product-header">
                    <h1 className="item-product-name">{results.ProductName}</h1>
                    <img
                        src={Flag}
                        alt="Flag"
                        className="flag-icon"
                        onClick={() => setShowFlagInput(!showFlagInput)}
                    />
                </div>
                {showFlagInput && (
                    <div className="flag-input-box">
                        <textarea
                            placeholder="Describe the issue"
                            value={flagMessage}
                            onChange={(e) => setFlagMessage(e.target.value)}
                        />
                        <button onClick={() => {
                            {/* Currently this sends the msg to the console instead of manager inbox */}
                            console.log(`Flagged Item ${itemid}: ${flagMessage}`);
                            setShowFlagInput(false);
                            setFlagMessage('');
                        }}>
                            Submit
                        </button>
                    </div>
                )}
            </div>
            
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
    </div>
  );
};

export default ItemView;