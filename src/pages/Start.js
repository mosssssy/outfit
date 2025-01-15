import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button"; // 作成したButtonコンポーネントをインポート

const Start = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1>スタート画面</h1>
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
    margin: "96px 50px 50px 50px",
  },
};

export default Start;
