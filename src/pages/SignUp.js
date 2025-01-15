import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth } from "../firebase";
import Button from "../components/Button";
import BackLink from "../components/BackLink_";
import ErrorContainer from "../components/ErrorContainer_";
import logo from "../outfit_logo_black.png"; // PNGの透過画像をインポート

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
    <div style={styles.container}>
      <BackLink
        onClick={() => {
          navigate("/");
        }}
      />
      {/* PNG画像を上に配置 */}
      <img src={logo} alt="App Logo" style={styles.logo} />
      <div style={styles.formContainer}></div>
      <h1>新規登録</h1>
  
    <form onSubmit={handleSubmit}>
        <div>
        
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="メールアドレス"
        style={styles.input}
        required
      />
    </div>
    <div>
     
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="パスワード (英数字6文字以上)"
        style={styles.input}
        required
      />
    </div>
    <div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="ユーザーネーム（8文字以内）"
        style={styles.input}
        required
      />
    </div>

    <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>

    <Button type="submit" styleType="primary">
          新規登録
        </Button>
  </form>

  
</div>

  );
};

const styles = {

    container: {
      textAlign: "center",
      margin: "20px",
      marginBottom: "20px", // フォーム下の余白も減らす
    },
    input: {
      width: "30%",
      minWidth: "240px",
      padding: "8px",
      fontSize: "16px",
      marginBottom: "10px",
      borderRadius: "10px",
      border: "2px solid #000", // 枠線を黒くする
    },
    
    logo: {
      width: "300px",  // ロゴサイズの調整
      height: "auto",
      marginBottom: "10px",  // ロゴと次の要素の間隔
    },
    formContainer: {
      marginTop: "10px", // フォームの間隔を微調整
    },
    label: {
      display: "block", // ブロック要素にして上に配置
      marginBottom: "5px", // ラベルと入力ボックスの間の余白
      fontSize: "14px", // ラベルのフォントサイズ
      textAlign: "left", // ラベル文字を左揃え
      color: "#333", // ラベルの文字色
    },
};

export default SignUp;