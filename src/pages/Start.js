import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button"; // 作成したButtonコンポーネントをインポート
import logo from "../outfit_logo_black.png"; // PNGの透過画像をインポート
import MarginBoxHeight from "../components/MarginBox";
import { width } from "@fortawesome/free-solid-svg-icons/fa0";

const Start = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* PNG画像を中央に配置 */}
      <img src={logo} alt="App Logo" style={styles.logo} />
      {/* ボタンを中央揃えにする */}
      <div style={styles.buttonContainer}></div>
      <Button onClick={() => navigate("/sign-up")} styleType="primary">
        新規登録
      </Button>
      <Button onClick={() => navigate("/log-in")} styleType="primary">
        ログイン
      </Button>
      <div
        style={{ marginTop: "40px", display: "flex", justifyContent: "center" }}
      >
        <div style={styles.hangerRow}>
          {Array.from({ length: 8 }).map((_, index) => (
            <img
              key={index}
              src="/assets/hangar.png"
              alt="Hanger"
              style={styles.hangerImage}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    margin: "96px 50px 50px 50px",
  },
  logo: {
    width: "600px", // 画像の大きさを設定
    height: "auto", // 高さを自動で調整
    marginBottom: "20px", // ロゴと次の要素の間隔を調整
  },
  hangerRow: {
    display: "flex",
    justifyContent: "space-between", // 画像間のスペースを均等配置
    alignItems: "center",
    padding: "20px", // 全体の余白
  },
  hangerImage: {
    width: "50px",
    height: "auto",
    margin: "0 10px",
  },
};

export default Start;
