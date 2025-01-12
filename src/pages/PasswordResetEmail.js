import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

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
      <Button onClick={() => navigate("/password-reset")} styleType="primary">
        パスワード再設定用メールを送信する
      </Button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
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
