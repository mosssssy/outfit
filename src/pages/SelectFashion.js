import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import bottoms from "../components/BottomsList";
import tops from "../components/TopsList";
import shoes from "../components/ShoesList";
import hairs from "../components/HairsList";

function FashionSelector() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedImages, setSelectedImages] = useState(
    location.state?.selectedImages || {
      hairs: null,
      tops: null,
      bottoms: null,
      shoes: null,
    }
  );
  const [activeTab, setActiveTab] = useState("hairs");
  const [error, setError] = useState("");

  const modelImage = "/assets/model_01.png";

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

  const handleImageClick = (imageSrc) => {
    setSelectedImages((prev) => ({
      ...prev,
      [activeTab]: imageSrc,
    }));
  };

  const handleNextPage = () => {
    const isValid = Object.values(selectedImages).every((src) => src !== null);
    if (isValid) {
      navigate("/SelectColor", { state: { selectedImages } }); // 選択した画像を渡して遷移
    } else {
      setError("全てのカテゴリで画像を選択してください。");
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
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
              zIndex: 0,
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
                  zIndex: index + 1,
                }}
              />
            ) : null
          )}
        </div>

        {/* 右側：タブと選択肢の画像 */}
        <div>
          {/* タブ部分 */}
          <div style={{ marginBottom: "20px" }}>
            {["hairs", "tops", "bottoms", "shoes"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "10px",
                  marginRight: "10px",
                  backgroundColor: activeTab === tab ? "lightblue" : "white",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
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
                  border:
                    selectedImages[activeTab] === item.src
                      ? "4px solid black"
                      : "none", // 選択された画像に枠線を追加
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

      {/* ページ遷移ボタン */}
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <button
          onClick={handleNextPage}
          style={{ padding: "10px 20px", fontSize: "16px" }}
        >
          Go to Select Color Page
        </button>
      </div>
    </div>
  );
}

export default FashionSelector;
