import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import MarginBoxHeight from "../components/MarginBox";

const FashionDetail = () => {
  const { fashionId } = useParams(); // URL から投稿 ID を取得
  const [fashion, setFashion] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const firestore = getFirestore();

  const modelFashion = "/assets/model_01.png"; // モデル画像のパス
  const categoriesOrder = ["shoes", "bottoms", "hairs", "tops"]; // カテゴリの順序

  useEffect(() => {
    const fetchFashionDetails = async () => {
      try {
        const fashionRef = doc(firestore, "fashions", fashionId);
        const fashionSnap = await getDoc(fashionRef);
        if (fashionSnap.exists()) {
          const fashionData = fashionSnap.data();
          setFashion(fashionData);

          // 投稿者情報も取得
          const userRef = doc(firestore, "users", fashionData.userID);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUser(userSnap.data());
          }
        } else {
          setError("投稿が見つかりませんでした");
        }
      } catch (err) {
        console.error("エラー:", err);
        setError("データの取得中にエラーが発生しました");
      }
    };

    fetchFashionDetails();
  }, [firestore, fashionId]);

  const renderProcessedImages = (processedFashions) => {
    if (!processedFashions) return null;

    const sortedImages = categoriesOrder
      .filter((category) => processedFashions[category])
      .map((category) => ({
        category,
        imageSrc: processedFashions[category],
      }));

    return (
      <div style={styles.imageContainer}>
        <img src={modelFashion} alt="Model" style={styles.modelImage} />
        {sortedImages.map(({ category, imageSrc, colorCode }, index) => (
          <div key={category} style={styles.imageWrapper}>
            <img
              key={category}
              src={imageSrc}
              alt={category}
              style={{
                ...styles.categoryImage,
                zIndex: index + 2,
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  if (error) {
    return <p style={styles.errorMessage}>{error}</p>;
  }

  if (!fashion) {
    return <p>Loading...</p>;
  }

  // 作成日時を分まで表示
  const formattedDate = new Date(fashion.timestamp).toLocaleString();

  return (
    <div style={styles.container}>
      <div style={styles.leftSide}>
        {renderProcessedImages(fashion.processedFashions)}
      </div>
      <div style={styles.rightSide}>
        <h2>{fashion.title}</h2>
        <MarginBoxHeight sizeType="small" />
        <p>{fashion.description}</p>
        <MarginBoxHeight sizeType="verysmall" />
        <ul style={styles.colorList}>
          <li style={styles.colorItem}>
            <span
              style={{
                ...styles.circle,
                backgroundColor: fashion.selectedColors.hairs,
              }}
            ></span>
            Hair: {fashion.selectedColors.hairs}
          </li>
          <li style={styles.colorItem}>
            <span
              style={{
                ...styles.circle,
                backgroundColor: fashion.selectedColors.tops,
              }}
            ></span>
            Top: {fashion.selectedColors.tops}
          </li>
          <li style={styles.colorItem}>
            <span
              style={{
                ...styles.circle,
                backgroundColor: fashion.selectedColors.bottoms,
              }}
            ></span>
            Bottom: {fashion.selectedColors.bottoms}
          </li>
          <li style={styles.colorItem}>
            <span
              style={{
                ...styles.circle,
                backgroundColor: fashion.selectedColors.shoes,
              }}
            ></span>
            Shoes: {fashion.selectedColors.shoes}
          </li>
        </ul>
        <MarginBoxHeight sizeType="verysmall" />

        <p>投稿者: {user ? user.username : "不明"}</p>
        <p>作成日時: {formattedDate}</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    padding: "20px",
  },
  leftSide: {
    position: "relative",
    width: "360px",
    height: "640px",
    border: "1px solid #ccc",
    backgroundColor: "#D3D3D3",
  },
  imageContainer: {
    position: "relative",
    width: "360px",
    height: "640px",
    border: "1px solid #ccc",
    backgroundColor: "#D3D3D3",
    marginBottom: "20px",
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
  imageWrapper: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "360px",
    height: "640px",
  },
  rightSide: {
    marginLeft: "20px",
    flex: 1,
  },
  colorList: {
    listStyleType: "none", // 通常の箇条書きの点をなくす
    paddingLeft: 0, // インデントをなくす
  },
  colorItem: {
    fontSize: "16px",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
  },
  circle: {
    display: "inline-block",
    width: "16px", // 円のサイズ
    height: "16px", // 円のサイズ
    marginRight: "10px", // 円とテキストの間のスペース
    borderRadius: "50%", // 円を丸くする
  },
  errorMessage: { color: "red", fontWeight: "bold" },
};

export default FashionDetail;
