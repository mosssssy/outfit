import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth } from "../firebase";
import Button from "../components/Button";
import BackLink from "../components/BackLink_";
import ErrorContainer from "../components/ErrorContainer_";

const SignUp = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !username) {
      setError("すべてのフィールドを入力してください");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const db = getFirestore();
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        username: username,
        email: email,
      });

      console.log("ユーザー作成成功: ", user);
      navigate("/home");
    } catch (error) {
      let errorMessage = "エラーが発生しました";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "このメールアドレスはすでに使用されています";
          break;
        case "auth/invalid-email":
          errorMessage = "無効なメールアドレスです";
          break;
        case "auth/weak-password":
          errorMessage = "パスワードは6文字以上で入力してください";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "認証方法が許可されていません";
          break;
        default:
          errorMessage = "不明なエラーが発生しました";
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
      <h1 style={{ marginTop: "40px", fontSize: "3rem", fontWeight: "bold" }}>
        Out Fit
      </h1>
      <p style={{ marginBottom: "40px" }}>
        あなたらしい色合わせを見つけましょう
      </p>

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
            onChange={(e) => setEmail(e.target.value)}
            placeholder="メールアドレス"
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #000",
              borderRadius: "10px",
            }}
            required
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
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
            placeholder="パスワード (英数字6文字以上)"
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #000",
              borderRadius: "10px",
            }}
            required
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              textAlign: "left",
              marginBottom: "10px",
            }}
          >
            ユーザーネーム
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ユーザーネーム（8文字以内）"
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #000",
              borderRadius: "10px",
            }}
            required
          />
        </div>

        <ErrorContainer error={error}>{error}</ErrorContainer>
        <Button type="submit" styleType="signup">
          登録する
        </Button>
      </form>

      {/* <div
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
      </div> */}
    </div>
  );
};

const styles = {
  mainContainer: {
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

export default SignUp;
