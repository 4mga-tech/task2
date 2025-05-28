import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Login from "./task1/Login";
import Home from "./task2/Home";
function App() {
  return (
   <Router>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/home" element={<Home />}/>
      </Routes>
      </Router>
    // <Home/>
  );
}

export default App;
