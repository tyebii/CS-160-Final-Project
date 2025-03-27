import React, { createContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [auth, setAuth] = useState("");

  const login = ()=>{
    try {
      const decoded = jwtDecode(localStorage.getItem("accessToken"))
      console.log(decoded); 
      if(decoded.SupervisorID != null){
        localStorage.setItem("Auth", "Manager")
        return setAuth("Manager")
        
      }else if(decoded.EmployeeID == null){
        localStorage.setItem("Auth", "Customer")
        return setAuth("Customer")
      }else{
        localStorage.setItem("Auth", "Employee")
        return setAuth("Employee")
      }
    } catch (error) {
      console.error('Could not be decoded');
    }
  }

  const logout = () => {
    setAuth(null)
    localStorage.removeItem("accessToken")
    localStorage.removeItem("Auth")
  }

  useEffect(() => {
    if(localStorage.getItem("Auth")){
      setAuth(localStorage.getItem("Auth"))
    }else{
      setAuth(null)
    }
  }, []);




  
  return (
    <AuthContext.Provider value={{auth, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

