import React, { useState } from "react";
import { getAuth, updateEmail } from "firebase/auth";
import Button from "../components/Button";
import MarginBoxHeight from "../components/MarginBox";
import ErrorContainer from "../components/ErrorContainer_";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

function EmailReset() {
  const [newEmail, setNewEmail] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const auth = getAuth();
  const user = auth.currentUser;

  const handleEmailReset = async () => {
    if (!newEmail.trim()) {
      setErrorMessage("新しいメールアドレスを入力してください。");
      return;
    }

    try {
      setLoading(true);
      if (user) {
        await updateEmail(user, newEmail);
        toast.success("メールアドレスを更新しました！", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          className: "custom-toast", // カスタムクラスを指定
        });
        setErrorMessage("");
        setCurrentEmail(newEmail); // 更新されたメールを表示
        setNewEmail("");
      } else {
        setErrorMessage("ログインしていません。");
      }
    } catch (error) {
      console.error("Failed to update email:", error);
      if (error.code === "auth/requires-recent-login") {
        setErrorMessage("セキュリティ上の理由により、再ログインが必要です。");
      } else {
        setErrorMessage("メールアドレスの更新に失敗しました。");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>メールアドレスを再設定</h1>
      <MarginBoxHeight />
      {loading && <p>Loading...</p>}
      {successMessage && <p style={styles.success}>{successMessage}</p>}
      {user && <p>現在のメールアドレス: {user.email || currentEmail}</p>}
      <div style={styles.form}>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="新しいメールアドレスを入力"
          style={styles.input}
        />
        <MarginBoxHeight />
        <ErrorContainer error={errorMessage} />
        <Button onClick={handleEmailReset}>更新する</Button>
      </div>
      <ToastContainer />
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
    padding: "10px",
    fontSize: "16px",
    width: "80%",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
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

export default EmailReset;
