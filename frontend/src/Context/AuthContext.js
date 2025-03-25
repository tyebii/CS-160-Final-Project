import React, { createContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [auth, setAuth] = useState(localStorage.getItem("accessToken"));

  const login = ()=>{
    setStatus()
  }

  const logout = () => {
    setAuth(null)
  }

  const setStatus = () => {
    try {
      const decoded = jwtDecode(localStorage.getItem("accessToken"))
      console.log(decoded); 
      if(decoded.CustomerID == null && decoded.SupervisorID != null){
        return setAuth("Manager")
      }else if(decoded.Employee == null){
        return setAuth("Customer")
      }else{
        return setAuth("Employee")
      }
    } catch (error) {
      console.error('Could not be decoded');
    }
  }


  
  return (
    <AuthContext.Provider value={{auth, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

