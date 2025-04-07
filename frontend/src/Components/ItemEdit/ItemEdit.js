import React from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import TextEntryBox from '../TextEntryBox';
import '../ItemView/itemView.css';
import ErrorBoundary from "../../../Components/ErrorBoundary";
import carrot from "../../../Components/Welcome/Images/carrot.png";

const ItemEdit = () => {
    const { itemid } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        imageUrl: carrot,
        ProductName: '',
        Distributor: '',
        Quantity: '',
        Expiration: '',
        StorageRequirment: '',
        Cost: '',
        Weight: '',
        Description: ''
    });

    useEffect(() => {
        axios.get(`http://localhost:3301/api/inventory/${itemid}`)
            .then((response) => {
                console.log(response.data);  
                setFormData(response.data[0] || response.data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, [itemid]);

    const handleFieldChange = (fieldName) => (value) => {
        setFormData(prev => ({ ...prev, [fieldName]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3301/api/inventory/${itemid}`, formData);
            navigate(`/manageritemview/${itemid}`);
        } catch (error) {
            console.error("Failed to save:", error);
            alert("Error saving changes!");
        }
    };

    return (
        <ErrorBoundary>
            <div className="item-product-container">
                <div className="item-product-top">
                    <div className="item-product-image-container">
                        <img alt={formData?.ProductName || 'Image'} className="item-product-image" src={formData?.imageUrl || carrot}/>
                    </div>
                    <div className="item-product-info">
                        <TextEntryBox
                            value={formData.ProductName}
                            onChange={handleFieldChange('ProductName')}
                            className="item-product-name-edit"
                            placeholder="Product Name"
                        />
                        <div className="item-product-detail">
                            <span>Distributed By: </span>
                            <TextEntryBox
                                value={formData?.Distributor || 'Distributor'}
                                onChange={handleFieldChange('Distributor')}
                                placeholder="Distributor"
                            />
                        </div>
                        <div className="item-product-detail">
                            <span>Availability: </span>
                            <TextEntryBox
                                value={formData?.Quantity || 'Quantity'}
                                onChange={handleFieldChange('Quantity')}
                                placeholder="Quantity"
                            />
                        </div>
                        <div className="item-product-detail">
                            <span>Expiration: </span>
                            <TextEntryBox
                                value={formData?.Expiration || 'Expiration'}
                                onChange={handleFieldChange('Expiration')}
                                placeholder="Expiration"
                            />
                        </div>
                        <div className="item-product-detail">
                            <span>Storage Type: </span>
                            <TextEntryBox
                                value={formData?.StorageRequirment || 'Storage'}
                                onChange={handleFieldChange('StorageRequirement')}
                                placeholder="StorageRequirement"
                            />
                        </div>
                        <p className="item-product-ID">Item ID: {itemid}</p>
                        <div className="item-product-detail">
                            <span>Cost: </span>
                            <TextEntryBox
                                value={formData?.Cost || "0"}
                                onChange={handleFieldChange('Cost')}
                                type="number"
                                step="0.01"
                                placeholder="0"
                            />
                        </div>
                        <div className="item-product-detail">
                            <span>Weight: </span>
                            <TextEntryBox
                                value={formData?.Weight || 'Weight'}
                                onChange={handleFieldChange('Weight')}
                                placeholder="Weight"
                            />
                        </div>
                    </div>
                </div>

                <h2 className="item-product-description-title">Description</h2>
                <TextEntryBox
                    value={formData?.Description || 'N/A'}
                    onChange={handleFieldChange('Description')}
                    className="item-product-description-edit"
                    placeholder="Quantity"
                />

                <div className="buttons">
                    <button onClick={handleSubmit} className="confirm-edit">Confirm</button>
                    <button onClick={() => navigate(`/item/${itemid}`)} className="cancel-edit">Cancel</button>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default ItemEdit;