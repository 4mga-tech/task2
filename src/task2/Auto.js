import React, {useEffect, useState} from "react";
import cloudImg from "../icons/ab_multi-cloud.jpg";
import { UserOutlined, WalletOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"
import "../task2/Home.css";
import dayjs from "dayjs";
function Auto() {
  const [userName, setUserName] = useState("");
  const [statusLog, ] = useState(() => {
    const saved = localStorage.getItem("statusLog");
    return saved ? JSON.parse(saved) : [];
  });
  const currentDate = dayjs().format("YYYY-MM-DD");
  const navigate = useNavigate();
  useEffect(() => {
    const name = Cookies.get("userName");
    if (name) {
      setUserName(name);
    }
  }, []);

  return (
    <div className="main-content">
      <div className="left-section">
          <p>sfsf</p>
      </div>
      <div className="right-section">
        <div>
          <img className="cloud" src={cloudImg} alt="cloud" />
        </div>
        <div className="box-container">
          <div className="box profile-box" onClick={() => navigate("/profile")}>
            <div className="box-header">
              <UserOutlined style={{ fontSize: 17 }} />
              <span>Профайл</span>
            </div>
            <div className="box-body">
              <h3>{userName}</h3>
              <p>
                Хувийн хуудас{" "}
                <img
                  src="rightArrowSmall.svg"
                  alt="arrow"
                  width="6"
                  height="8"
                />
              </p>
            </div>
          </div>

          <div className="box payment-box">
            <div className="box-header">
              <WalletOutlined style={{ fontSize: 16 }} />
              <span>Төлбөрийн багц</span>
            </div>
            <div className="box-body">
              <h3 style={{ color: "#39b54a" }}>Premium</h3>
              <p>2023.05.06 хүртэл</p>
            </div>
          </div>
          <div className="status-box">
            <h3
              style={{
                paddingLeft: "20px",
                borderBottom: "1px solid #ccc",
                paddingBottom: "8px",
              }}
            >
              {currentDate}
            </h3>
            <ul
              style={{
                maxHeight: "180px",
                overflowY: "auto",
                paddingLeft: "20px",
              }}
            >
              {statusLog.length === 0 ? (
                <li>No status changes yet</li>
              ) : (
                statusLog.map((entry, i) => (
                  <li
                    key={i}
                    style={{
                      position: "relative",
                      padding: "8px 40px 20px 10px",
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>{entry.message}</div>

                    <span
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "10px",
                        fontSize: "12px",
                        color: "#999",
                      }}
                    >
                      {dayjs(entry.timestamp).format("HH:mm")}
                    </span>

                    <span
                      style={{
                        position: "absolute",
                        bottom: "4px",
                        left: "10px",
                        fontSize: "12px",
                        color: "#999",
                      }}
                    >
                      {dayjs(entry.timestamp).format("YYYY-MM-DD")}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Auto;
