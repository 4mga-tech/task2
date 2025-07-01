import React, { useState, useContext } from "react";
import { Button, Modal, Input, Form, message } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "./UserContext";
import axiosInstance from "./axiosInstance";
import Cookies from "js-cookie";
import "../task2/Profile.css";

function Profile() {
  const { userName, userPhone, logout, setUserName } = useContext(UserContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    specialChar: false,
    number: false,
    match: false,
  });
  const [form] = Form.useForm();

  const checkPasswordRequirements = (password, confirmPassword) => {
    const length = password.length >= 8 && password.length <= 15;
    const specialChar = /[@_*.\-!#$%^&+=]/.test(password);
    const number = /\d/.test(password);
    const match = password === confirmPassword && password !== "";
    setPasswordChecks({ length, specialChar, number, match });
  };

  const onPasswordChange = () => {
    const password = form.getFieldValue("newPassword") || "";
    const confirmPassword = form.getFieldValue("confirmPassword") || "";
    checkPasswordRequirements(password, confirmPassword);
  };

  async function updateUserName(newName, currentPassword, token) {
    try {
      const response = await axiosInstance.patch(
        "/user/change-name",
        { name: newName, password: currentPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to update name";
    }
  }

  async function updateUserPassword(currentPassword, newPassword, token) {
    if (currentPassword === newPassword) {
      throw new Error(
        "Шинэ нууц үг нь хуучин нууц үгтэй адил байна. Өөр нууц үг сонгоно уу."
      );
    }
    try {
      const response = await axiosInstance.patch(
        "/user/change-password",
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to update password";
    }
  }

  const openModal = (type) => {
    setModalType(type);
    if (type === "name") {
      form.setFieldsValue({ newName: userName, currentPassword: "" });
    } else {
      form.resetFields();
      setPasswordChecks({
        length: false,
        specialChar: false,
        number: false,
        match: false,
      });
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setModalType(null);
    form.resetFields();
    setPasswordChecks({
      length: false,
      specialChar: false,
      number: false,
      match: false,
    });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const token = Cookies.get("token");

      if (modalType === "name") {
        const { newName, currentPassword } = values;
        const result = await updateUserName(newName, currentPassword, token);
        message.success(result.message || "Нэр амжилттай шинэчлэгдлээ.");
        setUserName(newName);
        Cookies.set("userName", newName, { path: "/" });
      } else if (modalType === "password") {
        const { currentPassword, newPassword } = values;

        if (
          !passwordChecks.length ||
          !passwordChecks.specialChar ||
          !passwordChecks.number ||
          !passwordChecks.match
        ) {
          message.error("Нууц үгийн шаардлагуудыг хангуулаарай.");
          return;
        }

        const result = await updateUserPassword(
          currentPassword,
          newPassword,
          token
        );
        message.success(result.message || "Нууц үг амжилттай шинэчлэгдлээ.");
      }

      setIsModalVisible(false);
      setModalType(null);
      form.resetFields();
      setPasswordChecks({
        length: false,
        specialChar: false,
        number: false,
        match: false,
      });
    } catch (error) {
      const errorMsg = error?.message || error || "Алдаа гарлаа";
      message.error(errorMsg);
    }
  };

  return (
    <div className="profile-content">
      <div className="profile-left">
        <div className="left-header">
          <SettingOutlined
            className="profile-icon"
            style={{ color: "green" }}
          />
          <span style={{ fontSize: "30px" }}>Профайл</span>
        </div>
        <div className="row">
          <div
            className="box left-top"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src="images/prof.svg"
                alt="profile"
                style={{ marginRight: 16 }}
              />
              <div>
                <p style={{ color: "black", marginBottom: 0 }}>{userName}</p>
                <p style={{ color: "gray", marginBottom: 0 }}>{userPhone}</p>
              </div>
            </div>
            <div>
              <Button
                style={{
                  border: "1px solid gray",
                  borderRadius: "30px",
                  height: "40px",
                }}
                onClick={() => openModal("name")}
              >
                Нэр солих
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                  border: "1px solid gray",
                  borderRadius: "30px",
                  height: "40px",
                }}
                onClick={() => openModal("password")}
              >
                Нууц үг солих
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-right">
        <div className="section-box">
          <div className="section-header">
            <p className="section-title">Миний байшингууд</p>
            <Button className="add-btn" type="primary" size="small">
              <FontAwesomeIcon
                icon={faHeartCirclePlus}
                style={{ color: "green" }}
              />{" "}
              Шинэ байшин
            </Button>
          </div>
          <p className="section-subtitle">Нийт 3 байшин</p>
          <div className="house-list">
            {[1, 2, 3].map((_, idx) => (
              <div className="house-card" key={idx}>
                <Button>
                  <img
                    src="/images/home.png"
                    alt="home"
                    style={{ height: "20px" }}
                  />
                  <div>
                    <p>Сүнстэй байшин</p>
                    <p>1 өрөө</p>
                  </div>
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="box right-bottom">
          <div>
            <Button className="share-btn">
              <img
                src="/images/device.svg"
                style={{ height: "20px" }}
                alt="device"
              />{" "}
              төхөөрөмж хуваалцах
            </Button>
            <Button className="share-btn">
              <img src="/images/Union.svg" alt="req" /> Санал хүсэлт
            </Button>
            <Button className="share-btn">
              <img src="/images/Union.svg" alt="sug" /> Заавар
            </Button>
            <Button className="share-btn" onClick={logout}>
              <img src="/images/log2.svg" alt="logout" /> Гарах
            </Button>
          </div>
        </div>
      </div>

      <Modal
        title={modalType === "name" ? "Нэр засах" : "Нууц үг солих"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Хадгалах"
        cancelText="Буцах"
      >
        <Form
          form={form}
          layout="vertical"
          name="editProfileForm"
          onValuesChange={() => {
            if (modalType === "password") onPasswordChange();
          }}
        >
          {modalType === "name" && (
            <>
              <Form.Item
                label="Шинэ нэр"
                name="newName"
                rules={[{ required: true, message: "Нэр оруулна уу!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Одоогийн нууц үг"
                name="currentPassword"
                rules={[{ required: true, message: "Нууц үгээ оруулна уу!" }]}
              >
                <Input.Password />
              </Form.Item>
            </>
          )}

          {modalType === "password" && (
            <>
              <Form.Item
                label="Одоогийн нууц үг"
                name="currentPassword"
                rules={[
                  { required: true, message: "Одоогийн нууц үгээ оруулна уу!" },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Шинэ нууц үг"
                name="newPassword"
                rules={[
                  { required: true, message: "Шинэ нууц үгээ оруулна уу!" },
                  {
                    min: 8,
                    message: "Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой",
                  },
                  {
                    max: 15,
                    message: "Нууц үг хамгийн ихдээ 15 тэмдэгт байх ёстой",
                  },
                  {
                    pattern: /[@_*.\-!#$%^&+=]/,
                    message: "Нууц үг тусгай тэмдэгт агуулсан байх ёстой",
                  },
                  {
                    pattern: /\d/,
                    message: "Нууц үг тоо агуулсан байх ёстой",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Шинэ нууц үг давтах"
                name="confirmPassword"
                dependencies={["newPassword"]}
                rules={[
                  { required: true, message: "Нууц үгээ давтан оруулна уу!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Нууц үг таарахгүй байна!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            </>
          )}
        </Form>

        {modalType === "password" && (
          <div style={{ marginTop: 12, fontSize: 14, color: "#555" }}>
            <p style={{ color: passwordChecks.length ? "green" : "red" }}>
              • Нууц үг урт: 8-15 тэмдэгт
            </p>
            <p style={{ color: passwordChecks.specialChar ? "green" : "red" }}>
              • Тусгай тэмдэгт (@_*.-!#$%^&+=) агуулах
            </p>
            <p style={{ color: passwordChecks.number ? "green" : "red" }}>
              • Тоо агуулах
            </p>
            <p style={{ color: passwordChecks.match ? "green" : "red" }}>
              • Нууц үг давтах таарах
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Profile;
