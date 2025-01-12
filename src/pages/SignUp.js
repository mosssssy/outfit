import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Firestoreをインポート
import { auth } from "../firebase"; // Firebase設定をインポート
import Button from "../components/Button";

const SignUp = () => {
  const navigate = useNavigate();

  // useStateを使って入力値を管理
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // フォームのデフォルト動作を防止

    if (!email || !password || !username) {
      setError("すべてのフィールドを入力してください");
      return;
    }

    try {
      // Firebaseの認証を使ってユーザーを作成
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // usersコレクションに新しいドキュメントを作成
      const db = getFirestore();
      const userRef = doc(db, "users", user.uid); // ユーザーのuidを使ってドキュメントを作成
      await setDoc(userRef, {
        username: username, // 新しいユーザー名を保存
        email: email, // メールアドレスも保存することができます
      });

      console.log("ユーザー作成成功: ", user);

      // 登録が成功したら/homeに遷移
      navigate("/home");
    } catch (error) {
      // Firebaseエラーコードに基づいてメッセージを表示
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
    <div style={styles.container}>
      <h1>新規登録画面</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="メールアドレス"
            style={styles.input}
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード"
            style={styles.input}
          />
        </div>
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ユーザーネーム（8文字以内）"
            style={styles.input}
          />
        </div>
        {error && <p style={styles.errorMessage}>{error}</p>}
        <Button type="submit" styleType="primary">
          登録する
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
  errorMessage: {
    color: "red",
    marginTop: "20px",
    fontWeight: "bold",
  },
};

export default SignUp;
