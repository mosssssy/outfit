import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bottoms from "../components/BottomsList"; // bottoms用のデータ
import tops from "../components/TopsList"; // tops用のデータ
import shoes from "../components/ShoesList"; // shoes用のデータ
import hairs from "../components/HairsList"; // hairs用のデータ

function FashionSelector() {
  const navigate = useNavigate();

  const [selectedImages, setSelectedImages] = useState({
    hairs: null,
    tops: null,
    bottoms: null,
    shoes: null,
  });
  const [activeTab, setActiveTab] = useState("hairs");
  const [error, setError] = useState(""); // バリデーションエラーメッセージ用

  const modelImage = "/assets/model_01.png"; // モデル用の画像（背面に固定）

  // タブごとのデータを切り替え
  const getTabContent = () => {
    switch (activeTab) {
      case "hairs":
        return hairs;
      case "tops":
        return tops;
      case "bottoms":
        return bottoms;
      case "shoes":
        return shoes;
      default:
        return [];
    }
  };

  // 画像を選択時にカテゴリごとに置換
  const handleImageClick = (imageSrc) => {
    setSelectedImages((prev) => ({
      ...prev,
      [activeTab]: imageSrc, // 現在のタブのカテゴリ画像を置換
    }));
  };

  const handleNextPage = () => {
    // 全てのカテゴリが選択されているかチェック
    const isValid = Object.values(selectedImages).every((src) => src !== null);

    if (isValid) {
      navigate("/SelectColor"); // ページ遷移
    } else {
      setError("全てのカテゴリで画像を選択してください。");
    }
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        {/* 左側：選択した画像 */}
        <div
          style={{
            position: "relative",
            width: "360px",
            height: "640px",
            border: "1px solid #ccc",
            marginRight: "20px",
          }}
        >
          {/* モデル画像を最背面に表示 */}
          <img
            src={modelImage}
            alt="Model"
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "360px",
              height: "640px",
              zIndex: 0, // 常に最背面
            }}
          />

          {/* 選択された画像を重ねて表示 */}
          {Object.entries(selectedImages).map(([category, src], index) =>
            src ? (
              <img
                key={category}
                src={src}
                alt={`Selected ${category}`}
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "360px",
                  height: "640px",
                  zIndex: index + 1, // モデル画像の上に表示
                }}
              />
            ) : null
          )}
        </div>

        {/* 右側：タブと選択肢の画像 */}
        <div>
          {/* タブ部分 */}
          <div style={{ marginBottom: "20px" }}>
            <button
              onClick={() => setActiveTab("hairs")}
              style={{
                padding: "10px",
                marginRight: "10px",
                backgroundColor: activeTab === "hairs" ? "lightblue" : "white",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              Hair
            </button>
            <button
              onClick={() => setActiveTab("tops")}
              style={{
                padding: "10px",
                marginRight: "10px",
                backgroundColor: activeTab === "tops" ? "lightblue" : "white",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              Tops
            </button>
            <button
              onClick={() => setActiveTab("bottoms")}
              style={{
                padding: "10px",
                marginRight: "10px",
                backgroundColor:
                  activeTab === "bottoms" ? "lightblue" : "white",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              Bottoms
            </button>
            <button
              onClick={() => setActiveTab("shoes")}
              style={{
                padding: "10px",
                marginRight: "10px",
                backgroundColor: activeTab === "shoes" ? "lightblue" : "white",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              Shoes
            </button>
          </div>

          {/* 画像リスト */}
          <div>
            {getTabContent().map((item) => (
              <img
                key={item.id}
                src={item.src}
                alt={item.alt}
                style={{
                  width: "180px",
                  height: "320px",
                  marginBottom: "10px",
                  cursor: "pointer",
                }}
                onClick={() => handleImageClick(item.src)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* エラーメッセージ表示 */}
      {error && (
        <p style={{ color: "red", marginTop: "20px", fontWeight: "bold" }}>
          {error}
        </p>
      )}

      {/* SelectColor画面への遷移 */}
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <button
          onClick={handleNextPage}
          style={{ padding: "10px 20px", fontSize: "16px" }}
        >
          Go to Select Color Page
        </button>
      </div>
    </>
  );
}

export default FashionSelector;
