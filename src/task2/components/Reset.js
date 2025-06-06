import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "../../task1/Login.css";

function Reset() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
  e.preventDefault();
  setError("");
    console.log("Sending phoneNumber:", phone);

  try {
    const res = await axiosInstance.post("/otp/forgot_pass", {
      phoneNumber: phone.trim(),
      // authType: "reset",
    });

    if (res.data.success) {
      setStep(2);
    } else {
      setError(res.data.message || "Failed to send OTP");
    }
  } catch (err) {
    if (err.response) {
      setError(`Error sending OTP: ${err.response.data.message || err.message}`);
    } else {
      setError("Error sending OTP");
    }
  }
};


  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axiosInstance.post("/otp/verify_reset", {
        phoneNumber: phone,
        code: otp,
        // authType: "reset",
      });

      if (res.data.success) {
        navigate("/reset-password",{ state: { phoneNumber: phone } });
      } else {
        setError("Incorrect OTP");
      }
    } catch (err) {
      setError("Verification failed");
    }
  };

  return (
    <div className="login-layout">
      <div className="reg-container">
        <div className="font">
          <FontAwesomeIcon icon={faXmark} />
        </div>
        <h1>{step === 1 ? "Reset Password" : "Enter OTP"}</h1>

        <form onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp}>
          {step === 1 ? (
            <div className="input">
              <label>Phone Number:</label>
              <br />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          ) : (
            <div className="input">
              <label>OTP Code:</label>
              <br />
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
          )}

          {error && (
            <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
          )}
          <button className="loginbtn" type="submit">
            {step === 1 ? "Send OTP" : "Verify OTP"}
          </button>
        </form>

        <div className="signup">
          Remember password?{" "}
          <span onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>
            Login
          </span>
        </div>
      </div>
    </div>
  );
}

export default Reset;
