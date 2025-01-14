import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getAuth, confirmPasswordReset } from "firebase/auth";
import Button from "../components/Button";

const PasswordReset = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handlePasswordChange = async () => {
    const auth = getAuth();
    const oobCode = searchParams.get("oobCode"); // URLからoobCodeを取得

    if (!oobCode) {
      setError("リセットコードが無効です。もう一度お試しください。");
      return;
    }

    if (password !== confirmPassword) {
      setError("パスワードが一致しません。");
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, password); // Firebaseでパスワードを再設定
      console.log("パスワードが再設定されました");
      navigate("/login"); // 再設定後にログインページへリダイレクト
    } catch (err) {
      console.error("パスワードリセットエラー:", err);
      setError("パスワードリセットに失敗しました。");
    }
  };

  return (
    <div style={styles.container}>
      <h1>パスワード再設定</h1>
      {error && <p style={styles.error}>{error}</p>}
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="新しいパスワード"
        style={styles.input}
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="新しいパスワード（確認用）"
        style={styles.input}
      />
      <Button onClick={handlePasswordChange} styleType="primary">
        パスワードを再設定する
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
  error: {
    color: "red",
    marginBottom: "10px",
  },
};

export default PasswordReset;
