import "./Home.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import DeviceCardd from "./DeviceCardd";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Modal, Select, message } from "antd";
import dayjs from "dayjs";
import { TimePicker, DatePicker } from "antd";
import { Radio } from "antd";
function Home() {
  const [, setUserName] = useState("");
  const [automationDate, setAutomationDate] = useState(null);
  const [automationAction, setAutomationAction] = useState("on");
  const [deviceSelectVisible, setDeviceSelectVisible] = useState(false);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [automationModalVisible, setAutomationModalVisible] = useState(false);
  const [automationDevice, setAutomationDevice] = useState(null);
  const [automationTime, setAutomationTime] = useState([]);
  useState(null);

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
  const [loadingStates, setLoadingStates] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [baseCards, setBaseCards] = useState([]);
  const [, setCurrentTime] = useState(dayjs().format("HH:mm:ss"));
  const handleAutomationSave = () => {
    if (!automationDevice || automationTime.length !== 2 || !automationDate) {
      message.warning("Device, date, and time range are required");
      return;
    }

    const automation = {
      deviceId: automationDevice._id,
      date: automationDate.format("YYYY-MM-DD"),
      from: automationTime[0].format("HH:mm"),
      to: automationTime[1].format("HH:mm"),
      label: automationDevice.entity,
      action: automationAction,
    };

    const stored = JSON.parse(localStorage.getItem("automatedDevices") || "[]");

    const alreadyExists = stored.some(
      (item) => item.deviceId === automation.deviceId
    );
    if (alreadyExists) {
      message.warning("This device already has an automation.");
      return;
    }

    stored.push(automation);
    localStorage.setItem("automatedDevices", JSON.stringify(stored));

    handleAutomationSubmit(automation);

    message.success("Automation saved!");
    setAutomationModalVisible(false);
    setAutomationDevice(null);
    setAutomationTime([]);
  };

  const handleAutomationSubmit = async (automation) => {
    try {
      const token = Cookies.get("accessToken");

      const response = await axios.post(
        "http://localhost:3000/api/schedule/",
        {
          deviceId: automation.deviceId,
          action: automation.action,
          date: automation.date,
          fromTime: automation.from,
          toTime: automation.to,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success("Автоматжуулалт серверт илгээгдлээ!");
      console.log("✅ Scheduled on backend:", response.data);
    } catch (err) {
      console.error("❌ Failed to schedule on backend:", err);
      message.error("Сервертэй холбогдох үед алдаа гарлаа");
    }
  };

  useEffect(() => {
    const name = Cookies.get("userName");
    if (name) {
      setUserName(name);
    }
  }, []);
  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const savedCards = localStorage.getItem("baseCards");
    const parsedCards = savedCards ? JSON.parse(savedCards) : [];
    console.log("Token:", token);
    console.log("AccessToken:", Cookies.get("accessToken"));

    axios
      .get("http://localhost:3000/api/devices", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const deviceList = res.data;
        setAvailableDevices(deviceList);
        const tempHumidityDevices = deviceList.filter(
          (d) => d.category === "temperature & humidity sensor"
        );
        const registered = JSON.parse(
          localStorage.getItem("registeredDevices") || "[]"
        );
        const newCards = tempHumidityDevices
          .filter((d) => !parsedCards.find((c) => c.id === d._id))
          .filter((d) => registered.includes(d._id))
          .map((d) => ({
            id: d._id,
            showToggle: true,
            label: `${d.entity} - ${d.category}`,
          }));

        const mergedCards = [...parsedCards, ...newCards];
        setBaseCards(mergedCards);
        localStorage.setItem("baseCards", JSON.stringify(mergedCards));
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
          if (res.data) {
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

  const toggleCard = (index, id) => {
    const newLoadingStates = [...loadingStates];
    newLoadingStates[index] = true;
    setLoadingStates(newLoadingStates);

    axios
      .post(`http://localhost:3000/api/status/toggle/${id}`, null, {
        headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
      })
      .then((response) => {
        const newStatus = response?.data?.status?.status;

        if (newStatus !== undefined) {
          setDeviceStates((prev) => {
            const newState = newStatus === "on";
            addStatusLogEntry(id, newState);
            return {
              ...prev,
              [id]: newState,
            };
          });
        } else {
          message.error("Failed to retrieve the new status.");
        }

        newLoadingStates[index] = false;
        setLoadingStates([...newLoadingStates]);
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

  const removeCard = (id) => {
    setBaseCards((prev) => {
      const updated = prev.filter((card) => card.id !== id);
      localStorage.setItem("baseCards", JSON.stringify(updated));
      return updated;
    });
    setDeviceStates((prev) => {
      const updated = { ...prev };
      delete updated[id];
      localStorage.setItem("deviceStates", JSON.stringify(updated));
      return updated;
    });
    const registered = JSON.parse(
      localStorage.getItem("registeredDevices") || "[]"
    );
    const updatedRegistered = registered.filter((rid) => rid !== id);
    localStorage.setItem(
      "registeredDevices",
      JSON.stringify(updatedRegistered)
    );
  };

  return (
    <div className="main-content">
      <div className="left-section">
        <div className="choose">
          <div>
            <button>Бүгд</button>
          </div>
          <div>
            <button>Гал тогоо</button>
          </div>
          <div>
            <button>Жижиг Өрөө</button>
          </div>
          <div>
            {" "}
            <button>PpM</button>
          </div>
        </div>

        <div>
          <button
            className="add-device-btn"
            onClick={() => setDeviceSelectVisible(true)}
          >
            add device
          </button>
          <button
            className="add-device-btn"
            onClick={() => setAutomationModalVisible(true)}
          >
            Automation
          </button>
        </div>

        <div className="card-grid">
          {baseCards.map((card, index) => (
            <DeviceCardd
              key={card.id}
              card={card}
              deviceState={deviceStates[card.id]}
              statusData={statusMap[card.id]}
              loading={loadingStates[index]}
              onToggle={toggleCard}
              onRemove={removeCard}
              index={index}
            />
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

            const token = Cookies.get("accessToken");

            axios
              .post(
                `http://localhost:3000/api/devices/${selectedDevice._id}/register`,
                null,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              )
              .then((res) => {
                if (!baseCards.find((c) => c.id === selectedDevice._id)) {
                  const registered = JSON.parse(
                    localStorage.getItem("registeredDevices") || "[]"
                  );
                  if (!registered.includes(selectedDevice._id)) {
                    registered.push(selectedDevice._id);
                    localStorage.setItem(
                      "registeredDevices",
                      JSON.stringify(registered)
                    );
                  }

                  const newCard = {
                    id: selectedDevice._id,
                    style: "temp",
                    showToggle: true,
                    label: `${selectedDevice.entity} - ${selectedDevice.category}`,
                  };
                  setBaseCards((prev) => [...prev, newCard]);
                  message.success("Device registered and added");
                } else {
                  message.info("Device already added");
                }
                setDeviceSelectVisible(false);
                setSelectedDevice(null);
              })
              .catch((err) => {
                console.error("Failed to register device", err);
                message.error("Failed to register device");
              });
          }}
        >
          <Select
            style={{ width: "100%" }}
            placeholder="choose a dev"
            labelInValue
            value={selectedDevice ? selectedDevice._id : undefined}
            onChange={({ value }) => {
              const device = availableDevices.find((d) => d._id === value);
              console.log("Selected device from dropdown:", device);
              setSelectedDevice(device);
            }}
          >
            {availableDevices.map((device) => (
              <Select.Option key={device.clientId} value={device._id}>
                {device.deviceId} - {device.entity} / {device.category}
              </Select.Option>
            ))}
          </Select>
        </Modal>

        <Modal
          title="Select device & automation time"
          open={automationModalVisible}
          onCancel={() => setAutomationModalVisible(false)}
          onOk={handleAutomationSave}
        >
          <Select
            style={{ width: "100%", marginBottom: 16 }}
            placeholder="Choose a device"
            value={automationDevice?._id}
            onChange={(value) => {
              const found = availableDevices.find((d) => d._id === value);
              setAutomationDevice(found);
            }}
          >
            {availableDevices.map((device) => (
              <Select.Option key={device._id} value={device._id}>
                {device.deviceId} - {device.entity}
              </Select.Option>
            ))}
          </Select>

          <DatePicker
            style={{ width: "100%", marginBottom: 16 }}
            value={automationDate}
            onChange={(date) => setAutomationDate(date)}
            format="YYYY-MM-DD"
          />

          <TimePicker.RangePicker
            format="HH:mm"
            value={automationTime}
            onChange={(value) => setAutomationTime(value)}
          />
          <Radio.Group
            onChange={(e) => setAutomationAction(e.target.value)}
            value={automationAction}
            style={{ marginBottom: 16 }}
          >
            <Radio value="on">Асаах</Radio>
            <Radio value="off">Унтраах</Radio>
          </Radio.Group>
        </Modal>
      </div>
      <div className="right-section">
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
  );
}

export default Home;