import React, { useState } from "react";
import {
  getAuth,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import MarginBoxHeight from "../components/MarginBox";
import ErrorContainer from "../components/ErrorContainer_";

function DeleteAccount() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const auth = getAuth();
  const user = auth.currentUser;

  const handleDeleteAccount = async () => {
    if (!user) {
      setErrorMessage("ログインしていません。");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("パスワードを入力してください。");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      // 再認証
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      // アカウント削除
      await deleteUser(user);
      navigate("/delete-success");
    } catch (error) {
      console.error("Failed to delete account:", error);
      if (error.code === "auth/wrong-password") {
        setErrorMessage("パスワードが間違っています。");
      } else if (error.code === "auth/requires-recent-login") {
        setErrorMessage("セキュリティ上の理由により、再ログインが必要です。");
      } else {
        setErrorMessage("アカウントの削除に失敗しました。");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <MarginBoxHeight />
      <h1>退会する</h1>
      {loading && <p>Loading...</p>}
      {successMessage && <p style={styles.success}>{successMessage}</p>}
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      {user && <p>現在のユーザー: {user.email}</p>}
      <div style={styles.form}>
        <label
          style={{
            display: "block",
            textAlign: "left",
            marginBottom: "10px",
          }}
        >
          パスワード
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="パスワードを入力"
          style={styles.input}
        />
        <MarginBoxHeight />
        <ErrorContainer error={errorMessage} />
        <Button onClick={handleDeleteAccount} styleType="danger">
          アカウントを削除する
        </Button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "400px",
    margin: "0 auto",
    textAlign: "center",
  },
  form: {
    marginTop: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "2px solid #000",
    borderRadius: "10px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#D9534F",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  success: {
    color: "green",
  },
  error: {
    color: "red",
  },
};

export default DeleteAccount;
