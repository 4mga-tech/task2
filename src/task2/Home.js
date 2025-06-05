import "./Home.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSchool,
  faHouse,
  faRobot,
  faUser,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
    }

    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        const names = response.data.map((user) => user.username);
        setUsernames(names);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [navigate]);

  const [usernames, setUsernames] = useState([]);
  const [toggleStates, setToggleStates] = useState(Array(18).fill(false));

  const songolt = ["office", "home", "skool"];

  const baseCards = [
    { showToggle: false },
    { showToggle: true },
    { showToggle: true },
    { showToggle: true },
    { showToggle: true },
    {
      labelTop: "24.6°",
      labelBottom: "Temp",
      style: "purple",
      showToggle: false,
      isTempCard: true,
    },
    { showToggle: true },
    { style: "green", showToggle: true },
    { showToggle: true },
    { showToggle: true },
    { showToggle: true },
    { showToggle: true },
    { showToggle: true },
    { showToggle: true },
    { showToggle: true },
    { showToggle: true },
    { showToggle: true },
    { showToggle: true },
  ];

  const cards = baseCards.map((card, idx) => {
    if (usernames.length > idx && !card.isTempCard) {
      return { ...card, label: usernames[idx] };
    }
    return { ...card, label: card.label || `Card ${idx + 1}` };
  });

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
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="menu">
        <select>
          {songolt.map((song, index) => (
            <option key={index}>{song}</option>
          ))}
        </select>
        <br />
        <br />
        <div className="menu-list">
          <ul>
            <li>
              <FontAwesomeIcon icon={faHouse} /> <Link to="/">Nuur</Link>{" "}
            </li>
            <li>
              <FontAwesomeIcon icon={faRobot} />
              <Link to="/auto">Auto</Link>{" "}
            </li>
            <li>
              <FontAwesomeIcon icon={faUser} /> <Link to="profile">Profile</Link>
            </li>
            <li>
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
                  className={`toggle-btn ${toggleStates[index] ? "toggled" : ""}`}
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
