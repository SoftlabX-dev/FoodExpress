import React, { createContext,useEffect, useContext, useState } from 'react';
import { ClientApi } from "../ClientApi/ClientApi";

// 1. Create the context
const AuthContext = createContext();


// 2. Create the custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Create the Provider
export  const AuthProvider = ({ children }) => {
  // --- MOCK AUTH STATE ---
  // In a real app, this would be null, and you'd set it on login
  const [isLoggedIn,setIsLoggedIn] = useState(false); 
const [user, setuser] = useState(null);
const [errors,seterrors] = useState({});
  const [Loading, setLoading] = useState(true); 

   useEffect(() => {//pour resoudre le perte d infos au recharchement du page
  const checkUser = async () => {
    try {
      const res = await ClientApi.GetUser();
      if(res.data) {
        setuser(res.data);
        setIsLoggedIn(true);
      } else {
        setuser(null);
        setIsLoggedIn(false);
      }
    } catch(err) {
      setuser(null);
      setIsLoggedIn(false);
    }finally {
        setLoading(false);
      }
  };
  checkUser();
}, []);

  // ----------SIGNUP---------------
const register = async(name,email,password,password_confirmation)=> {
    try {
      console.log("1. Récupération du cookie CSRF...");
      await ClientApi.getcsrf();

            console.log("2. Register...");
      await ClientApi.Register(name,email,password,password_confirmation);

      
            console.log("3. recuperation du USER...");
       const res = await ClientApi.GetUser();
        setuser(res.data)
      setIsLoggedIn(true);
             console.log(response);
    } catch (error) {
        console.log(error);
    }
}
  
  // ----------LOGIN---------------

 const login = async(email, password)=> {
    try {
      console.log("1. Récupération du cookie CSRF...");
      await ClientApi.getcsrf();

      console.log("2. Tentative de connexion...");
      const response = await ClientApi.Login(email, password);
        
      if (response.status === 200) {
        console.log("✅ Login réussi:", response);
        const res = await ClientApi.GetUser();
        console.log('Voici l utilisateur connecte :',res.data);
        setuser(res.data)
       setIsLoggedIn(true);
           seterrors({});
            return {success:true}
      }}
  catch (error) {
            if (error.response?.status === 422) {
                 seterrors(error.response.data.errors);
              }        
                setIsLoggedIn(false);
                 return {success:false}

    }
 }

    // ----------LOGOUT---------------

const logout = async()=>{
    try {
        const response  = await ClientApi.Logout();
        console.log(response.status)
        if(response.status === 201 ){
          setuser(null);
        setIsLoggedIn(false);
            navigate('/login');
        }
    } catch(error){
        console.log(error)
    }
}  

  const value = {
    isLoggedIn,
  setIsLoggedIn,
    setuser,
    login,
    user,
     logout,
     register,
     errors,Loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
