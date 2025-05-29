import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./task1/Login";
import Home from "./task2/Home";
import Auto from "./task2/Auto";
import Profile from "./task2/Profile";
import Todo from "./task2/Todo";
import Layout from "./task2/components/Layout";
import ProtectedRoute from "./task2/components/ProtectedRoute";
import React, { useEffect, useState } from "react";
function App() {
  const [IsAuthenticated, setIsAuthenticated] = useState(false);
  const login = () => {
    const now = new Date().getTime();
    localStorage.setItem("loginTime", now);
    setIsAuthenticated(true);
  };
  const logout = () => {
    setIsAuthenticated(false);
  };
  useEffect(() => {
    const loginTime = localStorage.getItem("loginTime");
    if(loginTime){
      const now = new Date().getTime();
      const elapsed = now - parseInt(loginTime, 10);
      const thirtyMinutes = 30 * 60 *1000;
      if(elapsed > thirtyMinutes){
        logout();
      }
      else{
        setIsAuthenticated(true)
      }
    }
  },[]);

  useEffect(() => {
    let timer;
    if(IsAuthenticated){
      timer = setTimeout(() => {
        logout();
      }, 30 * 60 * 1000);
    }
    return() => clearTimeout(timer);
  }, [IsAuthenticated]);
  return (
    <Router>
      <Routes>
        <Route path="/" element={IsAuthenticated ? <Home /> : <Navigate to="/login" replace/>} />
        <Route path="/login" element={<Login login={login} />} />
        
        <Route element={<Layout />}>
          <Route path="/profile" element={<ProtectedRoute isAuthenticated={IsAuthenticated}> <Profile /></ProtectedRoute> } />
          <Route path="/todo" element={<ProtectedRoute isAuthenticated={IsAuthenticated}> <Todo /></ProtectedRoute> } />
          <Route path="/auto" element={ <ProtectedRoute isAuthenticated={IsAuthenticated}><Auto /></ProtectedRoute> } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
