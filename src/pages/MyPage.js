import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  where,
  setDoc,
  getDoc as getDocFromFirestore,
} from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Firebase Authenticationをインポート
import { FaHeart, FaUser } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../components/Button"; // Buttonを適切なパスからインポート
import MarginBoxHeight from "../components/MarginBox";
import model from "../assets/models/model_01.PNG";

function MyPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(""); // エラーメッセージを管理
  const [users, setUsers] = useState({}); // userIDとusernameをマッピングするオブジェクト
  const [lastVisible, setLastVisible] = useState(null); // 最後に表示されたドキュメントを管理
  const [toastDisplayed, setToastDisplayed] = useState({}); // トーストの重複防止用
  const [fashions, setFashions] = useState([]); // ユーザーのファッションを格納
  const [likedFashions, setLikedFashions] = useState({}); // いいね状態を管理
  const [loading, setLoading] = useState(false); // ローディング状態
  const [userId, setUserId] = useState(null); // ログイン中のユーザーID
  const [username, setUsername] = useState(""); // ユーザー名
  const firestore = getFirestore(); // Firestoreインスタンス
  const auth = getAuth();

  const modelFashion = model; // モデル画像のパス
  const categoriesOrder = ["shoes", "bottoms", "hairs", "tops"]; // カテゴリの順序

  // Firebase Authからユーザー情報を取得
  const getCurrentUserId = () => {
    const user = auth.currentUser;
    return user ? user.uid : null;
  };

  // ログイン中のユーザーIDとユーザーネームを設定
  useEffect(() => {
    const currentUserId = getCurrentUserId();
    if (currentUserId) {
      setUserId(currentUserId);
      fetchUsername(currentUserId); // ユーザー名を取得
    }
  }, []);

  // ユーザー名をFirestoreから取得する関数
  const fetchUsername = async (userId) => {
    try {
      const userDoc = await getDoc(doc(firestore, "users", userId)); // "users"コレクションからユーザー情報を取得
      if (userDoc.exists()) {
        setUsername(userDoc.data().username); // Firestoreから取得したusernameを状態にセット
      } else {
        console.log("ユーザー情報が見つかりません");
      }
    } catch (error) {
      console.error("ユーザー名の取得に失敗しました:", error);
    }
  };

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
    if (userId) {
      fetchFashions();
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
    if (!userId) {
      setError("ログインが必要です");
      return; // userIdが設定されていない場合は取得処理を中止
    }

    try {
      setLoading(true);
      const fashionsCollection = collection(firestore, "fashions"); // fashionsコレクションを参照
      const fashionsQuery = query(
        fashionsCollection,
        orderBy("timestamp", "desc"),
        where("userID", "==", userId),
        limit(10)
      );

      if (startDoc) {
        fashionsQuery = query(fashionsQuery, startAfter(startDoc)); // 前回の最後の投稿から次の10件を取得
      }

      const snapshot = await getDocs(fashionsQuery); // クエリで並べ替えたドキュメントを取得
      const fashionsData = snapshot.docs.map((doc) => ({
        id: doc.id, // ドキュメントIDを含める
        ...doc.data(), // ドキュメントデータ
      }));

      const usersData = {};
      const userPromises = fashionsData.map(async (fashion) => {
        const userDocRef = doc(firestore, "users", fashion.userID);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          usersData[fashion.userID] = userDoc.data().username; // usernameを保存
        }
      });

      await Promise.all(userPromises);

      if (startDoc) {
        setFashions((prevFashions) => [...prevFashions, ...fashionsData]); // 新しい投稿を追加
      } else {
        setFashions(fashionsData); // 最初の10件のみ表示
      }

      setUsers(usersData); // usersを更新
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]); // 最後のドキュメントを更新
      setLoading(false);

      if (snapshot.docs.length < 10) {
        setLastVisible(null); // もし取得した投稿数が10件未満だった場合、ボタンを非表示
      }
    } catch (error) {
      console.error("Firestoreからデータを取得できませんでした:", error);
      setError("データの取得に失敗しました");
      setLoading(false);
    }
  };

  const handleFashionClick = (fashionId) => {
    navigate(`/fashion-detail/${fashionId}`); // 選択された投稿の詳細ページに遷移
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
            color: likedFashions[userId]?.[fashionId] ? "#ee2a7b" : "#ffffff", // 塗りつぶし色
            stroke: likedFashions[userId]?.[fashionId] ? "none" : "#000000", // 縁取り色
            strokeWidth: likedFashions[userId]?.[fashionId] ? "0" : "4", // 縁取りの太さ
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
          <h1 style={styles.name}>{username}</h1> {/* ユーザー名を表示 */}
        </div>
      </div>
      <MarginBoxHeight sizeType="big" />
      <div style={styles.bottomContainer}>
        <div style={styles.container}>
          {error && <div style={styles.errorMessage}>{error}</div>}
          <div style={styles.fashionsContainer}>
            {fashions.length > 0
              ? fashions.map((fashion) => (
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
              : !loading && <p>まだ投稿していません</p>}
          </div>
          <ToastContainer /> {/* トーストコンテナ */}
          {lastVisible && !loading && fashions.length >= 20 ? (
            <Button
              onClick={() => fetchFashions(lastVisible)}
              styleType="primary"
            >
              次の20件を表示する
            </Button>
          ) : fashions.length > 0 && !loading ? (
            <p>すべての投稿を表示しました</p>
          ) : null}
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
    top: "10px",
    right: "10px",
    fontSize: "24px",
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

export default MyPage;
