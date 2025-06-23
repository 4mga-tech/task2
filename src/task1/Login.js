import "./Login.css";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../task2/axiosInstance";
import { Button, Form, Input } from "antd";
import Cookies from "js-cookie";

function Login({ login }) {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onFinish = async (values) => {
  const { email, password } = values;
  try {
    const result = await axiosInstance.post(
      "http://localhost:3000/api/user/login",
      { email, password },
      { withCredentials: true }
    );
    console.log("data", result.data);
    if (result.data.accessToken) {
      const user = result.data.user;
      Cookies.set("accessToken", result.data.accessToken);
      Cookies.set("userName", user.name);
      Cookies.set("userEmail", user.email);
      Cookies.set("userId", user._id);
      Cookies.set("loginTime", Date.now());

      login();
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
        <div className="font">
          <FontAwesomeIcon icon={faXmark} />
        </div>
        <h1>Login Form</h1>
        <Form
          layout="vertical"
          onFinish={onFinish}
          style={{ width: "100%", maxWidth: 400 }}
        >
          <Form.Item
            label="Email or phone"
            name="email"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password size="large" />
          </Form.Item>

          {error && (
            <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
          )}

          <div
            className="forgot"u
            onClick={() => navigate("/reset")}
            style={{ cursor: "pointer" }}
          >
            Forgot Password?
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="loginbtn" block>
              Login
            </Button>
          </Form.Item>
        </Form>

        <div className="signup">
          Not a Member?{" "}
          <span onClick={() => navigate("/reg")} style={{ cursor: "pointer" }}>
            Signup now
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
