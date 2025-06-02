import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AppRoutes from "./task2/components/AppRoutes";
import { UserContext, UserContextProvider } from "./task2/UserContext";

function App() {
  return (
    <UserContext>
      <Router>
        <AppRoutes />
      </Router>
    </UserContext>
  );
}

export default App;
