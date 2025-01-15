import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  setDoc,
} from "firebase/firestore"; // docとsetDocをインポート
import { getAuth } from "firebase/auth";
import { FaHeart, FaUser } from "react-icons/fa"; // FaUserをインポート
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../components/Button"; // 必要なら適宜変更

function MyPage() {
  const [fashions, setFashions] = useState([]); // ユーザーのファッションを格納
  const [likedFashions, setLikedFashions] = useState({}); // いいね状態を管理
  const [loading, setLoading] = useState(false); // ローディング状態
  const [userId, setUserId] = useState(null); // ログイン中のユーザーID
  const firestore = getFirestore(); // Firestoreインスタンス
  const auth = getAuth();

  // Firebase Authからユーザー情報を取得
  const getCurrentUserId = () => {
    const user = auth.currentUser;
    return user ? user.uid : null;
  };

  // ログイン中のユーザーIDを設定
  useEffect(() => {
    const currentUserId = getCurrentUserId();
    if (currentUserId) {
      setUserId(currentUserId);
    }
  }, []);

  // Firestoreから「いいね」データを取得する関数
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
        likesData[docUserId][fashionId] = liked;
      });
      setLikedFashions(likesData);
    } catch (error) {
      console.error("いいねデータの取得に失敗しました:", error);
    }
  };

  // ユーザーのファッションを取得する関数
  const fetchUserFashions = async () => {
    try {
      setLoading(true);
      const fashionsCollection = collection(firestore, "fashions");
      const q = query(
        fashionsCollection,
        where("userID", "==", userId), // ログイン中のユーザーIDに一致するファッションを取得
        orderBy("timestamp", "desc")
      );
      const snapshot = await getDocs(q);
      const fashionsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFashions(fashionsData);
      setLoading(false);
    } catch (error) {
      console.error("Firestoreからデータを取得できませんでした:", error);
      setLoading(false);
    }
  };

  // 初期データ取得
  useEffect(() => {
    if (userId) {
      fetchUserFashions(); // ユーザーのファッションを取得
      fetchLikes(); // いいねデータを取得
    }
  }, [userId]);

  // ハートマークの状態を切り替える関数
  const toggleLike = async (fashionId) => {
    const currentLikedState = likedFashions[userId]?.[fashionId];
    if (currentLikedState !== true) {
      toast.success("ファッションをいいねしました！", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }

    const newLikedState = !likedFashions[userId]?.[fashionId];

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

  const renderProcessedImages = (processedFashions, fashionId) => {
    if (!processedFashions) return null;

    const sortedImages = ["shoes", "bottoms", "hairs", "tops"]
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
        <img src="/assets/model_01.png" alt="Model" style={styles.modelImage} />
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
        <FaHeart
          onClick={(e) => {
            e.stopPropagation(); // 親要素のクリックイベントを防止
            toggleLike(fashionId);
          }}
          style={{
            ...styles.heartIcon,
            color: likedFashions[userId]?.[fashionId] ? "#ee2a7b" : "#ffffff",
          }}
        />
      </div>
    );
  };

  const handleFashionClick = (fashionId) => {
    // 詳細ページへの遷移処理
  };

  return (
    <div style={styles.mainContainer}>
      <div style={styles.topContainer}>
        <div style={styles.leftStyle}>
          <FaUser style={styles.userIcon} />
        </div>
        <div style={styles.rightStyle}>
          <h1 style={styles.name}>{username}</h1>
        </div>
      </div>
      <div style={styles.bottomContainer}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {fashions.length > 0 ? (
              fashions.map((fashion) => (
                <div key={fashion.id} style={{ margin: "10px" }}>
                  {renderProcessedImages(fashion.processedFashions, fashion.id)}
                  <p>{fashion.title}</p>
                </div>
              ))
            ) : (
              <p>ファッションがありません</p>
            )}
          </div>
        )}
        <ToastContainer />
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
    justifyContent: "center",
  },
  rightStyle: {
    flex: 2,
    paddingLeft: "20px",
  },
  name: {
    fontSize: "40px",
  },
  userIcon: {
    fontSize: "8rem",
    marginRight: "20px",
  },
  imageContainer: { position: "relative", width: "200px", height: "400px" },
  modelImage: { width: "100%", height: "100%" },
  categoryImage: { position: "absolute", top: 0, left: 0 },
  heartIcon: {
    position: "absolute",
    top: "10px",
    right: "10px",
    fontSize: "24px",
  },
  fashionCard: { margin: "10px" },
  errorMessage: { color: "red" },
  fashionsContainer: { display: "flex", flexWrap: "wrap" },
  title: { cursor: "pointer" },
  username: { textDecoration: "none", color: "#000" },
};

export default MyPage;
