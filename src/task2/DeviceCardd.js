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
  return (
    <div
      className={`card gray-card ${!deviceState ? "default" : ""}`}
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
        <img src={Linactive} alt="Linactive" className="Linactive-icon" />
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

      {card.category === "temperature & humidity sensor" ||
      card.label.toLowerCase().includes("temperature & humidity sensor") ? (
        <div style={{ marginTop: "8px", fontSize: "14px", color: "rgb(233, 98, 98)" }}>
          {deviceState ? (
            <>
              🌡 Температур: {statusData?.temperature ?? "Мэдээлэл алга"} °C
              <br />
              💧 Чийгшил: {statusData?.humidity ?? "Мэдээлэл алга"} %
            </>
          ) : (
            <>Унтарсан</>
          )}
        </div>
      ) : card.id === "VIOT_E99614" ? (
        <div style={{ marginTop: "8px", fontSize: "14px", color: "rgb(234, 206, 58)" }}>
          🌡 Температур:{" "}
          {deviceState
            ? statusData?.temperature ?? "Мэдээлэл алга"
            : "Унтарсан"}{" "}
          °C
        </div>
      ) : null}
    </div>
  );
}

export default DeviceCardd;
