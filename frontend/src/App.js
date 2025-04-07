import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './Pages/Layout';
import WelcomePage from './Pages/WelcomePage';
import LoginPage from './Pages/LoginPage';
import Shoppingcart from './Pages/Cart';
import SearchPage from './Pages/searchPage';
import ItemPage from './Pages/ItemPage';
import { AccountPage } from './Pages/AccountPage';
import { SignupPage } from './Pages/SignupPage';
import { OrdersPage } from './Pages/OrdersPage';
import {useAuth} from './Context/AuthHook'
import { TransactionPage } from './Pages/TransactionPage';
import { RobotAddPage } from './Pages/RobotAddPage';
import { UpdateRobotPage } from './Pages/UpdateRobotPage';
import Portal from './Pages/Portal';

function App() {
  const {auth} = useAuth()
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Layout />} >
              <Route index element= {<WelcomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="shoppingcart" element={<Shoppingcart />}/>
              <Route path="search/:searchType/:query" element={<SearchPage />}/>
              <Route path="itemview/:itemid" element={<ItemPage/>}/>
              <Route path="signup" element={<SignupPage/>}/>
              <Route path="account" element={<AccountPage/>}/>
              <Route path="orders" element={<OrdersPage/>}/>
              <Route path="transaction/view" element={<TransactionPage/>}/>
              <Route path="portal" element={<Portal/>}/>
              <Route path="addrobot" element={<RobotAddPage></RobotAddPage>}/>
              <Route path="updaterobot" element={<UpdateRobotPage></UpdateRobotPage>}/>
              <Route path="*" element={<h1>404 Not Found</h1>} />
          </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
