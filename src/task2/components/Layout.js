import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSchool,
  faHouse,
  faRobot,
  faUser,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { Select, Menu, Button } from "antd";
import Cookies from "js-cookie";

const Layout = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [selectedMenuKey, setSelectedMenuKey] = useState("/");

  useEffect(() => {
    const name = Cookies.get("userName");
    if (name) {
      setUserName(name);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userName");
    navigate("/login");
  };

  const handleSelectChange = (value) => {
    if (value === "profile") {
      navigate("/profile");
    } else if (value === "logout") {
      handleLogout();
    }
  };

  const menuItems = [
    {
      key: "/",
      icon: <FontAwesomeIcon icon={faHouse} />,
      label: <Link to="/">Nuur</Link>,
    },
    {
      key: "/auto",
      icon: <FontAwesomeIcon icon={faRobot} />,
      label: <Link to="/auto">Auto</Link>,
    },
    {
      key: "/profile",
      icon: <FontAwesomeIcon icon={faUser} />,
      label: <Link to="/profile">Profile</Link>,
    },
    {
      key: "/todo",
      icon: <FontAwesomeIcon icon={faQuestion} />,
      label: <Link to="/todo">Todo</Link>,
    },
  ];

  const onMenuClick = ({ key }) => {
    setSelectedMenuKey(key);
    navigate(key);
  };

  return (
    <div className="layout">
      <div
        className="header"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "#f5f6f7",
          padding: "16px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <FontAwesomeIcon
          icon={faSchool}
          style={{ marginRight: "10px", marginLeft: "20px", fontSize: "24px" }}
        />
        <Link
          to="/"
          style={{
            fontSize: "1.5rem",
            marginRight: "auto",
            textDecoration: "none",
            color: "black",
          }}
        >
          Must
        </Link>
        <h2 style={{ marginRight: "5px" }}>Hi, {userName}</h2>
        <Select
          defaultValue="menu"
          className="logout"
          style={{ width: 140 }}
          onChange={handleSelectChange}
          options={[
            { value: "profile", label: "Profile" },
            { value: "logout", label: "Logout" },
          ]}
        />
        <Button
          className="darkk"
          onClick={() => setDarkMode(!darkMode)}
          type="default"
        >
          {darkMode ? "light" : "Dark"}
        </Button>
      </div>

      <div
        className="menu"
        style={{
          height: "calc(100vh - 80px)",
          overflowY: "auto",
          backgroundColor: "#f5f5f5",
          padding: "16px",
        }}
      >
        <Select
          defaultValue="options"
          style={{ width: 140, marginBottom: "20px" }}
          onChange={handleSelectChange}
          options={[
            { value: "office", label: "Office" },
            { value: "Skool", label: "Skool" },
            { value: "Lol", label: "Lol" },
          ]}
        />
        <Menu
          mode="inline"
          selectedKeys={[selectedMenuKey]}
          items={menuItems}
          onClick={onMenuClick}
          style={{ height: "80vh", borderRight: 0, background: "transparent" }}
        />
      </div>

      <div
        className="main-content"
        style={{
          padding: "16px",
          overflowY: "auto",
          backgroundColor: "#fff",
          height: "calc(100vh - 80px)",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
