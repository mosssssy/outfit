import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import BackLink from "../components/BackLink_";
import ErrorContainer from "../components/ErrorContainer_";

const PasswordResetEmail = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); // 入力されたメールアドレスを管理
  const [message, setMessage] = useState(""); // 成功/エラーのメッセージを管理
  const auth = getAuth();
  const db = getFirestore();
  const actionCodeSettings = {
    url: "http://localhost:3000/log-in", // ローカル環境用URL
    handleCodeInApp: false, // Webアプリ内でコードを処理する
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSendEmail = async () => {
    if (!email) {
      setMessage("メールアドレスを入力してください");
      return;
    }

    try {
      // Firebase Authを使ってパスワードリセットメールを送信
      await sendPasswordResetEmail(auth, email, actionCodeSettings);

      setMessage(
        "パスワード再設定用メールを送信しました。メールに記載のURLからパスワードを変更して下さい。"
      );
    } catch (error) {
      console.error("エラーが発生しました:", error);
      setMessage("メール送信に失敗しました。もう一度お試しください。");
    }
  };

  return (
    <div style={styles.container}>
      <BackLink
        onClick={() => {
          navigate(-1);
        }}
      />
      <h1>パスワード再設定用メール送信画面</h1>
      <div>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="メールアドレス"
          style={styles.input}
        />
      </div>
      {/* エラーメッセージの表示 */}
      <ErrorContainer error={message} />
      <Button onClick={handleSendEmail} styleType="primary">
        パスワード再設定用メールを送信する
      </Button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    margin: "50px",
  },
  input: {
    width: "30%",
    minWidth: "240px",
    padding: "8px",
    fontSize: "16px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  errorMessage: {
    color: "red",
    marginTop: "20px",
    fontWeight: "bold",
  },
};

export default PasswordResetEmail;
