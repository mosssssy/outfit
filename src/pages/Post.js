import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import Button from "../components/Button";
import BackLink from "../components/BackLink_";

const categoriesOrder = ["shoes", "bottoms", "hairs", "tops"];

function Post() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedColors, processedFashions, selectedFashions } =
    location.state || {};

  const modelFashion = "/assets/model_01.png";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const auth = getAuth();
  const firestore = getFirestore();

  useEffect(() => {
    setTitle(localStorage.getItem("title") || "");
    setDescription(localStorage.getItem("description") || "");
  }, []);

  const handleInputChange = (setter) => (e) => {
    const value = e.target.value;
    setter(value);
    localStorage.setItem(e.target.name, value);
  };

  const handleSubmit = async () => {
    if (!title.trim()) return setErrorMessage("タイトルは必須です");
    if (title.length > 30)
      return setErrorMessage("タイトルは30字以内で入力してください");
    if (description.length > 100)
      return setErrorMessage("説明文は100字以内で入力してください");

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("ユーザーが認証されていません");

      const docRef = doc(firestore, "fashions", `${user.uid}_${Date.now()}`);
      const postData = {
        title,
        description,
        userID: user.uid,
        selectedColors,
        selectedFashions,
        processedFashions,
        timestamp: Date.now(),
      };

      await setDoc(docRef, postData);

      localStorage.removeItem("title");
      localStorage.removeItem("description");

      navigate("/home");
    } catch (error) {
      setErrorMessage(error.message || "保存に失敗しました");
    }
  };

  const renderProcessedImages = () => {
    if (!processedFashions) return null;

    return categoriesOrder
      .filter((category) => processedFashions[category])
      .map((category, index) => (
        <img
          key={category}
          src={processedFashions[category]}
          alt={category}
          style={{
            ...styles.categoryImage,
            zIndex: index + 1,
          }}
        />
      ));
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftSide}>
        <img src={modelFashion} alt="Model" style={styles.modelImage} />
        {renderProcessedImages()}
      </div>
      <div style={styles.rightSide}>
        <BackLink
          onClick={() => navigate("/select-color", { state: location.state })}
        />
        <h2>Post Page</h2>
        <input
          type="text"
          name="title"
          value={title}
          onChange={handleInputChange(setTitle)}
          placeholder="タイトル (最大30字)"
          style={styles.input}
        />
        <div style={styles.countText}>{title.length}/30</div>
        <textarea
          name="description"
          value={description}
          onChange={handleInputChange(setDescription)}
          placeholder="説明文 (最大100字)"
          rows="5"
          style={styles.textArea}
        />
        <div style={styles.countText}>{description.length}/100</div>
        {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
        <Button onClick={handleSubmit} styleType="primary">
          Submit
        </Button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    padding: "20px 40px",
  },
  leftSide: {
    position: "relative",
    width: "360px",
    height: "640px",
    border: "1px solid #ccc",
    backgroundColor: "#D3D3D3",
  },
  modelImage: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "360px",
    height: "640px",
    zIndex: 0,
  },
  categoryImage: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "360px",
    height: "640px",
  },
  rightSide: {
    marginLeft: "20px",
    marginRight: "20px",
    flex: 1,
    position: "relative",
  },
  input: {
    width: "100%",
    padding: "8px",
    fontSize: "16px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  textArea: {
    width: "100%",
    padding: "8px",
    fontSize: "16px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  countText: {
    textAlign: "right",
    fontSize: "12px",
    color: "#888",
  },
  errorMessage: {
    color: "red",
    marginTop: "20px",
    fontWeight: "bold",
  },
};

export default Post;
