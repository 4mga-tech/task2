import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSchool, faHouse, faRobot, faUser, faQuestion
} from "@fortawesome/free-solid-svg-icons";
import "./Layout.css";
import Cookies from 'js-cookie';

const Layout = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");

  const songolt = ["office", "home", "skool"];

  useEffect(() => {
    const email = Cookies.get("userEmail");
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const handleLogout = () => {
    Cookies.removeItem("token");
    Cookies.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <div className="layout">
      <div className="header">
        <FontAwesomeIcon icon={faSchool} style={{ marginRight: "10px" }} />
        <Link to="/">Must</Link>
        <h2>Hi, {userEmail}</h2>
        <button className="logout" onClick={handleLogout}>Logout</button>
      </div>

      <div className="menu">
        <select>
          {songolt.map((s, i) => <option key={i}>{s}</option>)}
        </select>
        <div className="menu-list">
          <ul>
            <li><FontAwesomeIcon icon={faHouse} /> <Link to="/">Nuur</Link></li>
            <li><FontAwesomeIcon icon={faRobot} /> <Link to="/auto">Auto</Link></li>
            <li><FontAwesomeIcon icon={faUser} /> <Link to="/profile">Profile</Link></li>
            <li><FontAwesomeIcon icon={faQuestion} /> <Link to="/todo">Todo</Link></li>
          </ul>
        </div>
      </div>

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
