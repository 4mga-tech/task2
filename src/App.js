import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Login from "./task1/Login";
import Home from "./task2/Home";
import Auto from "./task2/Auto";
import Profile from "./task2/Profile";
import Todo from "./task2/Todo";
function App() {
  return (
   <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/auto" element={<Auto />}/>
        <Route path="/profile" element={<Profile />}/>
        <Route path="/todo" element={<Todo />}/>
      </Routes>
      </Router>
    // <Home/>
  );
}

export default App;
