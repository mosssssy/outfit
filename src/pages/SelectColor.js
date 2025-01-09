import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// カラー変換のヘルパー関数
const rgbToHex = (r, g, b) =>
  `#${((1 << 24) | (r << 16) | (g << 8) | b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
const hexToRgb = (hex) => {
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return { r: 255, g: 255, b: 255 };
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
};

const ColorSelector = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedFashions } = location.state || {}; // 受け取ったFashion

  const modelFashion = "/assets/model_01.png"; // モデル画像
  const canvasRef = useRef(null);

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
  const [processedFashions, setProcessedFashions] = useState(
    location.state?.processedFashions || {}
  );

  // 選択されたファッション画像を処理
  useEffect(() => {
    if (selectedFashions) {
      Object.entries(selectedFashions).forEach(([category, src]) => {
        if (src) processFashion(category, src, selectedColors[category]);
      });
    }
  }, [selectedFashions, selectedColors]);

  // ファッション画像の処理
  const processFashion = (category, src, replacementColor) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.crossOrigin = "Anonymous"; // CORS対応
    img.src = src;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const fashionData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = fashionData.data;
      const targetColor = { r: 255, g: 255, b: 255 }; // 対象色（白）
      const replacement = hexToRgb(replacementColor);

      for (let i = 0; i < data.length; i += 4) {
        const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
        if (
          Math.abs(r - targetColor.r) < 200 &&
          Math.abs(g - targetColor.g) < 200 &&
          Math.abs(b - targetColor.b) < 200
        ) {
          data[i] = replacement.r; // R
          data[i + 1] = replacement.g; // G
          data[i + 2] = replacement.b; // B
        }
      }

      ctx.putImageData(fashionData, 0, 0);
      const newFashion = canvas.toDataURL();
      setProcessedFashions((prev) => ({ ...prev, [category]: newFashion }));
    };
  };

  // カラー変更時の処理
  const handleColorChange = (category, color) => {
    const updatedColors = { ...selectedColors, [category]: color };
    setSelectedColors(updatedColors);
    localStorage.setItem("selectedColors", JSON.stringify(updatedColors));
  };

  // ナビゲーション処理
  const handleBack = () => {
    // "Select Fashion Page" に遷移し、現在選択されているファッションとカラーを渡す
    navigate("/select-fashion", {
      state: { selectedFashions, selectedColors },
    });
  };

  // Post画面への遷移
  const handlePost = () => {
    navigate("/post", {
      state: {
        selectedFashions,
        selectedColors,
        processedFashions,
      },
    });
  };

  // カテゴリ順序
  const categoriesOrder = ["shoes", "bottoms", "hairs", "tops"];

  return (
    <div style={styles.mainContainer}>
      {/* 左側：選択されたファッション画像 */}
      <div style={styles.leftContainer}>
        <img src={modelFashion} alt="Model" style={styles.modelImage} />
        {categoriesOrder.map(
          (category, index) =>
            processedFashions[category] && (
              <img
                key={category}
                src={processedFashions[category]}
                alt={category}
                style={{ ...styles.categoryImage, zIndex: index + 1 }}
              />
            )
        )}
      </div>

      {/* 右側：カラーセレクターとカテゴリオプション */}
      <div style={styles.rightContainer}>
        <h2>Color Selector</h2>
        {["hairs", "tops", "bottoms", "shoes"].map((category) => (
          <div key={category} style={styles.colorPickerContainer}>
            <div style={styles.categoryLabel}>{category}</div>
            <input
              type="color"
              value={selectedColors[category]}
              onChange={(e) => handleColorChange(category, e.target.value)}
              style={styles.colorInput}
            />
            <input
              type="text"
              value={selectedColors[category]}
              onChange={(e) => handleColorChange(category, e.target.value)}
              placeholder="#FFFFFF"
              style={styles.hexInput}
            />
          </div>
        ))}
        <button onClick={handlePost} style={styles.button}>
          Go to Post Page
        </button>
        <button onClick={handleBack} style={styles.button}>
          Back to Select Fashion Page
        </button>
        <div style={styles.helpSection}>
          <p>困ったときは…</p>
          <ul>
            <li>
              <a
                href="https://colorhunt.co/"
                target="_blank"
                rel="noopener noreferrer"
              >
                colorhunt
              </a>
            </li>
            <li>
              <a
                href="https://www.schemecolor.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                schemecolor
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* 非表示のキャンバス */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

// スタイル設定（可読性と保守性の向上）
const styles = {
  mainContainer: {
    display: "flex",
    padding: "20px",
  },
  leftContainer: {
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
  rightContainer: {
    marginLeft: "20px",
    flex: 1,
  },
  colorPickerContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },
  categoryLabel: {
    width: "80px",
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  colorInput: {
    width: "100px",
    height: "50px",
    marginLeft: "10px",
    padding: "5px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  hexInput: {
    marginLeft: "10px",
    padding: "5px",
    width: "100px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    marginTop: "20px",
    cursor: "pointer",
  },
  helpSection: {
    marginTop: "20px",
  },
};

export default ColorSelector;
