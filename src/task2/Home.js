import "./Home.css";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSchool,
  faHouse,
  faRobot,
  faUser,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function Home() {
  const navigate = useNavigate();
  const handleLogout = () => {
    Cookies.removeItem('token');
    navigate('/login');
  };
useEffect(() => {
const token = Cookies.getItem('token');
if(!token){
  navigate('/login');
}}, [navigate])
  const [toggleStates, setToggleStates] = useState(Array(12).fill(false));
  const songolt = ["office", "home", "skool"];
  const cards = [
    { label: "4mga-tech", style: "salsan", showToggle: false },
    { label: "Coridor gerel", showToggle: true },
    { label: "Huvtsasny uruu", showToggle: true },
    { label: "Shatny gerel", showToggle: true },
    { label: "Logo", showToggle: true },
    {
      labelTop: "24.6°",
      labelBottom: "Temp",
      style: "purple",
      showToggle: false,
      isTempCard: true,
    },
    { label: "Office Light", showToggle: true },
    { label: "RGB", style: "green", showToggle: true },
    { label: "Us butsalgagch", showToggle: true },
    { label: "Kitchen 1", showToggle: true },
    { label: "Kitchen 2", showToggle: true },
    { label: "Living Room", showToggle: true },
    { label: "Living Room", showToggle: true },
    { label: "Living Room", showToggle: true },
    { label: "Living Room", showToggle: true },
    { label: "Living Room", showToggle: true },
    { label: "Living Room", showToggle: true },
    { label: "Living Room", showToggle: true },
  ];
  const toggleCard = (index) => {
    const newStates = [...toggleStates];
    newStates[index] = !newStates[index];
    setToggleStates(newStates);
  };

  return (
    <div className="layout">
      <div className="header">
        <FontAwesomeIcon icon={faSchool} style={{ marginRight: "10px" }} />{" "}
        <Link to="/">Must</Link>
        <h2>Hi, Amgalanbaatar</h2>
        <button className="logout" onClick={handleLogout}>Logout</button>
      </div>
      <div className="menu">
        <select>
          {songolt.map((songolt) => {
            return <option>{songolt}</option>;
          })}
        </select>
        <br />
        <br />
        <div className="menu-list">
          <ul>
            <li>
              {" "}
              <FontAwesomeIcon icon={faHouse} /> <Link to="/">Nuur</Link>{" "}
            </li>
            <li>
              {" "}
              <FontAwesomeIcon icon={faRobot} />
              <Link to="/auto">Auto</Link>{" "}
            </li>
            <li>
              {" "}
              <FontAwesomeIcon icon={faUser} />{" "}
              <Link to="profile">Profile</Link>
            </li>
            <li>
              {" "}
              <FontAwesomeIcon icon={faQuestion} /> <Link to="/todo">Todo</Link>{" "}
            </li>
          </ul>
        </div>
      </div>
      <div className="main-content">
        <div className="card-grid">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`card ${card.style || ""} ${
                card.isTempCard ? "temp-card" : ""
              }`}
            >
              {card.isTempCard ? (
                <>
                  <div className="temp-top">{card.labelTop}</div>
                  <div className="temp-bottom">{card.labelBottom}</div>
                </>
              ) : (
                <div className="card-text">{card.label}</div>
              )}
              {card.showToggle && (
                <button
                  className={`toggle-btn ${
                    toggleStates[index] ? "toggled" : ""
                  }`}
                  onClick={() => toggleCard(index)}
                >
                  <div className="thumb"></div>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Home;
