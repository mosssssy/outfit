import React, { useState, useEffect } from "react";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Button from "../components/Button";
import MarginBoxHeight from "../components/MarginBox";
import ErrorContainer from "../components/ErrorContainer_";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

function UsernameEdit() {
  const [username, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const firestore = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchUsername(user.uid);
    }
  }, [user]);

  const fetchUsername = async (userId) => {
    try {
      setLoading(true);
      const userDocRef = doc(firestore, "users", userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUsername(userDoc.data().username || "");
      }
    } catch (error) {
      console.error("Failed to fetch username:", error);
      setErrorMessage("ユーザー名の取得に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = async () => {
    if (!newUsername.trim()) {
      setErrorMessage("新しいユーザー名を入力してください。");
      return;
    }

    try {
      setLoading(true);
      const userDocRef = doc(firestore, "users", user.uid);
      await updateDoc(userDocRef, { username: newUsername });
      setUsername(newUsername);
      setNewUsername("");
      toast.success("ユーザー名を更新しました！", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        className: "custom-toast", // カスタムクラスを指定
      });
    } catch (error) {
      console.error("Failed to update username:", error);
      setErrorMessage("ユーザー名の更新に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>ユーザー名を変更</h1>
      <MarginBoxHeight />
      {loading && <p>Loading...</p>}
      <p>現在のユーザー名: {username || "未設定"}</p>
      <div style={styles.form}>
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          placeholder="新しいユーザー名を入力"
          style={styles.input}
        />
        <MarginBoxHeight />
        <ErrorContainer error={errorMessage} />
        <Button onClick={handleUsernameChange}>更新する</Button>
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
    width: "30%",
    minWidth: "240px",
    padding: "8px",
    fontSize: "16px",
    marginBottom: "10px",
    borderRadius: "10px",
    border: "2px solid #000",
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

export default UsernameEdit;
