import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import bottoms from "../components/BottomsList";
import tops from "../components/TopsList";
import shoes from "../components/ShoesList";
import hairs from "../components/HairsList";

// 初期選択ファッション
const initialFashions = {
  hairs: null,
  tops: null,
  bottoms: null,
  shoes: null,
};

const TABS = ["hairs", "tops", "bottoms", "shoes"];

function FashionSelector() {
  const navigate = useNavigate();
  const location = useLocation();

  // locationから受け取ったデータで初期状態を設定
  const [selectedFashions, setSelectedFashions] = useState(
    location.state?.selectedFashions || initialFashions
  );

  // 初期カラー設定
  const initialColors = {
    hairs: "#FFFFFF",
    tops: "#FFFFFF",
    bottoms: "#FFFFFF",
    shoes: "#FFFFFF",
  };

  const [selectedColors, setSelectedColors] = useState(
    location.state?.selectedColors || initialColors
  );

  // タブ切り替えを管理
  const [activeTab, setActiveTab] = useState("hairs");
  // エラーメッセージを管理
  const [error, setError] = useState("");

  // モデル
  const modelFashion = "/assets/model_01.png";

  // 選択されたタブに基づいて画像リストを返す
  const getTabContent = () => {
    switch (activeTab) {
      case "tops":
        return tops;
      case "hairs":
        return hairs;
      case "bottoms":
        return bottoms;
      case "shoes":
        return shoes;
      default:
        return [];
    }
  };

  // 画像クリック時に選択画像を更新
  const handleFashionClick = (FashionSrc) => {
    setSelectedFashions((prev) => ({
      ...prev,
      [activeTab]: FashionSrc,
    }));
  };

  // SelectColor画面への遷移＆バリデーション
  const handleSelectColorPage = () => {
    const isValid = Object.values(selectedFashions).every(
      (src) => src !== null
    );
    if (isValid) {
      navigate("/select-color", {
        state: { selectedFashions, selectedColors },
      });
    } else {
      setError("全てのカテゴリで画像を選択してください。");
    }
  };

  return (
    <div style={styles.mainContainer}>
      {/* 左側：選択した画像 */}
      <div style={styles.FashionContainer}>
        <img src={modelFashion} alt="Model" style={styles.modelFashion} />

        {TABS.map((category, index) =>
          selectedFashions[category] ? (
            <img
              key={category}
              src={selectedFashions[category]}
              alt={`Selected ${category}`}
              style={{ ...styles.selectedFashion, zIndex: index + 1 }}
            />
          ) : null
        )}
      </div>

      {/* 右側：タブと画像リスト */}
      <div style={styles.rightSide}>
        <h2>Fashion Selector</h2>
        <TabButtons activeTab={activeTab} onTabClick={setActiveTab} />

        <FashionList
          Fashions={getTabContent()}
          selectedFashion={selectedFashions[activeTab]}
          onFashionClick={handleFashionClick}
        />

        {error && <ErrorMessage message={error} />}

        <button onClick={handleSelectColorPage} style={styles.button}>
          Go to Select Color Page
        </button>
      </div>
    </div>
  );
}

// タブボタンコンポーネント
function TabButtons({ activeTab, onTabClick }) {
  return (
    <div style={styles.tabContainer}>
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabClick(tab)}
          style={{
            ...styles.tabButton,
            backgroundColor: activeTab === tab ? "lightblue" : "white",
          }}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  );
}

// 画像リストコンポーネント
function FashionList({ Fashions, selectedFashion, onFashionClick }) {
  return (
    <div style={styles.FashionList}>
      {Fashions.map((item) => (
        <img
          key={item.id}
          src={item.src}
          alt={item.alt}
          style={{
            ...styles.FashionItem,
            border:
              selectedFashion === item.src
                ? "4px solid black"
                : "1px solid black",
          }}
          onClick={() => onFashionClick(item.src)}
        />
      ))}
    </div>
  );
}

// エラーメッセージコンポーネント
function ErrorMessage({ message }) {
  return <p style={styles.errorMessage}>{message}</p>;
}

// スタイルオブジェクト
const styles = {
  mainContainer: {
    display: "flex",
    flexWrap: "wrap", // 複数の要素が横並びに収まるように
    padding: "20px",
  },
  FashionContainer: {
    position: "relative",
    width: "100%",
    height: "640px",
    maxWidth: "360px",
    marginRight: "20px",
    border: "1px solid #ccc",
    backgroundColor: "#D3D3D3",
  },
  modelFashion: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "auto",
    zIndex: 0,
  },
  selectedFashion: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "auto",
  },
  rightSide: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  tabContainer: {
    marginBottom: "20px",
  },
  tabButton: {
    padding: "10px",
    marginRight: "10px",
    border: "1px solid #ccc",
    cursor: "pointer",
  },
  FashionList: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  FashionItem: {
    width: "48%",
    maxWidth: "200px",
    marginBottom: "10px",
    cursor: "pointer",
  },
  errorMessage: {
    color: "red",
    marginTop: "20px",
    fontWeight: "bold",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    marginTop: "50px",
  },
};

export default FashionSelector;
