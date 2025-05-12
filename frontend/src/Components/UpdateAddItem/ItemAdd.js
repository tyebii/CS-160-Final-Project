import { useNavigate } from 'react-router-dom';

import { useState } from 'react';

import axios from 'axios';

import TextEntryBox from "./TextBox";

import { insertFormat } from '../Utils/Formatting'

import { useErrorResponse } from '../Utils/AxiosError';

//Add Inventory Item 
export const ItemAdd = () => {

    const [imageURL, setURL] = useState(null);

    const navigate = useNavigate();

    const { handleError } = useErrorResponse();

    const [file, setFile] = useState(null);

    const [formData, setFormData] = useState({

        ProductName: '',

        Distributor: '',

        Quantity: '',

        Expiration: '',

        StorageRequirement: '',

        ItemID: '',

        Cost: '',

        Weight: '',

        Category: '',

        SupplierCost: '',

        Description: ''

    });

    //Handle Form Submission
    const handleSubmit = async (e) => {

        e.preventDefault();

        if (
            !insertFormat(
                formData.Quantity,
                formData.Distributor,
                formData.Weight,
                formData.ProductName,
                formData.Category,
                formData.SupplierCost,
                formData.Cost,
                formData.Expiration,
                formData.StorageRequirement,
                formData.Description
            )
        ) {

            return false;

        }

        if (file == null) {

            alert("Please select image.");

            return false;

        }

        const form = new FormData();

        form.append('File', file);

        form.append('Json', JSON.stringify(formData));

        try {

            await axios.post('http://localhost:3301/api/inventory/insert/item', form, {
                withCredentials: true,
            });

            navigate("/");

        } catch (error) {

            handleError(error);

        }

    };

    //Handle File Import
    const handleFile = (e) => {

        const file = e.target.files[0];

        if (file) {

            if (file.size <= 1e7) {

                if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp') {

                    setFile(file);

                    setURL(URL.createObjectURL(file));

                } else {

                    alert("Please select a valid file type (jpeg, png, webp).");

                    e.target.value = '';

                }

            } else {

                alert("File size is too large (10MB limit).");

            }

        } else {

            alert("Please select a valid file.");

        }

    };

    //Handle Form Changes
    const handleFieldChange = (fieldName) => (value) => {

        const numberFields = ['Quantity', 'Cost', 'Weight', 'SupplierCost'];

        setFormData(prev => {

            if (numberFields.includes(fieldName)) {

                const parsed = Number(value);

                if (isNaN(parsed)) {

                    alert(`${fieldName} Must Be A Valid Number`);

                    return prev;

                }

                return { ...prev, [fieldName]: parsed };

            } else {

                return { ...prev, [fieldName]: value };

            }

        });

    };

    return (

        <section className="w-full bg-white p-8 flex flex-col gap-8 flex-grow">

            <div className="mx-auto bg-gray-100 border border-gray-200 rounded-lg shadow-lg p-5 mt-12 mb-12 flex flex-col">

                <h2 className="text-center text-2xl font-semibold mb-4">Add Item</h2>

                <form onSubmit={handleSubmit}>

                    <div className="flex flex-col md:flex-row mb-5 gap-4">

                        <div className="flex flex-col gap-2 items-center">

                            <div className="flex-col border border-gray-300 rounded-lg shadow-sm bg-white p-4 w-[300px] h-[300px] flex items-center justify-center mr-5">

                                <img alt=" no image" src={imageURL} ></img>

                            </div>

                            <label className="mx-auto cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">

                                Insert Image

                                <input type="file" accept="image/jpeg, image/png, image/webp, image/jpg" className="hidden" onChange={(e) => { handleFile(e) }} />

                            </label>

                        </div>

                        <div className="flex-1">

                            <div className="flex items-center mb-3 text-lg">

                                <span className="mr-2">Product Name: </span>

                                <TextEntryBox

                                    value={formData.ProductName}

                                    type="text"

                                    minLength={2}

                                    maxLength={255}

                                    onChange={handleFieldChange('ProductName')}

                                    placeholder="Product Name"

                                />

                            </div>

                            <div className="flex mb-3 text-lg">

                                <span className="mr-2">Distributor: </span>

                                <TextEntryBox

                                    type="text"

                                    minLength={2}

                                    maxLength={255}

                                    value={formData.Distributor}

                                    onChange={handleFieldChange('Distributor')}

                                    placeholder="Distributor"

                                />

                            </div>

                            <div className="flex mb-3 text-lg">

                                <span className="mr-2">Availability: </span>

                                <TextEntryBox

                                    type="number"

                                    min="0"

                                    value={formData.Quantity}

                                    onChange={handleFieldChange('Quantity')}

                                    placeholder="Quantity"

                                />

                            </div>

                            <div className="flex mb-3 text-lg">

                                <span className="mr-2">Expiration: </span>

                                <TextEntryBox

                                    type="date"

                                    value={formData.Expiration}

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

                                    onChange={(e) => { handleFieldChange('StorageRequirement')(e.target.value) }}

                                    className="w-48 h-8 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"

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

                                    onChange={(e) => { handleFieldChange('Category')(e.target.value) }}

                                    className="w-48 h-8 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"

                                >

                                    <option value="">Select</option>

                                    <option value="Fresh Produce">Fresh Produce</option>

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

                                    step="any"

                                    min="0"

                                    placeholder="Cost In USD"

                                />

                            </div>

                            <div className="flex mb-3 text-lg">

                                <span className="mr-2">Weight: </span>

                                <TextEntryBox

                                    type="number"

                                    step="any"

                                    min="0"

                                    value={formData?.Weight}

                                    onChange={handleFieldChange('Weight')}

                                    placeholder="Weight In LBS"

                                />

                            </div>

                            <div className="flex mb-3 text-lg">

                                <span className="mr-2">Supplier Cost: </span>

                                <TextEntryBox

                                    type="number"

                                    step="any"

                                    min="0"

                                    value={formData?.SupplierCost}

                                    onChange={handleFieldChange('SupplierCost')}

                                    placeholder="Supplier Cost In USD"

                                />

                            </div>

                        </div>

                    </div>

                    <h2 className="text-2xl font-bold mb-3">Description</h2>

                    <TextEntryBox

                        value={formData?.Description}

                        type={"text"}

                        minLength={2}

                        maxLength={255}

                        onChange={handleFieldChange('Description')}

                        className="w-full border border-gray-300 p-4 mb-5 text-lg rounded-lg"

                        placeholder="Description"

                    />

                    <div className="flex gap-3">

                        <button onClick={() => navigate(`/`)} className="bg-red-600 text-white p-4 font-semibold rounded-lg w-full max-w-[500px] hover:bg-red-700">Cancel</button>

                        <button type="submit" className="bg-green-500 text-white p-4 font-semibold rounded-lg w-full max-w-[500px] hover:bg-green-600">Confirm</button>

                    </div>

                </form>

            </div>
        </section>

    );

};

