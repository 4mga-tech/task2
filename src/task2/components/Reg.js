import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "../../task1/Login.css";
import { Button, Form, Input } from "antd";

function Reg() {
  const [phoneForVerify, setPhoneForVerify] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleRegister = async (values) => {
    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      console.log("register values:", values);
      const res = await axiosInstance.post("/user/signup", {
        name: values.username,
        email: values.email,
        phoneNumber: values.phone,
        password: values.password,
      });

      console.log("Signup response:", res.data);

      if (res.data.message?.toLowerCase().includes("otp")) {
        setPhoneForVerify(values.phone);
        setStep(2);
        setError("");
      } else {
        setError(res.data.message || "OTP not sent");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Error sending OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      console.log("Sending verify request:", {
        phoneNumber: phoneForVerify,
        otp: otp.trim(),
      });

      const res = await axiosInstance.post("/user/verify-otp", {
        phoneNumber: phoneForVerify,
        otp: otp.trim(),
      });

      console.log("Verify response:", res.data);

      if (res.data.message?.toLowerCase().includes("verified")) {
        navigate("/login");
      } else {
        setError("Incorrect OTP");
      }
    } catch (err) {
      console.error("Verification error:", err);
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

        <Form
          form={form}
          layout="vertical"
          onFinish={step === 1 ? handleRegister : handleVerifyOtp}
          style={{ width: "100%", maxWidth: 400 }}
        >
          {step === 1 ? (
            <>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: "Please enter your phone" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Invalid email" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: "Please enter a username" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter a password" }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Repeat Password"
                name="confirmPassword"
                rules={[
                  { required: true, message: "Please confirm your password" },
                ]}
              >
                <Input.Password />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item label="OTP Code">
                <Input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.trim())}
                  placeholder="Enter OTP code"
                />
              </Form.Item>
            </>
          )}

          {error && (
            <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" className="loginbtn" block>
              {step === 1 ? "Send OTP" : "Verify OTP"}
            </Button>
          </Form.Item>
        </Form>

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
