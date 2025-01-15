import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button"; // 作成したButtonコンポーネントをインポート
import logo from "../outfit_logo_black.png"; // PNGの透過画像をインポート

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
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
  },
  logo: {
    width: "500px",  // 画像の大きさを設定
    height: "auto",  // 高さを自動で調整
    marginBottom: "20px",  // ロゴと次の要素の間隔を調整
  },
 
};

export default Start;
