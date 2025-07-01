import "./Home.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Modal, Select, message } from "antd";
import dayjs from "dayjs";

import Linactive from "../icons/Linactive.svg";
import cloudImg from "../icons/ab_multi-cloud.jpg";
import { UserOutlined, WalletOutlined } from "@ant-design/icons";

function Home() {
  const [userName, setUserName] = useState("");

  const [deviceSelectVisible, setDeviceSelectVisible] = useState(false);
  const [availableDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [statusLog, setStatusLog] = useState(() => {
    const saved = localStorage.getItem("statusLog");
    return saved ? JSON.parse(saved) : [];
  });
  const addStatusLogEntry = (deviceId, turnedOn) => {
    const timestamp = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const message = turnedOn
      ? `${deviceId} төхөөрөмж холболттой боллоо.`
      : `${deviceId} төхөөрөмж холболтоос саллаа.`;

    const newEntry = { timestamp, message };
    setStatusLog((prev) => {
      const updated = [newEntry, ...prev];
      localStorage.setItem("statusLog", JSON.stringify(updated));
      return updated;
    });
  };
  const currentDate = dayjs().format("YYYY-MM-DD");
  const navigate = useNavigate();
  const [deviceStates, setDeviceStates] = useState({});
  const [, setDevices] = useState([]);
  const [loadingStates, setLoadingStates] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [baseCards, setBaseCards] = useState([]);
  const [, setCurrentTime] = useState(dayjs().format("HH:mm:ss"));

  useEffect(() => {
    const name = Cookies.get("userName");
    if (name) {
      setUserName(name);
    }
  }, []);
  useEffect(() => {
    const token = Cookies.get("accessToken");
    const userId = Cookies.get("userId");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:3000/api/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Fetched user data:", response.data);
      })
      .catch((err) => {
        console.error("Error fetching user data", err);
      });
  }, [navigate]);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }
    axios
      .get("http://localhost:3000/api/devices", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Device API response:", res.data);
        const deviceList = res.data;

        setDevices(deviceList);
        setLoadingStates(Array(deviceList.length).fill(false));

        const tempHumidityDevices = deviceList.filter(
          (d) => d.category === "temperature & humidity sensor"
        );

        setBaseCards((prev) => {
          const existingIds = prev.map((c) => c.id);
          const newCards = tempHumidityDevices
            .filter((d) => !existingIds.includes(d.clientId))
            .map((d) => ({
              id: d.clientId,
              style: "blue",
              showToggle: true,
              label: `${d.entity} - ${d.category}`,
            }));
          return [...prev, ...newCards];
        });
      })
      .catch((err) => {
        console.error("Error fetching devices", err);
      });
  }, [navigate]);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (!token || baseCards.length === 0) return;

    baseCards.forEach((card) => {
      axios
        .get(`http://localhost:3000/api/telemetry/${card.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log(`Telemetry for ${card.id}:`, res.data);
          if (res.data && res.data.data) {
            setStatusMap((prev) => ({
              ...prev,
              [card.id]: res.data,
            }));
          }
        })
        .catch((err) => {
          console.error(`Error fetching status for ${card.id}:`, err);
        });
    });
  }, [baseCards]);

  useEffect(() => {
    const savedCards = localStorage.getItem("baseCards");
    if (savedCards) {
      setBaseCards(JSON.parse(savedCards));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("baseCards", JSON.stringify(baseCards));
  }, [baseCards]);

  useEffect(() => {
    const savedStates = localStorage.getItem("deviceStates");
    if (savedStates) {
      setDeviceStates(JSON.parse(savedStates));
    }
  }, []);

  const toggleCard = (index, clientId) => {
    const newLoadingStates = [...loadingStates];
    newLoadingStates[index] = true;
    setLoadingStates(newLoadingStates);

    axios
      .post(`http://localhost:3000/api/status/toggle/${clientId}`, null, {
        headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
      })
      .then(() => {
        setTimeout(() => {
          setDeviceStates((prev) => {
            const newState = !prev[clientId];
            addStatusLogEntry(clientId, newState);
            return {
              ...prev,
              [clientId]: newState,
            };
          });

          newLoadingStates[index] = false;
          setLoadingStates([...newLoadingStates]);
        }, 1500);
      })
      .catch((err) => {
        console.error("Toggle error:", err);
        message.error("Toggle failed");
        newLoadingStates[index] = false;
        setLoadingStates([...newLoadingStates]);
      });
  };

  useEffect(() => {
    console.log("Status Map:", statusMap);
  }, [statusMap]);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs().format("HH:mm:ss"));
    }, 1000);
    return () => clearInterval(interval);
  });
  useEffect(() => {
    localStorage.setItem("deviceStates", JSON.stringify(deviceStates));
  }, [deviceStates]);

  return (
    <div className="main-content">
      <div className="left-section">
        <div className="card-grid">
          {baseCards.map((card, index) => (
            <div
              key={index}
              className={`card 
               ${!deviceStates[card.id] ? "inactivee" : ""}
            ${
              deviceStates[card.id] &&
              typeof statusMap[card.id]?.data?.temperature === "number"
                ? statusMap[card.id].data.temperature > 16
                  ? "hot"
                  : "cold"
                : card.style || ""
            }`}
            >
              {typeof statusMap[card.id]?.data?.temperature === "number" &&
                (!deviceStates[card.id] ||
                  (deviceStates[card.id] &&
                    (statusMap[card.id].data.temperature > 16 ||
                      statusMap[card.id].data.temperature <= 16))) && (
                  <img
                    src={Linactive}
                    alt="Linactive"
                    className="Linactive-icon"
                  />
                )}

              <div className="card-text">{card.label}</div>

              {card.showToggle && (
                <button
                  className={`toggle-btn ${
                    deviceStates[card.id] ? "toggled" : ""
                  } ${loadingStates[index] ? "loading" : ""}`}
                  onClick={() => toggleCard(index, card.id)}
                  disabled={loadingStates[index]}
                  title={loadingStates[index] ? "Түр хүлээнэ үү..." : ""}
                >
                  <div className="thumb">
                    {loadingStates[index] && <div className="spinner"></div>}
                  </div>
                </button>
              )}

              {card.category === "temperature & humidity sensor" ||
              card.label
                .toLowerCase()
                .includes("temperature & humidity sensor") ? (
                <div
                  style={{ marginTop: "8px", fontSize: "14px", color: "#fff" }}
                >
                  {deviceStates[card.id] ? (
                    <>
                      🌡 Температур:{" "}
                      {statusMap[card.id]?.data?.temperature ?? "Мэдээлэл алга"}{" "}
                      °C
                      <br />
                      💧 Чийгшил:{" "}
                      {statusMap[card.id]?.data?.humidity ?? "Мэдээлэл алга"} %
                    </>
                  ) : (
                    <>Унтарсан</>
                  )}
                </div>
              ) : card.id === "VIOT_E99614" ? (
                <div
                  style={{ marginTop: "8px", fontSize: "14px", color: "#fff" }}
                >
                  🌡 Температур:{" "}
                  {deviceStates["VIOT_E99614"]
                    ? statusMap["VIOT_E99614"]?.data?.temperature ??
                      "Мэдээлэл алга"
                    : "Унтарсан"}{" "}
                  °C
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <Modal
          title="Select device to add bro"
          open={deviceSelectVisible}
          onCancel={() => setDeviceSelectVisible(false)}
          onOk={() => {
            if (!selectedDevice) {
              message.warning("pls select device");
              return;
            }
            if (!baseCards.find((c) => c.id === selectedDevice.clientId)) {
              const newCard = {
                id: selectedDevice.clientId,
                style: "temp",
                showToggle: true,
                label: `${selectedDevice.entity} - ${selectedDevice.category}`,
              };
              setBaseCards((prev) => [...prev, newCard]);
              message.success("dev added");
            } else {
              message.info("dev already added");
            }
            setDeviceSelectVisible(false);
            setSelectedDevice(null);
          }}
        >
          <Select
            style={{ width: "100%" }}
            placeholder="choose a dev"
            value={selectedDevice?.clientId || undefined}
            onChange={(clientId) => {
              const device = availableDevices.find(
                (d) => d.clientId === clientId
              );
              setSelectedDevice(device);
            }}
          >
            {availableDevices.map((device) => (
              <Select.Option key={device.clientId} value={device.clientId}>
                {device.clientId} - {device.entity} / {device.category}
              </Select.Option>
            ))}
          </Select>
        </Modal>
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
              <p>2030он хүртэл</p>
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

export default Home;
