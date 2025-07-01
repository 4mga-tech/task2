import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Form, Input } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faLock } from "@fortawesome/free-solid-svg-icons";

function ResetPassword() {
  const [form] = Form.useForm();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  // const otp = location.state?.otp;
  const resetToken = location.state?.resetToken;
  const phoneNumber = location.state?.phoneNumber;
  // const [newPassword, setNewPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const handleReset = async () => {
    setError("");

    const values = form.getFieldsValue();

    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await axiosInstance.post("/user/reset-password", {
        phoneNumber,
        resetToken,
        newPassword: values.password,
        action: "verify",
      });

      if (res.data.message) {
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
        <div>
          <div>
            <span
              onClick={() => navigate("/reset")}
              style={{
                cursor: "pointer",
                position: "absolute",
                top: "11px",
                left: "30px",
              }}
            >
              <FontAwesomeIcon icon={faAngleLeft} /> Буцах
            </span>
          </div>
        </div>
        <h1>Set New Password</h1>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleReset}
          style={{ width: "100%", maxWidth: 400 }}
        >
          <Form.Item
            label="New Password"
            name="password"
            rules={[{ required: true, message: "Please enter new password" }]}
          >
            <Input.Password
              className="regBtn"
              prefix={
                <FontAwesomeIcon
                  icon={faLock}
                  style={{ color: "#aaa", fontSize: "13px" }}
                />
              }
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              { required: true, message: "Please confirm your password" },
            ]}
          >
            <Input.Password
              className="regBtn"
              prefix={
                <FontAwesomeIcon
                  icon={faLock}
                  style={{ color: "#aaa", fontSize: "13px" }}
                />
              }
            />
          </Form.Item>

          {error && (
            <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
          )}
          {success && (
            <div style={{ color: "green", marginBottom: "10px" }}>
              {success}
            </div>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" className="loginbtn" block>
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default ResetPassword;