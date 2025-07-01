import React, { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!Cookies.get("token")
  );
  const [userName, setUserName] = useState(Cookies.get("userName") || "");
  const login = (token) => {
    Cookies.set("token", token, { path: "/" });
    Cookies.set("loginTime", Date.now().toString(), { path: "/" });
    setUserName(Cookies.get("userName") || "");
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove("loginTime");
    Cookies.remove("token");
    Cookies.remove("userName");
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
    <UserContext.Provider value={{ isAuthenticated, login, logout, userName }}>
      {children}
    </UserContext.Provider>
  );
};
