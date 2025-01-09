import React from "react";
import { useNavigate } from "react-router-dom";

const PasswordResetEmail = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1>パスワード再設定用メール送信画面</h1>
      <div>
        <input
          type="email"
          // value={email}
          // onChange={handleEmailChange}
          placeholder="メールアドレス"
          style={styles.input}
        />
      </div>
      <button onClick={() => navigate("/password-reset")} style={styles.button}>
        パスワード再設定用メールを送信する
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
    cursor: "pointer",
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
