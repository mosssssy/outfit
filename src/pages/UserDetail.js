import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { FaUser, FaHeart } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../components/Button"; // Buttonを適切なパスからインポート
import MarginBoxHeight from "../components/MarginBox";

function UserDetail() {
  const navigate = useNavigate();
  const { userId } = useParams(); // URLパラメータからuserIdを取得
  const [userInfo, setUserInfo] = useState({});
  const [userFashions, setUserFashions] = useState([]);
  const [likedFashions, setLikedFashions] = useState({});
  const [loading, setLoading] = useState(false);
  const firestore = getFirestore();
  const [toastDisplayed, setToastDisplayed] = useState({}); // トーストの重複防止用

  const modelFashion = "/assets/model_01.png"; // モデル画像のパス
  const categoriesOrder = ["shoes", "bottoms", "hairs", "tops"]; // カテゴリの順序

  // ユーザー詳細をFirestoreから取得する関数
  const fetchUserInfo = async () => {
    try {
      console.log("Fetching user info for userId:", userId);
      const userDocRef = doc(firestore, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        console.log("User data found:", userDoc.data()); // ユーザーデータをログに出力
        setUserInfo(userDoc.data());
      } else {
        console.log("ユーザー情報が見つかりません");
      }
    } catch (error) {
      console.error("ユーザー情報の取得に失敗しました:", error);
    }
  };

  // ユーザーのファッションアイテムをFirestoreから取得する関数
  const fetchUserFashions = async () => {
    try {
      setLoading(true);
      const fashionsCollection = collection(firestore, "fashions");
      const fashionsQuery = query(
        fashionsCollection,
        where("userID", "==", userId),
        orderBy("timestamp", "desc"),
        limit(10)
      );
      const snapshot = await getDocs(fashionsQuery);
      const fashionsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserFashions(fashionsData);
      setLoading(false);
    } catch (error) {
      console.error("ファッションデータの取得に失敗しました:", error);
      setLoading(false);
    }
  };

  // ユーザーがいいねしたファッションデータを取得する関数
  const fetchLikes = async () => {
    try {
      const likesCollection = collection(firestore, "likes");
      const snapshot = await getDocs(likesCollection);
      const likesData = {};
      snapshot.docs.forEach((doc) => {
        const { userId: docUserId, fashionId, liked } = doc.data();
        if (!likesData[docUserId]) {
          likesData[docUserId] = {};
        }
        likesData[docUserId][fashionId] = liked; // ユーザーごとの「いいね」状態
      });
      setLikedFashions(likesData);
    } catch (error) {
      console.error("いいねデータの取得に失敗しました:", error);
    }
  };

  useEffect(() => {
    console.log("userId:", userId); // userIdが正しく取得できているか確認
    if (userId) {
      setLoading(true); // ロード中フラグを立てる
      fetchUserInfo();
      fetchUserFashions();
      fetchLikes(); // いいねデータを取得
    }
  }, [userId]);

  // ハートマークの状態を切り替える関数
  const toggleLike = async (fashionId) => {
    const currentLikedState = likedFashions[userId]?.[fashionId];
    const newLikedState = !currentLikedState;

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

    setLikedFashions((prev) => {
      const userLikes = prev[userId] || {};
      return {
        ...prev,
        [userId]: {
          ...userLikes,
          [fashionId]: newLikedState,
        },
      };
    });

    // Firestoreにユーザーごとの「いいね」状態を保存
    try {
      await setDoc(doc(firestore, "likes", `${userId}_${fashionId}`), {
        userId,
        fashionId,
        liked: newLikedState,
      });
    } catch (error) {
      console.error("Firestoreにいいねデータを保存できませんでした:", error);
    }
  };

  const handleFashionClick = (fashionId) => {
    navigate(`/fashion-detail/${fashionId}`); // ファッション詳細ページに遷移
  };

  const renderProcessedImages = (processedFashions, fashionId) => {
    if (!processedFashions) return null;
    const sortedImages = categoriesOrder
      .filter((category) => processedFashions[category])
      .map((category) => ({
        category,
        imageSrc: processedFashions[category],
      }));

    return (
      <div
        onClick={() => handleFashionClick(fashionId)}
        style={styles.imageContainer}
      >
        <img src={modelFashion} alt="Model" style={styles.modelImage} />
        {sortedImages.map(({ category, imageSrc }, index) => (
          <img
            key={category}
            src={imageSrc}
            alt={category}
            style={{
              ...styles.categoryImage,
              zIndex: index + 2,
            }}
          />
        ))}
        {/* ハートマークを追加 */}
        <FaHeart
          onClick={(e) => {
            e.stopPropagation(); // 親要素のクリックイベントを防止
            toggleLike(fashionId);
          }}
          style={{
            ...styles.heartIcon,
            color: likedFashions[userId]?.[fashionId] ? "#ee2a7b" : "#ffffff",
            stroke: likedFashions[userId]?.[fashionId] ? "none" : "#000000",
            strokeWidth: likedFashions[userId]?.[fashionId] ? "0" : "4",
          }}
        />
      </div>
    );
  };

  return (
    <div style={styles.mainContainer}>
      <div style={styles.topContainer}>
        <div style={styles.leftStyle}>
          <FaUser style={styles.userIcon} />
        </div>
        <div style={styles.rightStyle}>
          <h1 style={styles.name}>{userInfo.username || "Unknown User"}</h1>
        </div>
      </div>
      <MarginBoxHeight sizeType="big" />
      <div style={styles.bottomContainer}>
        <div style={styles.container}>
          <div style={styles.fashionsContainer}>
            {userFashions.length > 0
              ? userFashions.map((fashion) => (
                  <div key={fashion.id} style={styles.fashionCard}>
                    {renderProcessedImages(
                      fashion.processedFashions,
                      fashion.id
                    )}
                    <p
                      onClick={() => handleFashionClick(fashion.id)}
                      style={styles.title}
                    >
                      {fashion.title.length > 10
                        ? `${fashion.title.slice(0, 10)}…`
                        : fashion.title}
                    </p>
                  </div>
                ))
              : !loading && <p>このユーザーはまだ投稿していません</p>}
          </div>
          <ToastContainer />
          {loading && <p>Loading...</p>}
        </div>
      </div>
    </div>
  );
}

