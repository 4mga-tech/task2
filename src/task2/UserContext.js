import React, { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!Cookies.get("token")
  );
  const [userName, setUserName] = useState(Cookies.get("userName") || "");
  const [userPhone, setUserPhone] = useState(Cookies.get("userPhone") || "");
  const login = (token, name, phoneNumber) => {
  Cookies.set("token", token, { path: "/" });
  Cookies.set("loginTime", Date.now().toString(), { path: "/" });
  Cookies.set("userName", name, { path: "/" });
  Cookies.set("userPhone", phoneNumber, { path: "/" });

  setUserName(name);
  setUserPhone(phoneNumber);
  setIsAuthenticated(true);
};


  const logout = () => {
    Cookies.remove("loginTime");
    Cookies.remove("token");
    Cookies.remove("userName");
    Cookies.remove("userPhone");
    setUserName("");
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const loginTime = Cookies.get("loginTime");
    console.log("loginTime cookie on load:", loginTime);
    if (loginTime) {
      const now = new Date().getTime();
      const elapsed = now - parseInt(loginTime, 10);
      const thirtyMinutes = 30 * 60 * 1000;
      if (elapsed > thirtyMinutes) {
        console.log("Session expired");
        logout();
      } else {
        console.log("Session valid, user authenticated");
        setIsAuthenticated(true);
      }
    }
  }, []);

  useEffect(() => {
    let timer;
    if (isAuthenticated) {
      timer = setTimeout(() => {
        logout();
      }, 30 * 60 * 1000);
    }
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  return (
    <UserContext.Provider
      value={{ isAuthenticated, login, logout, userName, userPhone, setUserName }}
    >
      {children}
    </UserContext.Provider>
  );
};
