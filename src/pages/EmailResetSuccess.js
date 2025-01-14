import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const EmailResetSuccess = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1>メールアドレス再設定成功画面</h1>
      <Button onClick={() => navigate("/log-in")} styleType="primary">
        ログイン画面へ
      </Button>
    </div>
  );
};

const styles = {
  container: { padding: "20px", textAlign: "center" },
};

export default EmailResetSuccess;
