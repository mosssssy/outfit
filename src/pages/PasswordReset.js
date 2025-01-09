import React from "react";
import { useNavigate } from "react-router-dom";

const PasswordResetEmail = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1>パスワード再設定画面</h1>
      <div>
        <input
          type="password"
          // value={password}
          // onChange={handlePasswordChange}
          placeholder="新しいパスワード"
          style={styles.input}
        />
      </div>{" "}
      <div>
        <input
          type="password"
          // value={password}
          // onChange={handlePasswordChange}
          placeholder="新しいパスワード（確認用）"
          style={styles.input}
        />
      </div>
      <button
        onClick={() => navigate("/password-reset-success")}
        style={styles.button}
      >
        登録する
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
  },
  input: {
    width: "30%",
    padding: "8px",
    fontSize: "16px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
};

export default PasswordResetEmail;
