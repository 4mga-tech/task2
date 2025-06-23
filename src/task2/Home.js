import "./Home.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import LightInactive from "../icons/Linactive.svg";
// import inactive from "../icons/inactive.svg";
import Cookies from "js-cookie";
import { Button, Modal, Form, Select, TimePicker, message } from "antd";
import dayjs from "dayjs";

function Home() {
  const [automationVisible, setAutomationVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [deviceStates, setDeviceStates] = useState({});
  const [devices, setDevices] = useState([]);
  const [loadingStates, setLoadingStates] = useState([]);
  // const [user, setUser] = useState(null);
  const scheduleAutomation = (values) => {
    const { deviceId, action, time } = values;
    const targetTime = dayjs(time);
    const now = dayjs();

    const delay = targetTime.diff(now, "millisecond");
    if (delay < 0) {
      message.error("Time must be in the future");
      return;
    }
    message.success(
      `Scheduled to turn ${action} ${deviceId} at ${targetTime.format("HH:mm")}`
    );
    setTimeout(() => {
      axios
        .post(`http://localhost:3000/status/toggle/${deviceId}`, null, {
          headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
        })
        .then(() => {
          setDeviceStates((prev) => ({
            ...prev,
            [deviceId]: action === "on",
          }));
          message.success(`${deviceId} turned ${action}`);
        })
        .catch((err) => {
          console.error("Toggle error:", err);
          message.error("Failed to toggle device");
        });
    }, delay);
  };
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
        // setUser(response.data);
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
        const deviceList = res.data.devices;

        console.log("Fetched devices", deviceList);
        console.log(
          "actual device clientId:",
          deviceList.map((d) => d.clientId)
        );
        setDevices(deviceList);
        setLoadingStates(Array(deviceList.length).fill(false));
      })
      .catch((err) => {
        console.error("Error fetching devices", err);
      });
  }, [navigate]);

  const [statusMap, setStatusMap] = useState({});
  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (!token || devices.length === 0) return;

    devices.forEach((device) => {
      axios
        .get(`http://localhost:3000/status/${device.clientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.statusLogs && res.data.statusLogs.length > 0) {
            setStatusMap((prev) => ({
              ...prev,
              [device.clientId]: res.data.statusLogs[0],
            }));
          }
        })
        .catch((err) => {
          console.error(`Error fetching status for ${device.clientId}:`, err);
        });
    });
  }, [devices]);

  const baseCards = [
    // { id: "Zbridge", style: "salsan", showToggle: false, label: "Zbridge" },
    // {
    //   id: "power",
    //   style: "salsan",
    //   showToggle: false,
    //   showLighIcon: true,
    //   label: "power",
    // },
    // {
    //   id: "zHouse4-C-1-109",
    //   style: "purple",
    //   showToggle: false,
    //   z4: true,
    //   label: "zHouse4-C-1-109",
    // },
    // { id: "power2", showToggle: false, showLighIcon: true, label: "power 2" },
    // {
    //   id: "AgaarynChanar",
    //   style: "inactive",
    //   showToggle: false,
    //   label: "Агаарын чанарын сэнсор",
    // },
    // {
    //   id: "power3",
    //   style: "salsan",
    //   showToggle: false,
    //   showLighIcon: true,
    //   label: "power 3",
    // },
    // {
    //   id: "temp",
    //   style: "inactive",
    //   showToggle: false,
    //   label: "Темп, Чийгшил",
    // },
    // { id: "Amgaa", style: "salsan", showToggle: false, label: "Amgaa test" },
    // {
    //   id: "power4",
    //   style: "salsan",
    //   showToggle: false,
    //   showLighIcon: true,
    //   label: "power 4",
    // },
    // {
    //   id: "q",
    //   style: "salsan",
    //   showToggle: false,
    //   showLighIcon: true,
    //   label: "q",
    // },
    // {
    //   id: "logo",
    //   style: "card",
    //   showToggle: true,
    //   showLighIcon: true,
    //   label: "Logo",
    // },
    // {
    //   id: "gerel3",
    //   style: "salsan",
    //   showToggle: false,
    //   showLighIcon: true,
    //   label: "Гэрэл 3",
    // },
    // {
    //   id: "huvtsasnyUruu",
    //   style: "card",
    //   showToggle: true,
    //   showLighIcon: true,
    //   label: "Хувцасны өрөө",
    // },
    // {
    //   id: "rgb",
    //   style: "green",
    //   showToggle: true,
    //   showLighIcon: true,
    //   label: "RGB wled",
    // },
    // {
    //   id: "hursMedregch",
    //   style: "orange",
    //   showToggle: false,
    //   label: "Хөрсний мэдрэгч",
    // },
    {
      id: "VIOT_E99614",
      style: "pink",
      showToggle: true,
      label: "Орчны температур, чийгшил",
    },
    // {
    //   id: "gerelMedregch",
    //   style: "salsan",
    //   showToggle: false,
    //   label: "Гэрэл мэдрэгч",
    // },
    // {
    //   id: "zHouse3-C-1-109",
    //   style: "purple",
    //   showToggle: false,
    //   z4: true,
    //   label: "zHouse3-C-1-109",
    // },
    // {
    //   id: "zHouse2-B-1-97",
    //   style: "purple",
    //   showToggle: false,
    //   z4: true,
    //   label: "zHouse2-B-1-97",
    // },
    // {
    //   id: "usButsalgagch",
    //   showToggle: true,
    //   showLighIcon: true,
    //   label: "УС буцалгагч",
    // },
    // {
    //   id: "kitchen1",
    //   showToggle: true,
    //   showLighIcon: true,
    //   label: "Kitchen 1",
    // },
    // {
    //   id: "kitchen2",
    //   showToggle: true,
    //   showLighIcon: true,
    //   label: "Kitchen 2",
    // },
  ];

  const toggleCard = (index, clientId) => {
    const newLoadingStates = [...loadingStates];
    newLoadingStates[index] = true;
    setLoadingStates(newLoadingStates);

    axios
      .post(`http://localhost:3000/status/toggle/${clientId}`, null, {
        headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
      })
      .then(() => {
        setDeviceStates((prev) => ({
          ...prev,
          [clientId]: !prev[clientId],
        }));
      })
      .catch((err) => {
        console.error("Toggle error:", err);
      })
      .finally(() => {
        newLoadingStates[index] = false;
        setLoadingStates([...newLoadingStates]);
      });
  };

  return (
    <div className="main-content">
      <div className="card-grid">
        {baseCards.map((card, index) => {
          return (
            <div key={index} className={`card ${card.style || ""}`}>
              <div className="card-text">{card.label}</div>

              {/* {card.showLighIcon && (
                <img
                  src={LightInactive}
                  alt="Light icon"
                  style={{
                    width: 30,
                    height: 30,
                    position: "absolute",
                    top: 10,
                    left: 10,
                    pointerEvents: "none",
                  }}
                />
              )}

              {card.z4 && (
                <div
                  style={{
                    position: "absolute",
                    top: 20,
                    right: 12,
                    fontSize: "12px",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontWeight: "bold",
                    color: "orange",
                  }}
                >
                  ON: 0 OFF: 12
                </div>
              )}

              {card.style === "anotherGreen" && (
                <div
                  style={{
                    position: "absolute",
                    top: 20,
                    left: 12,
                    fontSize: "20px",
                    color: "white",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontWeight: "bold",
                  }}
                >
                  O lux
                </div>
              )}

              {card.style === "salsan" && (
                <div
                  style={{
                    position: "absolute",
                    top: 20,
                    right: 12,
                    fontSize: "12px",
                    color: "orange",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontWeight: "bold",
                  }}
                >
                  Холболт салсан
                </div>
              )}

              {card.style === "inactive" && (
                <>
                  <img
                    src={inactive}
                    alt="Inactive Icon"
                    style={{
                      width: 30,
                      height: 30,
                      position: "absolute",
                      top: 10,
                      left: 10,
                      pointerEvents: "none",
                    }}
                  />
                </>
              )} */}

              {card.showToggle && (
                <button
                  className={`toggle-btn ${
                    deviceStates[card.id] ? "toggled" : ""
                  }`}
                  onClick={() => toggleCard(index, card.id)}
                  disabled={loadingStates[index]}
                >
                  {loadingStates[index] ? (
                    <div className="thumb loading-spinner"></div>
                  ) : (
                    <div className="thumb"></div>
                  )}
                </button>
              )}
              <Button
              className="auto"
                onClick={() => setAutomationVisible(true)}
                type="primary"
                style={{ width: "60px" }}
              >
                schedule
              </Button>

              <Modal
                title="Schedule Automation"
                open={automationVisible}
                onCancel={() => setAutomationVisible(false)}
                onOk={() => {
                  form.validateFields().then((values) => {
                    scheduleAutomation(values);
                    form.resetFields();
                    setAutomationVisible(false);
                  });
                }}
              >
                <Form form={form} layout="vertical">
                  <Form.Item
                    name="deviceId"
                    label="Select Device"
                    rules={[{ required: true }]}
                  >
                    <Select placeholder="Select a device">
                      {devices.map((d) => (
                        <Select.Option key={d.clientId} value={d.clientId}>
                          {d.clientId}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="action"
                    label="Action"
                    rules={[{ required: true }]}
                  >
                    <Select placeholder="Choose action">
                      <Select.Option value="on">Turn ON</Select.Option>
                      <Select.Option value="off">Turn OFF</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="time"
                    label="Time"
                    rules={[{ required: true }]}
                  >
                    <TimePicker format="HH:mm" />
                  </Form.Item>
                </Form>
              </Modal>

              {card.id === "VIOT_E99614" && (
                <div
                  style={{ marginTop: "8px", fontSize: "14px", color: "#fff" }}
                >
                  🌡 Температур:{" "}
                  {statusMap["VIOT_E99614"]?.data?.temperature ??
                    "Мэдээлэл алга"}{" "}
                  °C
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
