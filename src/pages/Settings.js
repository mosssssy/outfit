import React from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  return (
    <div style={styles.container}>
      <h1>設定画面</h1>
      <div style={styles.mainContainer}>
        <button
          onClick={() => navigate("/username-edit")}
          style={styles.button}
        >
          ユーザーネームを変更する
        </button>
        <button onClick={() => navigate("/email-reset")} style={styles.button}>
          メールアドレスを変更する
        </button>
        <button
          onClick={() => navigate("/password-reset-email")}
          style={styles.button}
        >
          パスワードを変更する
        </button>
        <button
          onClick={() => navigate("/delete-confirm")}
          style={styles.button}
        >
          退会する
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "40px" },
  mainContainer: {
    display: "flex", // フレックスボックスを有効化
    flexDirection: "column", // 縦方向に並べる
    alignItems: "center", // ボタンを中央揃え
    gap: "10px", // ボタン間のスペースを設定
    textAlign: "center",
  },
  button: {
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "5px",
    width: "100%",
    maxWidth: "500px",
    padding: "10px 20px",
    cursor: "pointer",
    fontSize: "16px",
    textAlign: "center", // ボタン内のテキストを中央揃え
  },
};

export default Settings;
