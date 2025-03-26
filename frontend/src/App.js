import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Layout from "./Pages/Layout";
import Home from "./Pages/Home";
import Shoppingcart from "./Pages/Cart";
import CheckoutPage from './Pages/checkoutPage';

function App() {
  useEffect(() => {
    // Example Fetch
    fetch('http://localhost:3301/api/greet')
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  }, []); 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shoppingcart" element={<Shoppingcart />} />
          <Route path="checkoutpage" element={<CheckoutPage />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
