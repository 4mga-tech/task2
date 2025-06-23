import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "../../task1/Login.css";
import { Form, Input, Button } from "antd";
function Reset() {
  const [form] = Form.useForm();
  const [phone, setPhone] = useState("");
  // const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleSendOtp = async (values) => {
    const cleanedPhone = values.phone.trim();
    setPhone(cleanedPhone);
    setError("");

    try {
      const res = await axiosInstance.post("/user/request-reset-otp", {
        phoneNumber: cleanedPhone,
      });
      console.log("Otp req response:", res.data);

      if (res.status === 200) {
        setStep(2);
        form.resetFields();
      } else {
        setError(res.data.message || "Failed to send OTP");
      }
    } catch (err) {
      if (err.response) {
        setError(
          `Error sending OTP: ${err.response.data.message || err.message}`
        );
      } else {
        setError("Error sending OTP");
      }
    }
  };

  const handleVerifyOtp = async (values) => {
    setError("");
    try {
      const res = await axiosInstance.post("/user/reset-verify-otp", {
        phoneNumber: phone,
        otp: values.otp,
      });

      if (res.data.resetToken) {
        navigate("/reset-password", {
          state: { phoneNumber: phone, resetToken:res.data.resetToken },
        });
      } else {
        setError("Incorrect OTP");
      }
    } catch (err) {
      setError("Verification failed");
    }
  };
  // console.log("Current step:", step);

  return (
    <div className="login-layout">
      <div className="reg-container">
        <div className="font">
          <FontAwesomeIcon icon={faXmark} />
        </div>
        <h1>{step === 1 ? "Reset Password" : "Enter OTP"}</h1>

        <Form
          form={form}
          layout="vertical"
          onFinish={step === 1 ? handleSendOtp : handleVerifyOtp}
          style={{ width: "100%", maxWidth: 400 }}
        >
          {step === 1 ? (
            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[
                { required: true, message: "Please enter your phone number" },
              ]}
            >
              <Input />
            </Form.Item>
          ) : (
            <Form.Item
              maxLength={6}
              type="text"
              label="OTP Code"
              name="otp"
              rules={[{ required: true, message: "Please enter the OTP" }]}
            >
              <Input />
            </Form.Item>
          )}

          {error && (
            <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" block className="loginbtn">
              {step === 1 ? "Send OTP" : "Verify OTP"}
            </Button>
          </Form.Item>
        </Form>

        <div className="signup">
          Remember password?{" "}
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

export default Reset;
