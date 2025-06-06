import "./Login.css";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../task2/axiosInstance";
function Login({ login }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  

  const navigate = useNavigate();

  const handleLogin  = async (e) => {
    e.preventDefault();
    try{
      const result =  await axiosInstance.post("http://localhost:3001/users/login", {email, password},{withCredentials: true});
      console.log("data",result.data )
      if(result.data.accessToken){
        login();
        navigate("/");
      }else{
        setError(result.data.message || "aldaa zaasan2")
      }
    }
    catch (err){
      setError("buruu bna",err);
    }
  };

  return (
    <div className="login-layout">
    <div className="container">
      <div className="font">
        <FontAwesomeIcon icon={faXmark} />
      </div>
      <h1>Login Form</h1>
      <form onSubmit={handleLogin}>
        <div className="input">
          <label htmlFor="email">Email or phone:</label> <br />
          <input
            type="email"
            id="email"
            size={50}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <br />
        <div className="input">
          <label htmlFor="password">Password:</label> <br />
          <input 
            type="password"
            id="password"
            size={50}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
        <div className="forgot" onClick={ () => navigate("/reset")} style={{cursor:"pointer"}}>Forgot Password?</div>
        <button className="loginbtn" type="submit">
          Login
        </button>
      </form>
      <div className="signup">
        Not a Member? {""} <span onClick={ () => navigate("/reg")} style={{cursor:"pointer"}}>Signup now</span>
      </div>
    </div>
    </div>
  );
}

export default Login;
