import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./task1/Login";
import Home from "./task2/Home";
import Auto from "./task2/Auto";
import Profile from "./task2/Profile";
import Todo from "./task2/Todo";
import Layout from "./task2/components/Layout";
import ProtectedRoute from "./task2/components/ProtectedRoute";
import { UserContextProvider, UserContext } from "./task2/UserContext";
import { useContext } from "react";

function AppRoutes() {
  const { isAuthenticated, login } = useContext(UserContext);

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? <Home /> : <Navigate to="/login" replace />
        }
      />
      <Route path="/login" element={<Login login={login} />} />

      <Route element={<Layout />}>
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

function App() {
  return (
    <UserContext.Provider>
      <Router>
        <AppRoutes />
      </Router>
    </UserContext.Provider>
  );
}

export default App;
