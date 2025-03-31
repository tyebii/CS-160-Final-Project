import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './Pages/Layout';
import WelcomePage from './Pages/WelcomePage';
import LoginPage from './Pages/LoginPage';
import Shoppingcart from './Pages/Cart';
import SearchPage from './Pages/searchPage';
import ItemPage from './Pages/ItemPage';
import { SignupPage } from './Pages/SignupPage';
function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Layout />} >
              <Route index element={<WelcomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="shoppingcart" element={<Shoppingcart />}/>
              <Route path="search/:searchType/:query" element={<SearchPage />}/>
              <Route path="itemview/:itemid" element={<ItemPage/>}/>
              <Route path="signup" element={<SignupPage/>}/>
          </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
