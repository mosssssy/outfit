import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const Start = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1>パスワード再設定成功画面</h1>
      <Button onClick={() => navigate("/log-in")} styleType="primary">
        ログイン画面へ
      </Button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
  },
};

export default Start;
