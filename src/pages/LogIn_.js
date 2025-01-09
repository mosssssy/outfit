import React from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1>ログイン画面</h1>
      <div>
        <input
          type="email"
          // value={email}
          // onChange={handleEmailChange}
          placeholder="メールアドレス"
          style={styles.input}
        />
      </div>
      <div>
        <input
          type="password"
          // value={password}
          // onChange={handlePasswordChange}
          placeholder="パスワード"
          style={styles.input}
        />
      </div>
      <div>
        <a onClick={() => navigate("/password-reset-email")} style={styles.a}>
          パスワードが分からない
        </a>
      </div>
      <button onClick={() => navigate("/home")} style={styles.button}>
        ログイン
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
  a: {
    color: "blue",
    textDecoration: "underline",
  },
};

export default SignUp;
