import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; // Linkコンポーネントをインポート
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Firebase設定をインポート
import ErrorContainer from "../components/ErrorContainer_";
import logo from "../outfit_logo_black.png"; // PNGの透過画像をインポート
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function LogIn() {
  const [showPassword, setShowPassword] = useState(false);
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

      // ログイン成功後、/home に遷移
      navigate("/home");
    } catch (error) {
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
          errorMessage = `不明なエラーが発生しました (${error.code})`;
          break;
      }
      setError(errorMessage);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        textAlign: "center",
        backgroundColor: "#ffffff",
      }}
    >
      {/* ここにロゴが入る */}
      <BackLink
        onClick={() => {
          navigate("/");
        }}
      />
      <form
        style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}
        onSubmit={handleSubmit}
      >
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              textAlign: "left",
              marginBottom: "10px",
            }}
          >
            メールアドレス
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // メールアドレスの状態を更新
            placeholder="メールアドレス"
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #000",
              borderRadius: "10px",
            }}
          />
        </div>
        <div style={{ marginBottom: "20px", position: "relative" }}>
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
            value={password}
            onChange={(e) => setPassword(e.target.value)} // パスワードの状態を更新
            type={showPassword ? "text" : "password"}
            placeholder="パスワード (英数字6文字以上)"
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #000",
              borderRadius: "10px",
            }}
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "55%",
              cursor: "pointer",
              fontSize: "24px", // アイコンの大きさを調整
              color: "#333",
            }}
          />
        </div>
        <p style={{ color: "red", marginBottom: "20px" }}>
          有効なメールアドレスを入力してください。
          <br />
          パスワードは英数字6文字以上で設定してください。
        </p>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "15px",
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "1.2rem",
          }}
        >
          次へ
        </button>
      </form>
      <div>
        <Link to="/password-reset-email" style={styles.a}>
          パスワードが分からない
        </Link>{" "}
      </div>
      <ErrorContainer error={error}>{error}</ErrorContainer>

      <div
        style={{ marginTop: "40px", display: "flex", justifyContent: "center" }}
      >
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: "#333",
              margin: "5px",
              borderRadius: "5px",
            }}
          >
            <span style={{ color: "#fff", lineHeight: "50px" }}>♀</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  a: {
    color: "blue",
    textDecoration: "underline",
  },
};

export default LogIn;
