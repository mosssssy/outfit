import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button"; // 作成したButtonコンポーネントをインポート
import logo from "../outfit_logo_black.png"; // PNGの透過画像をインポート
import MarginBoxHeight from "../components/MarginBox";
import { width } from "@fortawesome/free-solid-svg-icons/fa0";
import hanger from "../hanger.png";

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
      {/* 添付画像を横一列に並べる */}
      <div style={styles.imageRow}>
        {[...Array(10)].map((_, index) => (
          <img
            key={index}
            src={hanger}
            alt={`Hanger ${index + 1}`}
            style={styles.hangerImage}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    margin: "50px 50px 50px 50px",
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
  buttonContainer: {
    display: "flex", // フレックスボックスを有効化
    flexDirection: "column", // ボタンを縦に並べる
    alignItems: "center", // 中央揃え
    gap: "10px", // ボタン間の間隔
    marginBottom: "30px", // 下の画像との間隔
  },
  imageRow: {
    display: "flex", // フレックスボックスを有効化
    justifyContent: "center", // 横方向の中央揃え
    gap: "20px", // 各画像間の間隔を設定
    marginTop: "80px", // 上部との間隔
    overflow: "hidden", // 親要素からはみ出した部分を非表示
  },
  hangerImage: {
    width: "125px", // 画像の幅を指定
    height: "auto", // 高さを自動調整
  },
};

export default Start;
