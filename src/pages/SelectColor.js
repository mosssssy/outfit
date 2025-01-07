import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SketchPicker } from "react-color"; // react-colorからカラーピッカーをインポート

function ColorSelector() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedImages } = location.state || {}; // 渡された画像を受け取る

  const modelImage = "/assets/model_01.png";
  const [selectedColor, setSelectedColor] = useState("#FFFFFF"); // 初期色を白に設定
  const canvasRef = useRef(null); // Canvas用のrefを設定

  const handleBack = () => {
    navigate("/SelectFashion", { state: { selectedImages } });
  };

  // カラー選択時の処理
  const handleColorChange = (color) => {
    setSelectedColor(color.hex); // 選ばれた色を保存
  };

  // 画像をCanvasに描画して白色部分を塗りつぶす
  const applyColorToImage = (imageSrc, color) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      // Canvasに画像を描画
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // 画像のピクセルデータを取得
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // 白色部分を選択した色で塗りつぶす
      for (let i = 0; i < data.length; i += 4) {
        // ピクセルのRGBが白に近い場合、色を変更
        if (data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255) {
          data[i] = parseInt(color.slice(1, 3), 16); // 赤
          data[i + 1] = parseInt(color.slice(3, 5), 16); // 緑
          data[i + 2] = parseInt(color.slice(5, 7), 16); // 青
        }
      }

      // 変更したピクセルデータをCanvasに反映
      ctx.putImageData(imageData, 0, 0);
    };
  };

  useEffect(() => {
    if (selectedImages && selectedImages["fashion"]) {
      applyColorToImage(selectedImages["fashion"], selectedColor);
    }
  }, [selectedColor, selectedImages]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div style={{ display: "flex" }}>
        {/* 左側：背景色をグレーに設定 */}
        <div
          style={{
            position: "relative",
            width: "360px",
            height: "640px",
            marginBottom: "20px",
            backgroundColor: "#D3D3D3", // グレーに設定
          }}
        >
          <canvas
            ref={canvasRef}
            width="360"
            height="640"
            style={{ width: "360px", height: "640px" }}
          />
        </div>

        {/* 右側：カラーピッカー */}
        <div style={{ marginTop: "20px" }}>
          <SketchPicker color={selectedColor} onChange={handleColorChange} />
        </div>
      </div>

      {/* FashionSelector に戻るボタン */}
      <button
        onClick={handleBack}
        style={{ padding: "10px 20px", fontSize: "16px", marginTop: "20px" }}
      >
        Back to Select Fashion
      </button>
    </div>
  );
}

export default ColorSelector;
