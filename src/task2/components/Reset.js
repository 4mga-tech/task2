import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../task1/Login.css";
import { Form, Input, Button } from "antd";
import { MessageTwoTone } from "@ant-design/icons";
import { faPhone, faAngleLeft } from "@fortawesome/free-solid-svg-icons";

function Reset() {
  const [form] = Form.useForm();
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (values) => {
    const cleanedPhone = values.phone.trim();
    setPhone(cleanedPhone);
    setError("");

    try {
      const res = await axiosInstance.post("/user/reset-otp", {
        phoneNumber: cleanedPhone,
        action: "request",
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
  const [, setResendMessage] = useState("");

  const handleResendOtp = async () => {
    setError("");
    setResendMessage("");
    try {
      const res = await axiosInstance.post("/user/verify-reset-otp", {
        phoneNumber: phone,
        action: "resend",
      });
      if (res.status === 200) {
        setResendMessage("OTP дахин илгээгдлээ.");
      } else {
        setError(res.data.message || "Failed to resend OTP");
      }
    } catch (err) {
      setError("Failed to resend OTP");
    }
  };

  const handleVerifyOtp = async (values) => {
    console.log("Verifying OTP:", values);
    setError("");
    try {
      const res = await axiosInstance.post("/user/verify-reset-otp", {
        phoneNumber: phone,
        otp: values.otp,
        action: "verify",
      });

      if (res.data.resetToken) {
        navigate("/reset-password", {
          state: { phoneNumber: phone, resetToken: res.data.resetToken },
        });
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
        <h1>
          {step === 1 ? (
            <>
              <MessageTwoTone style={{ marginRight: 8 }} />
              Нууц үгээ мартсан
            </>
          ) : (
            "Код оруулна уу"
          )}
        </h1>

        {step === 2 && (
          <>
            <div
              onClick={handleResendOtp}
              style={{
                cursor: "pointer",
                color: "green",
                fontWeight: "bold",
                userSelect: "none",
                position: "absolute",
                bottom: "300px",
                right: "30px",
              }}
            >
              Код дахин илгээх
            </div>
          </>
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={step === 1 ? handleSendOtp : handleVerifyOtp}
          style={{ width: "100%", maxWidth: 400 }}
        >
          {step === 1 ? (
            <Form.Item
              label="Утасны дугаар"
              name="phone"
              rules={[
                { required: true, message: "Please enter your phone number" },
              ]}
            >
              <Input
                className="antBtn"
                placeholder="Утасны дугаар оруулна уу"
                prefix={
                  <FontAwesomeIcon
                    icon={faPhone}
                    style={{ color: "#aaa", fontSize: "13px" }}
                  />
                }
              />
            </Form.Item>
          ) : (
            <Form.Item
              maxLength={6}
              type="text"
              label="OTP Code"
              name="otp"
              rules={[{ required: true, message: "Please enter the OTP" }]}
            >
              <Input className="regBtn" style={{ marginBottom: "20px" }} />
            </Form.Item>
          )}

          {error && (
            <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="loginbtn"
              style={{ fontSize: "17px", marginTop: "10px" }}
            >
              {step === 1 ? "Үргэлжлүүлэх" : "Баталгаажуулах"}
            </Button>
          </Form.Item>
          <div>
            <span
              onClick={() => navigate("/login")}
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
        </Form>

        <div className="signup">
          <span
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer", fontSize: "17px" }}
          >
            Нэвтрэх
          </span>
        </div>
      </div>
    </div>
  );
}

export default Reset;
