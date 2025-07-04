import React from "react";
import Linactive from "../icons/Linactive.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "./DeviceCard.css";

function DeviceCardd({
  card,
  deviceState,
  statusData,
  loading,
  onToggle,
  onRemove,
  index,
}) {
  let temperature = null;
  let humidity = null;
  let dewPoint = null;

  if (statusData) {
    try {
      const payload = statusData.rawPayload
        ? statusData.rawPayload
        : statusData.payload
        ? JSON.parse(statusData.payload)
        : null;

      if (payload) {
        if (
          card.category === "temperature & humidity sensor" ||
          card.label.toLowerCase().includes("temperature & humidity sensor")
        ) {
          temperature = payload.SI7021?.Temperature ?? null;
          humidity = payload.SI7021?.Humidity ?? null;
          dewPoint = payload.SI7021?.DewPoint ?? null;
        } else if (
          card.category === "temperature sensor" ||
          card.id === "VIOT_E99614"
        ) {
          const sensorKey = Object.keys(payload).find(
            (k) =>
              k.toLowerCase().includes("ds18b20") ||
              k.toLowerCase().includes("temperature")
          );
          if (sensorKey) {
            temperature = payload[sensorKey]?.Temperature ?? null;
          }
        }
      }
    } catch (err) {
      console.error("Error parsing telemetry payload:", err);
    }
  }
  // console.log("🧪 Card Info:", card);

  return (
    <div
      className={`card ${!deviceState ? "default" : "toggled"}`}
      key={card.id}
    >
      <button
        className="remove-btn"
        onClick={() => onRemove(card.id)}
        title="Remove card"
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>

      {!deviceState && (
        <img src={Linactive} alt="Disconnected" className="Linactive-icon" />
      )}

      <div className="card-text">{card.label}</div>

      {card.showToggle && (
        <button
          className={`toggle-btn ${deviceState ? "toggled" : ""} ${
            loading ? "loading" : ""
          }`}
          onClick={() => onToggle(index, card.id)}
          disabled={loading}
          title={loading ? "Түр хүлээнэ үү..." : ""}
        >
          <div className="thumb">
            {loading && <div className="spinner"></div>}
          </div>
        </button>
      )}

      {(card.category === "temperature & humidity sensor" ||
        card.label.toLowerCase().includes("temperature & humidity sensor")) && (
        <div
          style={{
            marginTop: "8px",
            fontSize: "14px",
            color: "rgb(255, 255, 255)",
          }}
        >
          {deviceState ? (
            <>
              🌡 Температур: {temperature ?? "Мэдээлэл алга"} °C
              <br />
              💧 Чийгшил: {humidity ?? "Мэдээлэл алга"} %
              {dewPoint !== null && (
                <>
                  <br />
                  💧 Дью Поинт: {dewPoint} °C
                </>
              )}
            </>
          ) : (
            <div style={{ color: "rgb(234, 206, 58)" }}>Холболтоос салсан</div>
          )}
        </div>
      )}

      {/* {card.style === "temp" && card.id !== "VIOT_E99614" && (
        <div
          style={{
            marginTop: "8px",
            fontSize: "14px",
            color: "rgb(234, 206, 58)",
          }}
        >
          {deviceState ? (
            <>🌡 Температур: {temperature ?? "Мэдээлэл алга"} °C</>
          ) : (
            <div style={{ color: "rgb(255, 208, 0)" }}>Холболтоос салсан</div>
          )}
        </div>
      )} */}
    </div>
  );
}

export default DeviceCardd;
