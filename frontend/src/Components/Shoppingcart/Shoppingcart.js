import React from 'react';
import './Shoppingcart.css';
import ProductComponent from './Components/ProductComponent';
import { Link } from "react-router-dom";

function ShoppingCart() {
    return (
        <div className='ShoppingCart'>
            <div className="ShoppingCart-Container">
                <h1>Shopping Cart</h1>
                <h3>Deselect Items</h3>
            </div>
            <div className= "Product-Container">
                <ProductComponent></ProductComponent>
                <ProductComponent></ProductComponent>
            </div>

            <div className='Subtotal'>
                <h1>Subtotal</h1>
                <div className='Subtotal-Information'>
                    <h3>X items Cost: $xxx</h3>
                    <h3>X items Weight: xxxx</h3>
                </div>
            </div>

            <Link to="/checkoutpage" className="Links">
                <div className="Proceed">
                    <h1 class="flex justify-center pt-2">Proceed to Checkout</h1>
                </div>
            </Link>
        </div>

    );
}

export default ShoppingCart;