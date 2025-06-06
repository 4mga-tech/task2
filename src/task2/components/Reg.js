import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "../../task1/Login.css";

function Reg() {
  const [form, setForm] = useState({
    phone: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axiosInstance.post(
        "http://localhost:3001/users/register",
        {
          name: form.username,
          email: form.email,
          phoneNumber: form.phone,
          password: form.password,
        }
      );

      if (res.data.success) {
        setStep(2);
        setError("");
      } else {
        setError(res.data.message || "OTP not sent");
      }
    } catch (err) {
      setError("Error sending OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("http://localhost:3001/otp/verify", {
        phoneNumber: form.phone,
        code: otp,
        authType: "verify",
      });

      if (res.data.success) {
        navigate("/login");
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
        <h1>{step === 1 ? "Register" : "Enter OTP"}</h1>

        <form onSubmit={step === 1 ? handleRegister : handleVerifyOtp}>
          {step === 1 ? (
            <>
              <div className="input">
                <label>Phone:</label>
                <br />
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <br />
              <div className="input">
                <label>Email:</label>
                <br />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <br />
              <div className="input">
                <label>Username:</label>
                <br />
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <br />
              <div className="input">
                <label>Password:</label>
                <br />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <br />
              <div className="input">
                <label>Repeat Password:</label>
                <br />
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
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
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer" }}
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
}

export default Reg;
