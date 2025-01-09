import React from "react";
import { useNavigate } from "react-router-dom";

const Start = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1>スタート画面</h1>
      <button onClick={() => navigate("/sign-up")} style={styles.button}>
        新規登録
      </button>
      <button onClick={() => navigate("/log-in")} style={styles.button}>
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
    cursor: "pointer",
  },
};

export default Start;
