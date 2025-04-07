//Import React Functions
import React, { createContext, useState, useEffect } from 'react';

//Decodes The Base-Encoded JWT
import { jwtDecode } from 'jwt-decode';

//Create The Context
export const AuthContext = createContext();


export const AuthProvider = ({children}) => {
  
  //Auth State Variable
  const [auth, setAuth] = useState("");

  //Nulls The Context And Cleans The Local Storage
  const logout = () => {
    setAuth(null)
    localStorage.removeItem("accessToken")
    localStorage.removeItem("Auth")
  }

  //Login Function
  const login = ()=>{
    try {
      const decoded = jwtDecode(localStorage.getItem("accessToken"))
      if(decoded.EmployeeID != null && decoded.SupervisorID == null){
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
      alert('Bad JWT');
      logout()
    }
  }

  //When The React App Starts It Gets Information From LocalStorage
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

