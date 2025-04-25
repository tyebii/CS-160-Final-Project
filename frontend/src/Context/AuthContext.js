//Import React Functions
import React, { createContext, useState, useEffect } from 'react';

//Decodes The Base-Encoded JWT
import axios from 'axios';

//Create The Context
export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  
  const [auth, setAuth] = useState(null);

  const logout = () => {

    axios.delete("http://localhost:3301/api/authentication/signout",{

      withCredentials: true,

    })
    .then(()=>{

      console.log("Cookie Cleared")

    })

    .catch((error)=>{

      console.log(error.message);

    })

    setAuth(null)

  }

  //Login Function
  const login = async ()=>{

    try {

      const response = await axios.get("http://localhost:3301/api/authentication/check", {

        withCredentials: true,

      });

      setAuth(response.data.role);

    } catch (error) {

      console.log(error.message);

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

