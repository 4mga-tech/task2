import "./Login.css"
import React,{useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faEnvelope, faXmark } from "@fortawesome/free-solid-svg-icons";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Email:', email);
        console.log('Password:', password);
    }

  return (
    <div className="container">
        <div className="font"><FontAwesomeIcon icon={faXmark} /></div>
      <h1>Login Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="input">
            <label htmlFor="email">Email or phone:</label> <br/>
            <input type="email" id="email" size={50} value={email} onChange={(e) => setEmail(e.target.value)}required />
        </div> <br/>
        <div className="input">
            <label htmlFor="password">Password:</label> <br/>
            <input type="password" id="password" size={50} value={password} onChange={(e) => setPassword(e.target.value)}required />
        </div>
        <div className="forgot">Forgot Password?</div>
        <button className="loginbtn" type="submit">Login</button>
      </form>
      <div className="signup">Not a Member? <span> Signup now </span></div>
    </div>
  );
}
export default Login;
