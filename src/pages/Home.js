import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  orderBy,
  query,
  startAfter,
  limit,
  setDoc,
  getDoc as getDocFromFirestore,
} from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Firebase Authenticationをインポート
import Button from "../components/Button";

function Home() {
  const navigate = useNavigate();
  const [fashions, setFashions] = useState([]); // fashionsデータを管理
  const [error, setError] = useState(""); // エラーメッセージを管理
  const [users, setUsers] = useState({}); // userIDとusernameをマッピングするオブジェクト
  const [lastVisible, setLastVisible] = useState(null); // 最後に表示されたドキュメントを管理
  const [loading, setLoading] = useState(false); // ローディング状態を管理
  const firestore = getFirestore(); // Firestoreインスタンス
  const [likedFashions, setLikedFashions] = useState({}); // ハートの状態を管理
  const [userId, setUserId] = useState(null); // ログイン中のユーザーID
  const [toastDisplayed, setToastDisplayed] = useState({}); // トーストの重複防止用

  const modelFashion = "/assets/model_01.png"; // モデル画像のパス
  const categoriesOrder = ["shoes", "bottoms", "hairs", "tops"]; // カテゴリの順序

  // Firebase Authからユーザー情報を取得
  const getCurrentUserId = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    return user ? user.uid : null; // ユーザーがいればUIDを返す
  };

  // ログイン中のユーザーIDを設定
  useEffect(() => {
    const userId = getCurrentUserId();
    if (userId) {
      setUserId(userId);
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
        likesData[docUserId][fashionId] = liked; // ユーザーごとの「いいね」状態
      });
      setLikedFashions(likesData); // likesデータを更新
    } catch (error) {
      console.error("いいねデータの取得に失敗しました:", error);
    }
  };

  // 初期データ取得と「いいね」データの取得
  useEffect(() => {
    fetchFashions();
    if (userId) {
      fetchLikes(); // 「いいね」データを取得
    }
  }, [firestore, userId]);

  // ハートマークの状態を切り替える関数
  const toggleLike = async (fashionId) => {
    const currentLikedState = likedFashions[userId]?.[fashionId]; // 現在の「いいね」状態

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

  // 最初に10件の投稿を取得する関数
  const fetchFashions = async (startDoc = null) => {
    try {
      setLoading(true);
      const fashionsCollection = collection(firestore, "fashions"); // fashionsコレクションを参照
      let fashionsQuery = query(
        fashionsCollection,
        orderBy("timestamp", "desc"),
        limit(10) // 10件の投稿を取得
      );

      if (startDoc) {
        fashionsQuery = query(fashionsQuery, startAfter(startDoc)); // 前回の最後の投稿から次の10件を取得
      }

      const snapshot = await getDocs(fashionsQuery); // クエリで並べ替えたドキュメントを取得
      const fashionsData = snapshot.docs.map((doc) => ({
        id: doc.id, // ドキュメントIDを含める
        ...doc.data(), // ドキュメントデータ
      }));

      // ユーザーデータの取得を並列に実行
      const usersData = {};
      const userPromises = fashionsData.map(async (fashion) => {
        const userDocRef = doc(firestore, "users", fashion.userID);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          usersData[fashion.userID] = userDoc.data().username; // usernameを保存
        }
      });

      // すべてのユーザー情報を取得するまで待つ
      await Promise.all(userPromises);

      if (startDoc) {
        setFashions((prevFashions) => [...prevFashions, ...fashionsData]); // 新しい投稿を追加
      } else {
        setFashions(fashionsData); // 最初の10件のみ表示
      }

      setUsers(usersData); // usersを更新
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]); // 最後のドキュメントを更新
      setLoading(false);

      // もし取得した投稿数が10件未満だった場合、ボタンを非表示にする
      if (snapshot.docs.length < 10) {
        setLastVisible(null); // 最後のドキュメントがない状態にする
      }
    } catch (error) {
      console.error("Firestoreからデータを取得できませんでした:", error);
      setError("データの取得に失敗しました");
      setLoading(false);
    }
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
        onClick={(e) => handleFashionClick(e, fashionId)}
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
            handleHeartClick(e, fashionId);
          }}
          style={{
            ...styles.heartIcon,
            color: likedFashions[userId]?.[fashionId] ? "#ee2a7b" : "#ffffff", // 塗りつぶし色
            stroke: likedFashions[userId]?.[fashionId] ? "none" : "#000000", // 縁取り色
            strokeWidth: likedFashions[userId]?.[fashionId] ? "0" : "4", // 縁取りの太さ
          }}
        />
      </div>
    );
  };

  const handleFashionClick = (e, fashionId) => {
    e.preventDefault(); // これで再読み込みを防ぎます
    navigate(`/fashion-detail/${fashionId}`); // 遷移のための処理
  };

  const handleHeartClick = (e, fashionId) => {
    e.stopPropagation(); // 親要素のクリックイベントを防止
    toggleLike(fashionId);
  };

  const handleUserClick = (e, userId) => {
    e.preventDefault(); // これで再読み込みを防ぎます
    navigate(`/user-detail/${userId}`); // 遷移のための処理
  };

  return (
    <div style={styles.container}>
      {error && <div style={styles.errorMessage}>{error}</div>}
      <div style={styles.fashionsContainer}>
        {fashions.length > 0
          ? fashions.map((fashion) => (
              <div key={fashion.id} style={styles.fashionCard}>
                {renderProcessedImages(fashion.processedFashions, fashion.id)}
                <p
                  onClick={(e) => handleFashionClick(e, fashion.id)}
                  style={styles.title}
                >
                  {fashion.title.length > 10
                    ? `${fashion.title.slice(0, 10)}…`
                    : fashion.title}
                </p>
                <p
                  onClick={(e) => handleUserClick(e, fashion.userID)}
                  style={styles.name}
                >
                  {users[fashion.userID] || "Unknown User"}
                </p>
              </div>
            ))
          : !loading && <p>表示可能なファッションがありません</p>}
      </div>
      <ToastContainer /> {/* トーストコンテナ */}
      {lastVisible && !loading && fashions.length >= 20 ? (
        <Button onClick={() => fetchFashions(lastVisible)} styleType="primary">
          次の20件を表示する
        </Button>
      ) : fashions.length > 0 && !loading ? (
        <p>すべての投稿を表示しました</p>
      ) : null}
      {loading && <p>Loading...</p>}
    </div>
  );
}

const styles = {
  container: { padding: "40px" },
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
  heartIcon: {
    position: "absolute",
    bottom: "-40px",
    right: "10px",
    fontSize: "24px",
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
  smallText: { fontSize: "12px", color: "#555" },
  title: {
    fontWeight: "bold",
    textDecoration: "underline",
    cursor: "pointer",
  },
  name: { color: "black", textDecoration: "underline", cursor: "pointer" },
  errorMessage: { color: "red", fontWeight: "bold" },
  customToast: {
    backgroundColor: "#8a8787", // 背景色を#8a8787に設定
    color: "#fff", // テキストの色を白に設定
    borderRadius: "8px", // 角を丸くする
    padding: "10px", // パディングの設定
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // 少しの影をつける
  },
};

export default Home;
