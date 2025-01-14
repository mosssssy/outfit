import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const DeleteConfirm = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1>退会確認画面</h1>
      <p>退会すると、全ての投稿を含めたユーザー情報が削除されます。</p>
      <p>よろしいですか？</p>
      <Button onClick={() => navigate("/delete-success")} styleType="danger">
        退会する
      </Button>
    </div>
  );
};

const styles = {
  container: { padding: "20px", textAlign: "center" },
};

export default DeleteConfirm;
