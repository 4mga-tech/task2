import React, { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    const now = new Date().getTime();
    Cookies.set("loginTime", now);
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove("loginTime");
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const loginTime = Cookies.get("loginTime");
    if (loginTime) {
      const now = new Date().getTime();
      const elapsed = now - parseInt(loginTime, 10);
      const thirtyMinutes = 30 * 60 * 1000;
      if (elapsed > thirtyMinutes) {
        logout();
      } else {
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
    <UserContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
