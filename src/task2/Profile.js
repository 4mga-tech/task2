import { Button } from "antd";
import "../task2/Profile.css";
import { SettingOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { UserContext } from "./UserContext";
// import { faRightLong } from "@fortawesome/free-solid-svg-icons";
function Profile() {
    const {userName, logout} = useContext(UserContext);
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
          <div className="box left-top">
            <div className="top-item">
              <img src="images/prof.svg" alt="profile" />
              <div>
                <p style={{ color: "black" }}>{userName}</p>
                <p style={{ color: "gray" }}>{89808814}</p>
              </div>
            </div>
            <Button
              style={{
                marginBottom: "20px",
                border: "1px solid gray",
                borderRadius: "30px",
                height: "50px",
              }}
            >
              <SettingOutlined style={{ fontSize: "20px", color: "green" }} />{" "}
              Хувийн мэдээлэл
            </Button>
          </div>
          <div className="box right-top">
            <p style={{ marginTop: "0", fontSize: "16px" }}>Төлбөрийн багц</p>
            <div
              style={{
                backgroundColor: "rgba(21, 41, 75, 1)",
                borderRadius: "10px",
                height: "50vh",
                width: "250px",
              }}
            >
              <div className="premium-box">
                <p
                  style={{
                    fontSize: "20px",
                    color: "rgb(57 181 74)",
                    margin: "0",
                  }}
                >
                  Premium
                </p>

                <p style={{ fontSize: "15px" }}>2025.07.01 хүртэл идэвхтэй</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row" style={{ marginBottom: "50px" }}>
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
              <div className="house-card">
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
              <div className="house-card">
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
              <div className="house-card">
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
            </div>
          </div>

          <div className="box right-bottom">
            <div>
              <Button className="share-btn">
                <img src="/images/device.svg" style={{ height: "20px" }} alt="device" />{" "}
                төхөөрөмж хуваалцах
              </Button>
              <Button className="share-btn">
                <img src="/images/Union.svg"  alt="req"/> Санал хүсэлт
              </Button>
              <Button className="share-btn">
                <img src="/images/Union.svg" alt="sug"/> Заавар
              </Button>
              <Button className="share-btn" onClick={logout}>
                {" "}
                <img src="/images/log2.svg"  alt="logout"/> Гарах
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="profile-right">
        <h1 style={{ width: "30vw" }}>5</h1>
      </div>
    </div>
  );
}

export default Profile;
