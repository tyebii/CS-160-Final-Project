import {useState} from 'react';
import {AddressModal} from './Modal/AddressModal';
import {PaymentModal} from './Modal/PaymentModal';

import AddressComponent from './AddressComponent';
import PaymentComponent from './PaymentComponent';

function CheckoutPage() {

    const [paymentModalOpen, setPaymentModalOpen] = useState(false);

    const [addressModalOpen, setAddressModalOpen] = useState(false);

    const handleAddressClick = () => {
        setAddressModalOpen(false);
    };

    const handlePaymentClick = () => {
        setPaymentModalOpen(false);
    };

    return(
        <div class="relative overflow-hidden"> 
            <div class="relative container px-4 mx-auto"> 
                <div class="flex justify-center m-8">
                    <h2 class="flex justify-center text-5xl font-bold text-gray-900">Secure Checkout</h2>
                </div>
            </div>
            
            <div class="relative container px-4 mx-auto">
                <div class="flex flex-wrap justify-flex-center">
                    <div class="flex flex-col pb-8 bg-gray w-1/2">
                        <div class="p-4 mb-12 border-2 border-black-900 border-solid">
                        <h2 class="sm:text-lg md:text-3xl font-medium">Delivery Address</h2>
                            <div class="flex flex-col mt-4 bg-gray rounded-md">
                                <AddressComponent></AddressComponent>
                                <AddressComponent></AddressComponent>
                                <div class="flex-start pt-6 pb-4 ">
                                    <button class="text-blue-600" onClick={() => setAddressModalOpen(true)}>Add an Address</button>
                                    {addressModalOpen && (
                                        <AddressModal onSubmit={handleAddressClick} onCancel={handleAddressClick} onClose={handleAddressClick}>
                                            <div className="flex flex-row mx-4 mb-4">
                                                    <input type="text" id="address" className="w-2/3 mx-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" placeholder="Address" required />
                                                    <input type="text" id="apt" className="w-1/3 mx-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" placeholder="Apt, Suite, etc." required />
                                            </div> 
                                            <div className="flex flex-row mx-4">
                                                <input type="text" id="city" className="mx-1 w-1/3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" placeholder="City" required />
                                                <input type="text" id="state" className="mx-1 w-1/3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" placeholder="State" required />
                                                <input type="text" id="zip" className="mx-1 w-1/3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" placeholder="ZIP" required />
                                            </div>
                                        </AddressModal>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div class="p-4 mb-12 border-2 border-black-900 border-solid">
                        <h2 class="sm:text-lg md:text-3xl font-medium">Payment Method</h2>
                            <div class="flex flex-col mt-4 bg-gray">
                                <PaymentComponent></PaymentComponent>
                                <div class="flex-start pt-6 pb-4">
                                    <button className="text-blue-600" onClick={() => setPaymentModalOpen(true)}>Add a Payment Method</button>
                                    {paymentModalOpen && (
                                        <PaymentModal onSubmit={handlePaymentClick} onCancel={handlePaymentClick} onClose={handlePaymentClick}>
                                            <div className="flex flex-col mx-4 mb-4">
                                                    <input type="text" id="card_number" className="w-full mx-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" placeholder="Credit Card Number" required />
                                            </div> 
                                            <div className="flex flex-row mx-4">
                                                <input type="text" id="expiry" className="mx-1 w-3/5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" placeholder="Expiration MM/YY" required />
                                                <input type="text" id="cvn" className="mx-1 w-2/5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" placeholder="CVN" required />
                                            </div>
                                        </PaymentModal>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col w-1/2 pt-8 pb-8 bg-gray border-2 border-black-900 border-solid">
                        <div class="p-4">
                            <h2 class="mb-4 sm:text-lg md:text-3xl font-medium">Order Summary</h2>
                            <div className="flex flex-row rounded-lg border-2 border-black-900 border-solid">
                                <ul className="self-start justify-start w-5/6 px-8 py-4 font-thin">
                                    <li className="flex items-center mb-3">Subtotal</li>
                                    <li className="flex items-center mb-3">Shipping & Handling</li>
                                    <li className="flex items-center mb-3">Tax</li>
                                    <hr className="h-px my-2 bg-gray-500 border-0"></hr>
                                    <li className="flex items-center mb-3 font-bold">Total</li>
                                </ul>
                                <div class="flex justify-end w-1/6 px-8 py-4">
                                    <ul>
                                        <li className="flex items-end mb-3">$74.80</li>
                                        <li className="flex items-end mb-3">$8.20</li>
                                        <li className="flex items-end mb-3">$6.02</li>
                                        <hr className="h-px my-2 bg-gray-500 border-0"></hr>
                                        <li className="flex items-end mb-3">$89.02</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        
                        <div class="flex flex-row justify-center py-12 border-2 border-black-900 border-dashed">
                            <p>ad space</p>
                        </div>
                        

                        <div className="flex justify-end mx-8 my-4">
                            <button className="shadow-lg px-4 py-4 rounded text-xl bg-gray-900 hover:bg-gray-300 text-white hover:text-black">Submit Order</button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;