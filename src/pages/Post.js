import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// カテゴリーの順番
const categoriesOrder = ["shoes", "bottoms", "hairs", "tops"];

function Post() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedColors, processedFashions, selectedFashions } =
    location.state || {};

  const modelFashion = "/assets/model_01.png"; // モデル画像

  // タイトルと説明文の状態を管理
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // エラーメッセージを管理

  // タイトルの変更ハンドラ
  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    validateTitle(value);
  };

  // 説明文の変更ハンドラ
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
    validateDescription(value);
  };

  // バリデーションを含むタイトルのチェック
  const validateTitle = (value) => {
    if (value.length <= 30) {
      setErrorMessage(""); // 入力が適正ならエラーメッセージを消す
    } else {
      setErrorMessage("タイトルは30字以内で入力してください");
    }
  };

  // バリデーションを含む説明文のチェック
  const validateDescription = (value) => {
    if (value.length <= 100) {
      setErrorMessage(""); // 入力が適正ならエラーメッセージを消す
    } else {
      setErrorMessage("説明文は100文字以内で入力してください");
    }
  };

  // バリデーションを含むSubmit処理
  const handleSubmit = () => {
    if (!title.trim()) {
      setErrorMessage("タイトルは必須です");
      return;
    }

    if (title.length > 30) {
      setErrorMessage("タイトルは30字以内で入力してください");
      return;
    }

    // バリデーションが成功した場合
    setErrorMessage(""); // エラーメッセージをクリア
    console.log("Submitted!");
    navigate("/submitted");
  };

  // ナビゲーション処理
  const handleBack = () => {
    // "Select Fashion Page" に遷移し、現在選択されているファッションとカラーを渡す
    navigate("/select-color", {
      state: {
        selectedFashions,
        selectedColors,
        processedFashions,
      },
    });
  };

  // 処理された画像を表示する関数（カラーを反映した画像を描画）
  const renderProcessedImages = () => {
    if (!processedFashions) return null;

    return Object.entries(processedFashions).map(
      ([category, imageSrc], index) => (
        <img
          key={category}
          src={imageSrc}
          alt={category}
          style={{
            ...styles.categoryImage,
            zIndex: index + 2, // 重なり順（modelFashionより上）
          }}
        />
      )
    );
  };

  return (
    <div style={styles.container}>
      {/* 左側：モデル画像を最背面に配置 */}
      <div style={styles.leftSide}>
        {/* modelFashionの配置 */}
        <img
          src={modelFashion} // modelFashionを最背面に表示
          alt="Model"
          style={styles.modelImage}
        />
        {renderProcessedImages()} {/* 他のファッション画像を重ねて表示 */}
      </div>

      {/* 右側：情報入力フォームとボタン */}
      <div style={styles.rightSide}>
        <h2>Post Page</h2>

        {/* タイトル入力フォーム */}
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="タイトル (最大30字)"
            style={styles.input}
          />
          <div style={styles.countText}>{title.length}/30</div>
        </div>

        {/* 説明文入力フォーム */}
        <div style={{ marginBottom: "20px" }}>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="説明文 (最大100字)"
            rows="10"
            cols="30"
            style={styles.textArea}
          />
          <div style={styles.countText}>{description.length}/100</div>
        </div>

        {/* エラーメッセージ */}
        {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}

        {/* Submitボタン */}
        <button onClick={handleSubmit} style={styles.button}>
          Submit
        </button>

        <button
          onClick={handleBack} // 前の画面に戻る
          style={styles.button}
        >
          Back to Color Selector
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    // justifyContent: "space-between",
    padding: "20px",
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
    flex: 1,
    // width: "35%",
    // padding: "10px",
    // border: "1px solid #ccc",
    // borderRadius: "8px",
    // backgroundColor: "#f9f9f9",
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
    fontSize: "14px",
    marginBottom: "10px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    marginTop: "20px",
    // width: "100%",
    // backgroundColor: "#4CAF50",
    // color: "white",
    // border: "none",
    // borderRadius: "4px",
    // cursor: "pointer",
  },
};

export default Post;