const styles = {
  mainContainer: {
    padding: "20px",
  },
  topContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
  },
  bottomContainer: {
    padding: "20px",
  },
  leftStyle: {
    flex: 1,
    display: "flex",
    justifyContent: "right",
  },
  rightStyle: {
    flex: 2,
    paddingLeft: "40px",
  },
  name: {
    fontSize: "64px",
  },
  userIcon: {
    fontSize: "8rem",
    marginRight: "20px",
  },
  heartIcon: {
    position: "absolute",
    bottom: "-40px",
    right: "10px",
    fontSize: "24px",
    cursor: "pointer",
  },
  fashionsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
  },
  fashionCard: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "8px",
    width: "240px",
    backgroundColor: "#f9f9f9",
  },
  imageContainer: {
    position: "relative",
    width: "240px",
    height: "420px",
    border: "1px solid #ccc",
    backgroundColor: "#D3D3D3",
    marginBottom: "10px",
    cursor: "pointer",
  },
  modelImage: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "240px",
    height: "420px",
    zIndex: 0,
  },
  categoryImage: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "240px",
    height: "420px",
  },
  title: {
    fontWeight: "bold",
    textDecoration: "underline",
    cursor: "pointer",
  },
  username: { color: "black", textDecoration: "underline" },
  errorMessage: { color: "red", fontWeight: "bold" },
  customToast: {
    backgroundColor: "#8a8787", // 背景色を#8a8787に設定
    color: "#fff", // テキストの色を白に設定
    borderRadius: "8px", // 角を丸くする
    padding: "10px", // パディングの設定
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // 少しの影をつける
  },
};

export default UserDetail;
