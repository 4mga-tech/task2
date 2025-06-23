import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../../task1/Login";
import Home from "../Home";
import Auto from "../Auto";
import Profile from "../Profile";
import Todo from "../Todo";
import Layout from "./Layout";
import ProtectedRoute from "./ProtectedRoute";
import { UserContext } from "../UserContext";
import Reg from "./Reg";
import Reset from "./Reset";
import ResetPassword from "./ResetPassword";
function AppRoutes() {
  const { isAuthenticated, login } = useContext(UserContext);

  console.log("Is Authenticated in AppRoutes:", isAuthenticated);

  return (
    <Routes>
      <Route path="/login" element={<Login login={login} />} />
      <Route path="/reg" element={<Reg />} />
      <Route path="/reset" element={<Reset />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/resetpassword" element={<ResetPassword />} />
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            isAuthenticated ? <Home /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/todo"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Todo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auto"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Auto />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
