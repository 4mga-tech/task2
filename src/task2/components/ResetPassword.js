import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const phoneNumber = location.state?.phoneNumber;

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
     const res = await axiosInstance.post("http://localhost:3001/otp/reset_password", {
        phoneNumber,
        newPassword,
      });

      if (res.data.success) {
        setSuccess("Password reset successful!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(res.data.message || "Password reset failed.");
      }
    } catch (err) {
      setError("Server error. Try again.");
    }
  };

  return (
    <div className="login-layout">
      <div className="reg-container">
        <h1>Set New Password</h1>
        <form onSubmit={handleReset}>
          <div className="input">
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="input">
            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <div style={{ color: "red" }}>{error}</div>}
          {success && <div style={{ color: "green" }}>{success}</div>}
          <button className="loginbtn" type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
