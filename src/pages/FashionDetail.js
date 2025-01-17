import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import MarginBoxHeight from "../components/MarginBox";
import { FaHeart } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
} from "firebase/firestore";
const FashionDetail = () => {
  const { fashionId } = useParams(); // URL から投稿 ID を取得
  const [fashion, setFashion] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const firestore = getFirestore();
  const navigate = useNavigate();
  const [likedFashions, setLikedFashions] = useState({}); // ハートの状態を管理
  const [userId, setUserId] = useState(null); // ログイン中のユーザーID
  const [toastDisplayed, setToastDisplayed] = useState({}); // トーストの重複防止用

  const modelFashion = "/assets/model_01.png"; // モデル画像のパス
  const categoriesOrder = ["shoes", "bottoms", "hairs", "tops"]; // カテゴリの順序

  // Firebase Auth からユーザー情報を取得
  const getCurrentUserId = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    return user ? user.uid : null;
  };

  // ログイン中のユーザーIDを設定
  useEffect(() => {
    setUserId(getCurrentUserId());
  }, []);

  // Firestoreから「いいね」状態を取得
  const fetchLikes = async () => {
    if (!userId) return;
    try {
      const likeDoc = await getDoc(
        doc(firestore, "likes", `${userId}_${fashionId}`)
      );
      if (likeDoc.exists()) {
        const likeData = likeDoc.data(); // ドキュメントのデータ取得
        setLikedFashions((prev) => ({
          ...prev,
          [userId]: {
            ...prev[userId],
            [fashionId]: likeData.liked, // 現在のファッションの「いいね」状態を設定
          },
        }));
      }
    } catch (error) {
      console.error("いいね状態の取得に失敗しました:", error);
    }
  };

  // 初期データ取得と「いいね」データの取得
  useEffect(() => {
    if (userId) {
      fetchLikes(); // 「いいね」データを取得
    }
  }, [firestore, userId]);

  // ハートマークの状態を切り替える関数
  const toggleLike = async () => {
    console.log("likedFashions:", likedFashions);
    const currentLikedState = likedFashions[userId]?.[fashionId] || false; // 現在の状態を確認
    const newLikedState = !currentLikedState; // 状態を反転

    // もし状態が変更されて「白からピンク」になったとき（未いいね -> いいね）
    if (currentLikedState !== true) {
      toast.success("ファッションをいいねしました！", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        className: "custom-toast", // カスタムクラスを指定
      });
    }

    setLikedFashions((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [fashionId]: newLikedState,
      },
    }));

    try {
      // Firestore に保存
      await setDoc(doc(firestore, "likes", `${userId}_${fashionId}`), {
        userId,
        fashionId,
        liked: newLikedState,
      });
      console.log(
        `Firestore に「いいね」データを保存しました: ${newLikedState}`
      );
    } catch (error) {
      console.error("Firestoreにいいねデータを保存できませんでした:", error);
    }
  };

  // ファッション詳細データを取得
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

  const formatText = (text) => {
    return text.split("\n").map((str, index) => (
      <span key={index}>
        {str}
        <br />
      </span>
    ));
  };

  const handleUserClick = (e, userId) => {
    e.preventDefault(); // これで再読み込みを防ぎます
    navigate(`/user-detail/${userId}`); // 遷移のための処理
  };

  // 作成日時を分まで表示
  const formattedDate = new Date(fashion.timestamp).toLocaleString();

  return (
    <div style={styles.container}>
      <div style={styles.leftSide}>
        {renderProcessedImages(fashion.processedFashions)}
        {/* ハートマークを追加 */}
        <FaHeart
          onClick={(e) => {
            toggleLike();
          }}
          style={{
            ...styles.heartIcon,
            color: likedFashions[userId]?.[fashionId] ? "#ee2a7b" : "#ffffff", // 塗りつぶし色
            stroke: likedFashions[userId]?.[fashionId] ? "none" : "#000000", // 縁取り色
            strokeWidth: likedFashions[userId]?.[fashionId] ? "0" : "4", // 縁取りの太さ
          }}
        />
      </div>
      <div style={styles.rightSide}>
        <h2>{fashion.title}</h2>
        <MarginBoxHeight sizeType="small" />
        <p>{formatText(fashion.description)}</p>
        <MarginBoxHeight sizeType="medium" />
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
        <p
          onClick={(e) => handleUserClick(e, fashion.userID)}
          style={styles.name}
        >
          投稿者: {user ? user.username : "不明"}
        </p>
        <p>作成日時: {formattedDate}</p>
      </div>
      <ToastContainer /> {/* トーストコンテナ */}
    </div>
  );
};

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
  imageContainer: {
    position: "relative",
    width: "360px",
    height: "640px",
    border: "1px solid #ccc",
    backgroundColor: "#D3D3D3",
    marginBottom: "20px",
  },
  heartIcon: {
    position: "absolute",
    bottom: "10px",
    right: "10px",
    fontSize: "40px",
    cursor: "pointer",
    zIndex: 1000, // アイコンを最前面に
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
  name: { color: "black", textDecoration: "underline", cursor: "pointer" },
};

export default FashionDetail;
