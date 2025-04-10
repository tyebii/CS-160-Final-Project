//Import React Functions
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

//Import Axios
import axios from 'axios';

//Import Custom Components
import TextEntryBox from "../ItemEdit/TextBox";
import {useAuth} from "../../Context/AuthHook";

//Import Formatter
import { formatItemView } from "../Formatting/format";

//Add Item
export const ItemAdd = () => {
    //Get the logout function
    const {logout} = useAuth();
    //Get The navigate function
    const navigate = useNavigate();
    //file state variable
    const [file, setFile] = useState(null);

    // State initialization using `item` prop
    const [formData, setFormData] = useState({
        ProductName:'',
        Distributor: '',
        Quantity:  '',
        Expiration: '',
        StorageRequirement: '',
        ItemID:  '', 
        Cost: '',
        Weight: '',
        Category:  '',
        SupplierCost:  '',
        Description:  ''
    });

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        //Fetch The Token
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('No token found');
            logout();
            return;
        }

        //Check the format
        if(!formatItemView(formData,file,false)){
            return false
        }

        //Create a fromData object for image
        const form = new FormData();
        form.append('File', file);
        form.append('Json', JSON.stringify(formData));

        // PUT request with updated form data
        axios.post('http://localhost:3301/api/inventory/insert/item', form, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        //If the request is successful
        .then((response) => {
            alert("Updated Item");
            navigate("/");
        })
        //If the request is bad
        .catch((error) => {
            if (error.response?.status === 401) {
                alert("You need to login again!");
                logout();
            } else {
                alert(`Error Status ${error.response?.status}: ${error.response?.data?.err}`);
            }
        });
        
    };

    //WHen the image is uploaded
    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
        }else{
            alert("Please select a valid file");
        }
    }

    // Function to handle field changes
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

    return (
        <section className="w-[800px] mx-auto bg-gray-200 p-5 mt-12 mb-12 flex flex-col">
            <div className="flex mb-5">
                <div className="border-2 border-gray-300 rounded-lg shadow-sm bg-white p-4 w-[300px] h-[300px] flex items-center justify-center mr-5">
                    <label className="cursor-pointer bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
                        Insert Image
                        <input type="file" required accept="image/*" className="hidden" onChange={(e)=>{handleFile(e)}} />
                    </label>
                </div>


                <div className="flex-1">
                    <span className="mr-2">Product Name: </span>
                    <TextEntryBox
                        value={formData.ProductName}
                        type ="text"
                        required
                        onChange={handleFieldChange('ProductName')}
                        className="text-xl font-bold mb-3"
                        placeholder="Product Name"
                    />
                    <div className="flex mb-3 text-lg">
                        <span className="mr-2">Distributor: </span>
                        <TextEntryBox
                            type="text"
                            required
                            value={formData.Distributor}
                            onChange={handleFieldChange('Distributor')}
                            placeholder="Distributor"
                        />
                    </div>
                    <div className="flex mb-3 text-lg">
                        <span className="mr-2">Availability: </span>
                        <TextEntryBox
                            type="number"
                            required
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
                            required
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
                            required
                            onChange={(e)=>{handleFieldChange('StorageRequirement')(e.target.value)}}
                            className="mt-1 w-48 h-8 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"

                        >
                                <option value="">Select</option>
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
                            required
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
                            min="0"
                            required
                            placeholder="0"
                        />
                    </div>
                    <div className="flex mb-3 text-lg">
                        <span className="mr-2">Weight: </span>
                        <TextEntryBox
                            type="number"
                            min="0"
                            required
                            value={formData?.Weight}
                            onChange={handleFieldChange('Weight')}
                            placeholder="Weight"
                        />
                    </div>
                    <div className="flex mb-3 text-lg">
                        <span className="mr-2">SupplierCost: </span>
                        <TextEntryBox
                            type = "number"
                            min="0"
                            required
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
                type={"text"}
                onChange={handleFieldChange('Description')}
                required
                className="w-full border border-gray-300 p-4 mb-5 text-lg"
                placeholder="Description"
            />

            <div className="flex gap-3">
                <button onClick={handleSubmit} className="bg-blue-600 text-white p-4 font-semibold rounded-lg w-full max-w-[500px] hover:bg-blue-700">Confirm</button>
                <button onClick={() => navigate(`/`)} className="bg-red-600 text-white p-4 font-semibold rounded-lg w-full max-w-[500px] hover:bg-red-700">Cancel</button>
            </div>
        </section>
    );
};

