import "./Login.css";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../task2/axiosInstance";
import { Button, Form, Input } from "antd";
import Cookies from "js-cookie";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
function Login({ login }) {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Instance created by `useForm` is not connected")
    ) {
      return;
    }
    originalWarn(...args);
  };
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    const { phone, password } = values;
    try {
      const result = await axiosInstance.post(
        "user/login",
        { phoneNumber: phone, password },
        { withCredentials: true }
      );
      console.log("data", result.data);
      if (result.data.accessToken) {
        const user = result.data.user;
        Cookies.set("accessToken", result.data.accessToken);
        Cookies.set("userName", user.name);
        Cookies.set("userPhone", user.phoneNumber);
        Cookies.set("userId", user._id);
        Cookies.set("loginTime", Date.now());

        login(result.data.accessToken, user.name, user.phoneNumber);
        navigate("/");
      } else {
        setError(result.data.message || "aldaa zaasan2");
      }
    } catch (err) {
      setError("buruu bna");
    }
  };
  return (
    <div className="login-layout">
      <div className="container">
        <h1>
          <img
            src="/images/loginHead1.svg"
            alt="loginhead"
            className="loginHead"
          />
        </h1>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ width: "100%", maxWidth: 400 }}
          onFieldsChange={() => {
            setError("");
          }}
        >
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
              size="large"
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
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              className="antBtn"
              placeholder=" Нууц үгээ оруулна уу"
              size="large"
              prefix={
                <FontAwesomeIcon
                  icon={faLock}
                  style={{ color: "#aaa", fontSize: "13px" }}
                />
              }
            />
          </Form.Item>

          {error && (
            <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
          )}

          <div style={{ width: "100%", textAlign: "right" }}>
            <span
              className="forgot"
              onClick={() => navigate("/reset")}
              style={{ cursor: "pointer", color: "#1890ff" }}
            >
              Нууц үгээ мартсан уу?
            </span>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="loginbtn">
              <strong>Нэвтрэх</strong>
            </Button>
          </Form.Item>
        </Form>

        <div className="signup">
          <Button
            onClick={() => navigate("/reg")}
            style={{
              cursor: "pointer",
              border: "none",
              background: "transparent",
              boxShadow: "none",
            }}
          >
            <span>
              <strong>Шинээр бүртгүүлэх</strong>
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
