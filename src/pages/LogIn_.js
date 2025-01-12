import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; // Linkコンポーネントをインポート
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Firebase設定をインポート
import Button from "../components/Button";

const LogIn = () => {
  const navigate = useNavigate();

  // useStateでメールアドレス、パスワード、エラーメッセージを管理
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // フォーム送信時にページがリロードされないようにする

    if (!email || !password) {
      setError("メールアドレスとパスワードを入力してください");
      return;
    }

    try {
      // Firebaseの認証を使ってユーザーをログイン
      const authInstance = getAuth(); // auth インスタンスを取得
      const userCredential = await signInWithEmailAndPassword(
        authInstance,
        email,
        password
      );
      const user = userCredential.user;

      console.log("ログイン成功: ", user);

      // ログイン成功後、/home に遷移
      navigate("/home");
    } catch (error) {
      console.error("エラーコード:", error.code); // エラーコードをコンソールに表示
      console.error("エラーメッセージ:", error.message); // エラーメッセージを表示

      let errorMessage = "エラーが発生しました";
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "ユーザーが見つかりません";
          break;
        case "auth/wrong-password":
          errorMessage = "パスワードが間違っています";
          break;
        case "auth/invalid-email":
          errorMessage = "無効なメールアドレスです";
          break;
        case "auth/invalid-credential":
          errorMessage =
            "無効な資格情報です。メールアドレスとパスワードを再確認してください";
          break;
        default:
          errorMessage = "不明なエラーが発生しました";
          break;
      }
      setError(errorMessage);
    }
  };

  return (
    <div style={styles.container}>
      <h1>ログイン画面</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // メールアドレスの状態を更新
            placeholder="メールアドレス"
            style={styles.input}
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // パスワードの状態を更新
            placeholder="パスワード"
            style={styles.input}
          />
        </div>
        {error && <p style={styles.errorMessage}>{error}</p>}{" "}
        {/* エラーメッセージを表示 */}
        <div>
          <Link to="/password-reset-email" style={styles.a}>
            パスワードが分からない
          </Link>{" "}
        </div>
        <Button type="submit" styleType="primary">
          ログイン
        </Button>
      </form>
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
  a: {
    color: "blue",
    textDecoration: "underline",
  },
  errorMessage: {
    color: "red",
    marginTop: "20px",
    fontWeight: "bold",
  },
};

export default LogIn;
