//Import React Functions
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

//Import Axios
import axios from 'axios';

//Import Format 
import { formatItemView } from '../Formatting/format';

//Import Custom Component  
import TextEntryBox from "./TextBox";

//Import context
import {useAuth} from "../../Context/AuthHook";

//Item Edit Component
export const ItemEdit = ({ item }) => {
    //Logout Function
    const {logout} = useAuth();

    //Navigate Function
    const navigate = useNavigate();

    //File State
    const [file, setFile] = useState(item.ImageLink);

    // State initialization using `item` prop
    const [formData, setFormData] = useState({
        ProductName: item.ProductName,
        Distributor: item.Distributor,
        Quantity: isNaN(Number(item.Quantity)) ? "" : Number(item.Quantity),
        Expiration: item.Expiration?.slice(0,10),
        StorageRequirement: item.StorageRequirement,
        ItemID: item.ItemID, 
        Cost: isNaN(Number(item.Cost)) ? "" : Number(item.Cost),
        Weight: isNaN(Number(item.Weight)) ? "" : Number(item.Weight),
        Category: item.Category,
        SupplierCost: isNaN(Number(item.SupplierCost)) ? "" : Number(item.SupplierCost),
        Description: item.Description
    });
    

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        //Pull The token and check 
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('No token found');
            logout();
            return;
        }

        //Check The Format
        if(!formatItemView(formData,file,true)){
            return; 
        }

        //Need to send the data in FormData object to pass the image 
        const form = new FormData();
        form.append('File', file);
        form.append('Json', JSON.stringify(formData));

        // PUT request with updated form data
        axios.put('http://localhost:3301/api/inventory/update/item', form, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        //Updated Item
        .then((response) => {
            alert("Updated Item");
            navigate("/itemview/" + formData.ItemID);
        })
        //Request Failed
        .catch((error) => {
            if (error.response?.status === 401) {
                alert("You need to login again!");
                logout();
            } else {
                alert(`Error Status ${error.response?.status}: ${error.response?.data?.err}`);
            }
        });
        
    };

    //If the user pushes a file
    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
        }else{
            alert("Please select a valid file");
        }
    }

    const handleFieldChange = (fieldName) => (value) => {
        const numberFields = ['Quantity', 'Cost', 'Weight', 'SupplierCost'];
    
        setFormData(prev => {
            if (numberFields.includes(fieldName)) {
                const parsed = Number(value);
                if (isNaN(parsed)) {
                    alert(`${fieldName} must be a valid number`);
                    return prev; 
                }
                return { ...prev, [fieldName]: parsed };
            } else {
                return { ...prev, [fieldName]: value };
            }
        });
    };
    
    //HTML For Edit 
    return (
        <section className="w-[800px] mx-auto bg-gray-200 p-5 mt-12 mb-12 flex flex-col">
            <h2 className="text-2xl font-semibold text-center mb-4">Update Item</h2>
            <div className="flex mb-5">
                <div className="border-2 border-gray-300 rounded-lg shadow-sm bg-white p-4 w-[300px] h-[300px] flex items-center justify-center mr-5">
                    <label className="cursor-pointer bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
                        Insert Image
                        <input type="file" accept="image/*" className="hidden" onChange={(e)=>{handleFile(e)}} />
                    </label>
                </div>


                <div className="flex-1">
                    <span className="mr-2">Product Name: </span>
                    <TextEntryBox
                        value={formData.ProductName}
                        type ="text"
                        onChange={handleFieldChange('ProductName')}
                        className="text-xl font-bold mb-3"
                        placeholder="Product Name"
                    />
                    <p className="text-xl mb-3">Item ID: {formData.ItemID}</p>
                    <div className="flex mb-3 text-lg">
                        <span className="mr-2">Distributed By: </span>
                        <TextEntryBox
                            type ="text"
                            value={formData?.Distributor}
                            onChange={handleFieldChange('Distributor')}
                            placeholder="Distributor"
                        />
                    </div>
                    <div className="flex mb-3 text-lg">
                        <span className="mr-2">Availability: </span>
                        <TextEntryBox
                            type="number"
                            min="0"
                            value={formData?.Quantity}
                            onChange={handleFieldChange('Quantity')}
                            placeholder="Quantity"
                        />
                    </div>
                    <div className="flex mb-3 text-lg">
                        <span className="mr-2">Expiration: </span>
                        <TextEntryBox
                            type="date"
                            value={formData?.Expiration}
                            onChange={handleFieldChange('Expiration')}
                            placeholder="Expiration"
                        />
                    </div>
                    <div className="flex mb-3 text-lg">
                        <span className="mr-2">Storage Type: </span>
                        <select
                            id="StorageRequirement"
                            value={formData.StorageRequirement}  
                            onChange={(e)=>{handleFieldChange('StorageRequirement')(e.target.value)}}
                            className="mt-1 w-48 h-8 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"

                        >
                                <option value="Frozen">Frozen</option>
                                <option value="Deep Frozen">Deep Frozen</option>
                                <option value="Cryogenic">Cryogenic</option>
                                <option value="Refrigerated">Refrigerated</option>
                                <option value="Cool">Cool</option>
                                <option value="Room Temperature">Room Temperature</option>
                                <option value="Ambient">Ambient</option>
                                <option value="Warm">Warm</option>
                                <option value="Hot">Hot</option>
                                <option value="Dry">Dry</option>
                                <option value="Moist">Moist</option>
                                <option value="Airtight">Airtight</option>
                                <option value="Dark Storage">Dark Storage</option>
                                <option value="UV-Protected">UV-Protected</option>
                                <option value="Flammable">Flammable</option>
                                <option value="Hazardous">Hazardous</option>
                                <option value="Perishable">Perishable</option>
                                <option value="Non-Perishable">Non-Perishable</option>
                        </select>
                    </div>
                    <div className="flex mb-3 text-lg">
                        <span className="mr-2">Category: </span>
                        <select
                            id="StorageRequirement"
                            value={formData.Category}  
                            onChange={(e)=>{handleFieldChange('Category')(e.target.value)}}
                            className="mt-1 w-48 h-8 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"

                        >
                                <option value="">Select</option>
                                <option value="Fresh Food">Fresh Food</option>
                                <option value="Dairy and Eggs">Dairy and Eggs</option>
                                <option value="Meat and Seafood">Meat and Seafood</option>
                                <option value="Bakery and Bread">Bakery and Bread</option>
                                <option value="Pantry Staples">Pantry Staples</option>
                                <option value="Beverages">Beverages</option>
                                <option value="Snacks and Sweets">Snacks and Sweets</option>
                                <option value="Health and Wellness">Health and Wellness</option>
                                <option value="Frozen Foods">Frozen Foods</option>
                        </select>
                    </div>
                    <div className="flex mb-3 text-lg">
                        <span className="mr-2">Cost: </span>
                        <TextEntryBox
                            value={formData?.Cost}
                            onChange={handleFieldChange('Cost')}
                            type="number"
                            step="1"
                            min = "0"
                            placeholder="0"
                        />
                    </div>
                    <div className="flex mb-3 text-lg">
                        <span className="mr-2">Weight: </span>
                        <TextEntryBox
                            type="number"
                            min="0"
                            value={formData?.Weight}
                            onChange={handleFieldChange('Weight')}
                            placeholder="Weight"
                        />
                    </div>
                    <div className="flex mb-3 text-lg">
                        <span className="mr-2">SupplierCost: </span>
                        <TextEntryBox
                            min="0"
                            type = "number"
                            value={formData?.SupplierCost}
                            onChange={handleFieldChange('SupplierCost')}
                            placeholder="Supplier Cost"
                        />
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-3">Description</h2>
            <TextEntryBox
                value={formData?.Description}
                onChange={handleFieldChange('Description')}
                className="w-full border border-gray-300 p-4 mb-5 text-lg"
                placeholder="Description"
            />

            <div className="flex gap-3">
                <button onClick={handleSubmit} className="bg-blue-600 text-white p-4 font-semibold rounded-lg w-full max-w-[500px] hover:bg-blue-700">Confirm</button>
                <button onClick={() => navigate(`/itemview/${formData.ItemID}`)} className="bg-red-600 text-white p-4 font-semibold rounded-lg w-full max-w-[500px] hover:bg-red-700">Cancel</button>
            </div>
        </section>
    );
};

export default ItemEdit;
