import React from 'react';
import './Shoppingcart.css';
import ProductComponent from './Components/ProductComponent';
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

            <button className='Proceed'>Proceed to Checkout</button>
        </div>

    );
}

export default ShoppingCart;