import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./task1/Login";
import Home from "./task2/Home";
import Auto from "./task2/Auto";
import Profile from "./task2/Profile";
import Todo from "./task2/Todo";
import Layout from "./task2/components/Layout";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Layout/>}>
        
        <Route path="/profile" element={<Profile />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/auto" element={<Auto />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
