import React, { createContext, useState, useEffect } from 'react';

import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  
  const [auth, setAuth] = useState();

  //Logout Function
  const logout = () => {

    setAuth(null)

    axios.delete("http://localhost:3301/api/authentication/signout",{

      withCredentials: true,

    })

    .then(()=>{

      console.log("Cookie Cleared")

    })

    .catch((error)=>{

      console.warn(error.message);

    })

  }

  //Login Function
  const login = async ()=>{

    try {

      const response = await axios.get("http://localhost:3301/api/authentication/check", {

        withCredentials: true,

      });

      setAuth(response.data.role);

    } catch (error) {

      setAuth(null)

      return

    }

  }

  //When The React App Starts It Gets Information From Cookie
  useEffect(() => {

    login();

  }, []);

  return (

    <AuthContext.Provider value={{auth, login, logout}}>

      {children}

    </AuthContext.Provider>

  );

};

