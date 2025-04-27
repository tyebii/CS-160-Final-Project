import { createContext, useContext, useEffect, useState } from 'react';

import axios from 'axios';

import { useAuth } from './AuthHook';

const CartContext = createContext();

export const CartProvider = ({ children }) => {

    const [cartItems, setCartItems] = useState(new Set()); 

    const {auth} = useAuth()

    const addItem = (item) => {

        setCartItems(prev => {

            const newSet = new Set(prev); 

            newSet.add(item); 

            return newSet;

        });

    };
  
    const removeItem = (itemId) => {

        setCartItems(prev => {

            const newSet = new Set(prev);

            newSet.delete(itemId);

            return newSet;

        });

    };

    const clearItems= () => {

        setCartItems(new Set())

        return

    }

    useEffect(() => {

        if(!auth || auth === "Manager" || auth === "Employee"){

          setCartItems(new Set())

          return
          
        }

        const fetchCartItems = async () => {

          try {

            const response = await axios.get("http://localhost:3301/api/shoppingcart/shoppingcart", {

              withCredentials: true,

            });

            const itemIDs = response.data.map(item => item.ItemID); 

            setCartItems(new Set(itemIDs)); 
      
          } catch (error) {

            console.error(error.message);

          }

        };
      
        fetchCartItems();

    }, [auth]);

    return (

        <CartContext.Provider value={{ cartItems, addItem, removeItem, clearItems}}>

        {children}

        </CartContext.Provider>

    );

};

export const useCart = () => useContext(CartContext);