import React, { useState, useRef, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import "../../task1/Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faLock, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

function Reg() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);
  const [phoneError, setPhoneError] = useState("");

  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    specialChar: false,
    number: false,
    match: false,
  });
  const checkPasswordRequirements = (password, confirmPassword) => {
    const length = password.length >= 8 && password.length <= 15;
    const specialChar = /[@_*.\-!#$%^&+=]/.test(password);
    const number = /\d/.test(password);
    const match = password === confirmPassword && password !== "";
    setPasswordChecks({ length, specialChar, number, match });
  };
  const checkPhoneExists = async (phone) => {
    if (!phone) return false;
  };

  const onPasswordChange = (e) => {
    const password = e.target.value;
    const confirmPassword = form.getFieldValue("confirmPassword") || "";
    checkPasswordRequirements(password, confirmPassword);
  };

  const onConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    const password = form.getFieldValue("password") || "";
    checkPasswordRequirements(password, confirmPassword);
  };

  useEffect(() => {
    if (step === 2 && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, step]);
  const handlePhoneBlur = async () => {
    const phone = form.getFieldValue("phone");
    if (phone) {
      const exists = await checkPhoneExists(phone);
      if (exists) {
        setPhoneError("Утасны дугаар бүртгэлтэй байна");
      } else {
        setPhoneError("");
      }
    }
  };

  const handleSubmit = async (values) => {
    setError("");
    setPhoneError("");

    // Password validation checks as you already do
    if (values.password !== values.confirmPassword) {
      setError("Нууц үг таарахгүй байна");
      return;
    }

    if (
      !passwordChecks.length ||
      !passwordChecks.specialChar ||
      !passwordChecks.number ||
      !passwordChecks.match
    ) {
      setError("Нууц үгийн шаардлагыг бүрэн хангах ёстой");
      return;
    }

    try {
      const res = await axiosInstance.post("/user/signup", {
        name: values.name,
        phoneNumber: values.phone,
        password: values.password,
      });

      // Handle based on status code or error message
      if (res.status === 201) {
        // Success — OTP sent, proceed to step 2
        setUserData({
          phone: values.phone,
          name: values.name,
          password: values.password,
        });
        setStep(2);
        setCountdown(60);
        setError("");
        setPhoneError("");
        message.success("Код илгээгдлээ");
      } else if (res.status === 422) {
        setPhoneError(res.data.error || "Утасны дугаар бүртгэлтэй байна");
      } else {
        setError(res.data.error || "Код илгээхэд алдаа гарлаа");
      }
    } catch (err) {
      if (err.response?.status === 422) {
        setPhoneError(
          err.response.data.error || "Утасны дугаар бүртгэлтэй байна"
        );
      } else {
        console.error("Signup failed:", err.response?.data || err.message);
        setError("Серверийн алдаа");
      }
    }
  };

  const handleVerify = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      setError("6 оронтой код оруулна уу");
      return;
    }

    try {
      const res = await axiosInstance.post("/user/verify-otp", {
        phoneNumber: userData.phone,
        name: userData.name,
        password: userData.password,
        otp: fullOtp,
        action: "verify",
      });

      if (res.data.message?.toLowerCase().includes("verified")) {
        message.success("Бүртгэл амжилттай");
        navigate("/login");
      } else {
        setError("OTP буруу байна");
      }
    } catch (err) {
      setError("Сүлжээний алдаа");
    }
  };

  const resendOtp = async () => {
    try {
      await axiosInstance.post("/user/verify-otp", {
        phoneNumber: userData.phone,
        action: "resend",
      });
      setCountdown(60);
      message.success("Код дахин илгээгдлээ");
    } catch {
      message.error("Код илгээхэд алдаа гарлаа");
    }
  };

  const handleOtpChange = (e, idx) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val.slice(-1);
    setOtp(newOtp);
    if (val && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  return (
    <div className="login-layout">
      <div className="reg-container">
        <div>
          <h1 style={{ marginTop: "100px" }}>Бүртгүүлэх</h1>
          <span 
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer", position:"absolute", top:"11px", left:"30px"}}
          >
            <FontAwesomeIcon icon={faAngleLeft}/> back
          </span>
        </div>
        {step === 1 && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            style={{ width: "100%", maxWidth: 400 }}
          >
            <Form.Item
              label="Утасны дугаар"
              name="phone"
              rules={[{ required: true, message: "Утасны дугаар оруулна уу" }]}
              validateStatus={phoneError ? "error" : ""}
              help={phoneError || ""}
            >
              <Input
                placeholder="Утасны дугаар"
                className="regBtn"
                prefix={
                  <FontAwesomeIcon
                    icon={faPhone}
                    style={{ color: "#aaa", fontSize: "13px" }}
                  />
                }
                onBlur={handlePhoneBlur}
              />
            </Form.Item>

            <Form.Item
              label="Нэр"
              name="name"
              rules={[{ required: true, message: "Нэрээ оруулна уу" }]}
            >
              <Input
                placeholder="Нэр"
                className="regBtn"
                prefix={
                  <FontAwesomeIcon
                    icon={faUser}
                    style={{ color: "#aaa", fontSize: "13px" }}
                  />
                }
              />
            </Form.Item>

            <Form.Item
              label="Нууц үг"
              name="password"
              rules={[{ required: true, message: "Нууц үг оруулна уу" }]}
            >
              <Input.Password
                placeholder="Нууц үг"
                className="regBtn"
                prefix={
                  <FontAwesomeIcon
                    icon={faLock}
                    style={{ color: "#aaa", fontSize: "13px" }}
                  />
                }
                onChange={onPasswordChange}
              />
            </Form.Item>

            <Form.Item
              label="Нууц үг давтах"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Нууц үгээ дахин оруулна уу" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Нууц үг таарахгүй байна");
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Нууц үг давтах"
                className="regBtn"
                prefix={
                  <FontAwesomeIcon
                    icon={faLock}
                    style={{ color: "#aaa", fontSize: "13px" }}
                  />
                }
                onChange={onConfirmPasswordChange}
              />
            </Form.Item>

            {error && <p style={{ color: "red" }}>{error}</p>}
            <div style={{ marginTop: 8, fontSize: 14 }}>
              <div>
                {passwordChecks.length ? (
                  <CheckOutlined style={{ color: "green" }} />
                ) : (
                  <CloseOutlined style={{ color: "red" }} />
                )}
                <span> 8-15 урттай байх</span>
              </div>
              <div>
                {passwordChecks.specialChar ? (
                  <CheckOutlined style={{ color: "green" }} />
                ) : (
                  <CloseOutlined style={{ color: "red" }} />
                )}
                <span> @ _ * . гэх мэт тусгай тэмдэгт оруулах</span>
              </div>
              <div>
                {passwordChecks.number ? (
                  <CheckOutlined style={{ color: "green" }} />
                ) : (
                  <CloseOutlined style={{ color: "red" }} />
                )}
                <span> Тоо орсон байх</span>
              </div>
              <div>
                {passwordChecks.match ? (
                  <CheckOutlined style={{ color: "green" }} />
                ) : (
                  <CloseOutlined style={{ color: "red" }} />
                )}
                <span> Нууц үг тохирч байна</span>
              </div>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                className="loginbtn"
              >
                Бүртгүүлэх
              </Button>
            </Form.Item>
          </Form>
        )}

        {step === 2 && (
          <>
            <p>{userData.phone} дугаарт илгээсэн кодыг оруулна уу</p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginBottom: "15px",
              }}
            >
              {otp.map((digit, idx) => (
                <Input
                  key={idx}
                  value={digit}
                  maxLength={1}
                  ref={(el) => (inputsRef.current[idx] = el)}
                  onChange={(e) => handleOtpChange(e, idx)}
                  style={{
                    width: "40px",
                    textAlign: "center",
                    fontSize: "18px",
                  }}
                />
              ))}
            </div>
            {countdown > 0 ? (
              <p>{countdown} сек дараа дахин илгээх боломжтой</p>
            ) : (
              <Button type="link" onClick={resendOtp}>
                Код дахин илгээх
              </Button>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <Button
              type="primary"
              block
              onClick={handleVerify}
              className="loginbtn"
              disabled={otp.join("").length !== 6}
            >
              Баталгаажуулах
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default Reg;
