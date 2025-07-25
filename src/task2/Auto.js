import React, { useEffect, useState } from "react";
import { Modal, Button, message } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import "../task2/Home.css";

function Auto() {
  const [, setUserName] = useState("");
  const [statusLog] = useState(() => {
    const saved = localStorage.getItem("statusLog");
    return saved ? JSON.parse(saved) : [];
  });

  const currentDate = dayjs().format("YYYY-MM-DD");

  const [automated, setAutomated] = useState([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState(null);

  const [, setAvailableDevices] = useState([]);
  const [automationHistory] = useState(() =>
    JSON.parse(localStorage.getItem("automationHistory") || "[]")
  );
  const [historyVisible, setHistoryVisible] = useState(false);

  useEffect(() => {
    const name = Cookies.get("userName");
    if (name) {
      setUserName(name);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("automatedDevices");
    if (saved) {
      setAutomated(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (!token) return;

    axios
      .get("http://localhost:3000/api/devices", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAvailableDevices(res.data))
      .catch((err) => console.error("Failed to fetch devices", err));
  }, []);

  const showDetailModal = (automation) => {
    setSelectedAutomation(automation);
    setDetailModalVisible(true);
  };

  const handleModalClose = () => {
    setDetailModalVisible(false);
    setSelectedAutomation(null);
  };

  const deleteAutomation = (id) => {
    Modal.confirm({
      title: "Та энэ автоматжуулалтыг устгахдаа итгэлтэй байна уу?",
      okText: "Тийм",
      cancelText: "Үгүй",
      onOk() {
        const updated = automated.filter((d) => d.deviceId !== id);
        setAutomated(updated);
        localStorage.setItem("automatedDevices", JSON.stringify(updated));
        message.success("Автоматжуулалт амжилттай устлаа");
      },
    });
  };
  // const handleReAutomation = (automation) => {
  //   const activeAutomations = automated.filter(
  //     (a) => !dayjs(`${a.date} ${a.to}`).isBefore(dayjs())
  //   );

  //   const isOverlapping = activeAutomations.some(
  //     (a) => a.deviceId === automation.deviceId
  //   );

  //   if (isOverlapping) {
  //     message.warning(
  //       "Энэ төхөөрөмж одоогоор идэвхтэй автоматжуулалттай байна."
  //     );
  //     return;
  //   }

  //   const newAutomation = {
  //     ...automation,
  //     date: dayjs().format("YYYY-MM-DD"), // set today
  //     // optionally set new time or reuse old time
  //   };

  //   const updated = [...automated, newAutomation];
  //   setAutomated(updated);
  //   localStorage.setItem("automatedDevices", JSON.stringify(updated));
  //   message.success("Автоматжуулалт дахин тохирлоо");
  // };

  return (
    <div className="main-content">
      <div className="Aleft-section">
        <h2>Automation Schedule</h2>{" "}
        {automated.length === 0 ? (
          <p>Автоматжуулалт алга байна.</p>
        ) : (
          <ul>
            {automated.map((d, i) => {
              // const isEnded = dayjs(`${d.date} ${d.to}`).isBefore(dayjs());
              return (
                <li
                  key={d.deviceId || i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 0",
                  }}
                >
                  <span>🛠 {d.label}</span>
                  <span>
                    📅 {d.date} ⏰ {d.from} to {d.to} →{" "}
                    {d.action === "on" ? "Асаах" : "Унтраах"} |{" "}
                    
                    <Button
                      type="link"
                      onClick={() => showDetailModal(d)}
                      aria-label="Дэлгэрэнгүй үзэх"
                    >
                      Дэлгэрэнгүй
                    </Button>
                    {/* {isEnded && (
                      <Button
                        type="link"
                        style={{ color: "#1890ff" }}
                        onClick={() => handleReAutomation(d)}
                      >
                        Дахин автоматжуулах
                      </Button>
                    )} */}
                    <Button
                      danger
                      type="link"
                      onClick={() => deleteAutomation(d.deviceId)}
                      style={{ marginLeft: 8 }}
                      aria-label="Автоматжуулалт устгах"
                    >
                      Устгах
                    </Button>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
        <Modal
          title="Automation Details"
          open={detailModalVisible}
          onCancel={handleModalClose}
          footer={[
            <Button
              key="close"
              onClick={handleModalClose}
              aria-label="Дэлгэрэнгүй хаах"
            >
              Хаах
            </Button>,
          ]}
        >
          {selectedAutomation && (
            <div>
              <p>
                <strong>Төхөөрөмж:</strong> {selectedAutomation.label}
              </p>
              <p>
                <strong>Үйлдлийн огноо:</strong> {selectedAutomation.date}
              </p>
              <p>
                <strong>Цаг:</strong> {selectedAutomation.from} -{" "}
                {selectedAutomation.to}
              </p>
              <p>
                <strong>Үйлдэл:</strong>{" "}
                {selectedAutomation.action === "on" ? "Асаах" : "Унтраах"}
              </p>
            </div>
          )}
        </Modal>
        <Modal
          title="Automation History"
          open={historyVisible}
          onCancel={() => setHistoryVisible(false)}
          footer={[
            <Button key="close" onClick={() => setHistoryVisible(false)}>
              Хаах
            </Button>,
          ]}
        >
          {automationHistory.length === 0 ? (
            <p>Түүх хоосон байна.</p>
          ) : (
            <ul style={{ paddingLeft: "0" }}>
              {automationHistory.map((item, i) => (
                <li key={i} style={{ marginBottom: "12px" }}>
                  <strong>🛠 {item.label}</strong>
                  <br />
                  {item.date} ⏰ {item.from} - {item.to} →{" "}
                  {item.action === "on" ? "Асаах" : "Унтраах"}{" "}
                  {item.daily && "(Өдөр бүр)"}
                  <br />
                  🕔 Дууссан: {dayjs(item.endedAt).format("YYYY-MM-DD HH:mm")}
                </li>
              ))}
            </ul>
          )}
        </Modal>
      </div>

      <div className="right-section">
        <div className="box-container">
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
                <li>Статусын өөрчлөлт алга байна</li>
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
